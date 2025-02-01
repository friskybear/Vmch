import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router";
import { AppContext } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { Session } from "../Sessions/Sessions";
import moment from "jalali-moment";
import { useTranslation } from "react-i18next";
import "./Chat.css";
import { CircleArrowLeft, Star, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import { listen } from "@tauri-apps/api/event";
interface ChatMessage {
  id: string;
  sender: {
    id: string;
    full_name: string;
  };
  receiver: String;
  content: string;
  created_at: string;
}

const Chat: React.FC = () => {
  const { id } = useParams();
  const [t] = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const app = useContext(AppContext);
  const [new_data, set_new_data] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  listen("new_message", () => {
    console.log("new message");
    set_new_data(new_data + 1);
  });
  const { data: session, isSuccess: sessionSuccess } = useQuery<Session>({
    queryKey: ["session", id, new_data],
    queryFn: async () => {
      try {
        const response = await invoke<Session>("fetch", {
          url: `${app.appConfig.server}/Session/${id}`,
        });
        if (response.status === "ended" && response.rating != 0) {
          setStars(response.rating!);
          setFeedback(response.feedback!);
        }
        return response;
      } catch (error) {
        console.error("Failed to fetch session:", error);
        throw error;
      }
    },
  });
  useEffect(() => {
    if (sessionSuccess) {
      const fetch_message = async () => {
        const data = await invoke<ChatMessage[]>("get_messages", {
          url: `${app.appConfig.server}/get_messages`,
          messages: session.messages || [],
        });
        setMessages(data);
      };
      fetch_message();
    }
  }, [sessionSuccess]);
  const HandleEndSession = async () => {
    console.log(id);
    await invoke("post", {
      url: `${app.appConfig.server}/end_session`,
      payload: { id: id },
    });
    set_new_data(new_data + 1);
    window.location.reload();
  };
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = async () => {
    if (newMessage.trim()) {
      await invoke("send_message", {
        url: `${app.appConfig.server}/send_message`,
        id: id,
        content: newMessage,
        sender: app.appConfig.user!.id,
        receiver:
          app.appConfig.user!.role === "admin" ||
          app.appConfig.user!.role === "doctor"
            ? session!.patient.id
            : session!.doctor.id,
      });
      set_new_data(new_data + 1);
      setNewMessage("");
    }
  };

  const HandelSubmit = async () => {
    if (stars > 0) {
      try {
        console.log({
          session_id: id,
          rate: stars,
          feedback: feedback,
        });
        await invoke("post", {
          url: `${app.appConfig.server}/rate`,
          payload: {
            id: id,
            rating: stars,
            feedback: feedback,
          },
        });
        set_new_data(new_data + 1);
        toast.success(t("site.rating_success"));
      } catch (error) {
        console.error("Failed to submit rating:", error);
        toast.error(t("site.rating_failed"));
      }
    }
  };

  return (
    <>
      <Toaster
        richColors
        position="top-right"
        visibleToasts={100}
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      />
      {session ? (
        <div className=" h-[200dvh] md:h-screen  noiseBackground bg-background-50 flex items-center flex-col justify-center p-4">
          <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
            {/* Admin/Doctor Side */}
            <div
              className="hidden md:flex justify-start items-center flex-col  w-1/3   bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden cool"
              dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
            >
              <div className="flex flex-col h-auto w-10/12 m-5 justify-center items-center bg-green-900/40 rounded-xl ">
                <div className="relative z-10 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">
                    {session?.doctor.full_name}
                  </h2>
                  <p className="">{session?.doctor.specialization}</p>
                </div>
                {session?.target_full_name && (
                  <div className="relative z-10 p-6 text-white w-full">
                    <h2 className="text-2xl font-bold mb-4 break-words text-pretty line-clamp-none overflow-hidden w-full ">
                      {session.target_full_name || "asdsad"}
                      {t("site.dashboard.guest_full_name")}
                    </h2>
                    <p className="break-words text-pretty line-clamp-none overflow-hidden w-full">
                      {session.target_national_code || "123123112"}
                      {t("site.dashboard.guest_national_code")}
                    </p>
                  </div>
                )}
              </div>
              {session?.status === "ended" && (
                <div className=" z-10 p-6 bg-green-800/30 rounded-xl w-10/12 text-text-100  font-bold text-center">
                  <div className="flex items-center mb-4 flex-col justify-center space-y-3">
                    <span className="">{t("site.dashboard.rate_session")}</span>
                    <div className="grid grid-cols-5  ">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-10 h-10 ${
                            i < stars!
                              ? "fill-yellow-500 text-yellow-500"
                              : "fill-text-100 dark:text-text-800 text-zinc-700"
                          }`}
                          onClick={() => {
                            if (
                              !session.rating &&
                              app.appConfig.user?.role === "patient"
                            ) {
                              setStars(i + 1);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 ">
                    {t("site.dashboard.session_end_at")}:{" "}
                    {app.appConfig.language === "fa"
                      ? moment(session!.end_time || Date.now())
                          .locale("fa")
                          .format("YYYY/MM/DD HH:mm")
                          .toString()
                      : new Date(
                          session!.end_time || Date.now()
                        ).toLocaleString("en-GB", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                  </h2>
                  <textarea
                    className={`w-full p-2 mb-4 textarea textarea-primary bg-background-100 text-text-800 h-40 ${
                      app.appConfig.language === "fa"
                        ? "text-right"
                        : "text-left"
                    }`}
                    value={feedback}
                    disabled={!!session.rating}
                    onChange={(e) => {
                      if (
                        app.appConfig.user?.role === "patient" &&
                        !session.rating
                      ) {
                        setFeedback(e.target.value);
                      }
                    }}
                    placeholder={t("site.dashboard.feedback_placeholder")}
                  />
                  <button className="btn min-w-0 w-full" onClick={HandelSubmit}>
                    {t("site.dashboard.submit_feedback")}
                  </button>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col bg-background-100 text-text-800">
              <div
                className={`h-10 w-full flex justify-end ${
                  (app.appConfig.user?.role === "admin" ||
                    app.appConfig.user?.role === "doctor") &&
                  session?.status !== "ended" &&
                  "justify-between"
                }  px-4 items-center`}
              >
                {(app.appConfig.user?.role === "admin" ||
                  app.appConfig.user?.role === "doctor") &&
                  session?.status !== "ended" && (
                    <button
                      className="btn min-w-0  p-0 mt-1 btn-outline outline-none border-none btn-error btn-square"
                      onClick={HandleEndSession}
                    >
                      <X className="h-8 w-8" />
                    </button>
                  )}
                <button
                  className="btn min-w-0 p-0 mt-1 btn-outline outline-none border-none btn-square btn-primary"
                  onClick={() => window.history.back()}
                >
                  <CircleArrowLeft className="h-8 w-8 rotate-180" />
                </button>
              </div>
              {/* Messages Container */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 h-[75dvh] flex flex-col-reverse">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.id.includes("admins") ||
                      msg.sender.id.includes("doctors")
                        ? "justify-start"
                        : "justify-end"
                    }`}
                    initial={{
                      opacity: 0,
                      x:
                        msg.sender.id.includes("admins") ||
                        msg.sender.id.includes("doctors")
                          ? -20
                          : 20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div
                      className={`chat h-full ${
                        msg.sender.id.includes("admins") ||
                        msg.sender.id.includes("doctors")
                          ? "chat-start"
                          : "chat-end"
                      }`}
                    >
                      <div className="chat-header">
                        {msg.sender.id.includes("users")
                          ? session?.target_full_name
                            ? session?.target_full_name
                            : msg.sender.full_name
                          : msg.sender.full_name}{" "}
                        <time className="text-xs ">
                          {moment(msg.created_at).fromNow()}
                        </time>
                      </div>
                      <div
                        className={`chat-bubble h-full ${
                          msg.sender.id.includes("admins")
                            ? "chat-bubble-warning"
                            : msg.sender.id.includes("doctors")
                            ? "bg-background-900 dark:bg-background-400"
                            : "bg-background-700 dark:bg-background-200"
                        }`}
                      >
                        <span className="text-pretty break-words h-full overflow-hidden">
                          {msg.content}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center text-gray-500 text-xs mt-2">
                  {t("site.dashboard.session_started_at")}:{" "}
                  {app.appConfig.language === "fa"
                    ? moment(session!.created_at || Date.now())
                        .locale("fa")
                        .format("YYYY/MM/DD HH:mm")
                        .toString()
                    : new Date(
                        session!.created_at || Date.now()
                      ).toLocaleString("en-GB", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 flex items-center space-x-2 w-full">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t(
                    `site.chat.${
                      session.status !== "ended"
                        ? "type_your_message..."
                        : "ended"
                    }`
                  )}
                  className="flex-grow p-2 border rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={session.status === "ended"}
                  dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="hover:bg-primary-600 text-white p-2 rounded-full bg-green-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div
            className="md:hidden flex justify-start items-center flex-col mt-10 rounded-lg  bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden cool"
            dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
          >
            <div className="flex flex-col h-auto w-10/12 m-5 justify-center items-center bg-green-900/40 rounded-xl ">
              <div className="relative z-10 p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  {session?.doctor.full_name}
                </h2>
                <p className="text-center">{session?.doctor.specialization}</p>
              </div>
              {session?.target_full_name && (
                <div className="relative z-10 p-6 text-white w-full">
                  <h2 className="text-2xl font-bold mb-4 break-words text-pretty line-clamp-none overflow-hidden w-full ">
                    {session.target_full_name || "asdsad"}
                    {t("site.dashboard.guest_full_name")}
                  </h2>
                  <p className="break-words text-pretty line-clamp-none overflow-hidden w-full">
                    {session.target_national_code || "123123112"}
                    {t("site.dashboard.guest_national_code")}
                  </p>
                </div>
              )}
            </div>
            {session?.status === "ended" && (
              <div className=" z-10 p-6 bg-green-800/30 rounded-xl w-10/12 text-text-100  font-bold text-center">
                <div className="flex items-center mb-4 flex-col justify-center space-y-3">
                  <span className="">{t("site.dashboard.rate_session")}</span>
                  <div className="grid grid-cols-5  ">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-10 h-10 ${
                          i < stars!
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-text-100 dark:text-text-800 text-zinc-700"
                        }`}
                        onClick={() => {
                          if (
                            !session.rating &&
                            app.appConfig.user?.role === "patient"
                          ) {
                            setStars(i + 1);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 ">
                  {t("site.dashboard.session_end_at")}:{" "}
                  {app.appConfig.language === "fa"
                    ? moment(session!.end_time || Date.now())
                        .locale("fa")
                        .format("YYYY/MM/DD HH:mm")
                        .toString()
                    : new Date(session!.end_time || Date.now()).toLocaleString(
                        "en-GB",
                        {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                </h2>
                <textarea
                  className={`w-full p-2 mb-4 textarea textarea-primary bg-background-100 text-text-800 h-40 ${
                    app.appConfig.language === "fa" ? "text-right" : "text-left"
                  }`}
                  value={feedback}
                  disabled={!!session.rating}
                  onChange={(e) => {
                    if (
                      app.appConfig.user?.role === "patient" &&
                      !session.rating
                    ) {
                      setFeedback(e.target.value);
                    }
                  }}
                  placeholder={t("site.dashboard.feedback_placeholder")}
                />
                <button className="btn min-w-0 w-full" onClick={HandelSubmit}>
                  {t("site.dashboard.submit_feedback")}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-screen bg-background-50 noiseBackground">
          <span className="loaderw  dark:invert-[90] " />
        </div>
      )}
    </>
  );
};

export default Chat;
