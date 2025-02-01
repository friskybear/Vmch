import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { AppContext } from "@/main";
import Loader from "@/Components/Loader/Loader";

import { WobbleCard } from "@/Components/WobbleCard/WobbleCard";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "jalali-moment";

interface Notification {
  id: string;
  message: string;
  type: "performance" | "session" | "general" | "new_doctor";
  created_at: string;
}

export default function Notifications() {
  const [page, set_page] = useState(1);
  const app = useContext(AppContext);
  const [visable_notifications, set_visable_notifications] = useState(
    (page - 1) * 40 + 40
  );

  const [ended, set_ended] = useState(false);
  const [notifications, set_notifications] = useState<Notification[]>([]);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["notifications", page, app.appConfig.user?.id],
    queryFn: async () => {
      let url = new URL(`${app.appConfig.server}/notifications`);
      url.searchParams.set("page", page.toString());
      const response = await invoke("post", {
        url: url.toString(),
        payload: {
          id: app.appConfig.user?.id,
          role: app.appConfig.user?.role,
        },
      });
      console.log(response);
      //@ts-ignore
      if (response[0]["type"]) return response as Notification[];
      if (JSON.stringify(response) === JSON.stringify("empty")) return [];
      throw new Error("Failed to fetch notifications.");
    },
  });

  useEffect(() => {
    if (isError) {
      console.log("error");
    }
    if (isSuccess) {
      set_notifications((prev) => {
        set_visable_notifications(prev.length + data.length);
        if (data.length < 40) {
          set_ended(true);
        }
        return [...prev, ...data];
      });
    }
  }, [data, isError, isSuccess]);

  return (
    <div
      className={`w-full h-full flex justify-center items-center flex-col text-text-900 ${
        app.appConfig.language === "fa" ? "font-fa" : "font-roboto"
      }`}
    >
      <div id="notifications" className="flex flex-col md:flex-row w-full">
        <InfiniteScroll
          hasMore={!ended}
          loader={<Loader size={40} color={[6, 147, 126]} />}
          dataLength={visable_notifications}
          next={() => set_page(page + 1)}
          className="flex flex-row flex-wrap justify-center items-center w-full"
        >
          {Array.from({ length: visable_notifications }).map((_, idx) => (
            <NotificationCard
              key={idx}
              align={app.appConfig.language === "fa" ? "rtl" : "ltr"}
              item={notifications[idx]}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

function NotificationCard(props: { item: Notification; align: string }) {
  const [t] = useTranslation();
  const app = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "performance":
        return "badge-error";
      case "session":
        return "badge-warning";
      case "general":
        return "badge-primary";
      case "new_doctor":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      {props.item ? (
        <WobbleCard
          containerClassName="w-screen mx-4 my-2 bg-background-300"
          className="p-4 cursor-pointer hover:bg-background-200 transition-colors noiseBackground "
        >
          <div
            className="flex flex-col gap-3 text-text-900 font-bold z-20"
            dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <label className="text-2xl opacity-80  w-[90%]   font-extrabold  overflow-hidden">
                  {t("notification_message")}:
                  <p className=" w-[80%] md:w-[90%] text-xl max-h-40 overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-3 ">
                    {props.item.message}
                  </p>
                </label>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <span
                  className={`badge noiseBackground ${getTypeBadgeClass(
                    props.item.type
                  )}`}
                >
                  {t(`notification_type.${props.item.type}`)}
                </span>
                <span className="opacity-70 text-sm text-center">
                  {app.appConfig.language === "fa"
                    ? moment(props.item.created_at || Date.now())
                        .locale("fa")
                        .format("YYYY/MM/DD HH:mm")
                        .toString()
                    : new Date(
                        props.item.created_at || Date.now()
                      ).toLocaleString("en-GB", {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                </span>
                <button
                  className="btn noiseBackground btn-secondary z-20"
                  onClick={openDialog}
                >
                  {t("read_more")}
                </button>
              </div>
            </div>
          </div>
        </WobbleCard>
      ) : (
        <WobbleCard
          containerClassName="w-full mx-4 my-2 bg-background-300 animate-pulse"
          className="p-4 cursor-pointer hover:bg-background-200 transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="bg-skeleton-300 w-full h-6"></div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <span className="badge bg-skeleton-300 w-24 h-6"></span>
                <span className="bg-skeleton-300 w-24 h-6"></span>
              </div>
            </div>
          </div>
        </WobbleCard>
      )}

      {/* Notification Details Dialog */}
      {props.item && (
        <dialog
          id={`notification-dialog-${props.item.id}`}
          className="modal"
          open={isDialogOpen}
          style={{
            direction: app.appConfig.language === "fa" ? "rtl" : "ltr",
          }}
        >
          <div className="modal-box bg-background-50">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeDialog}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">
              {t(`notification_type.${props.item.type}`)} {t("notification")}
            </h3>
            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-semibold">{t("message")}:</span>{" "}
                {props.item.message}
              </p>
              <p className="text-sm">
                <span className="font-semibold">{t("type")}:</span>{" "}
                <span
                  className={`badge ${getTypeBadgeClass(props.item.type)}`}
                >
                  {t(`notification_type`)}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">{t("created_at")}:</span>{" "}
                {app.appConfig.language === "fa"
                  ? moment(props.item.created_at || Date.now())
                      .locale("fa")
                      .format("YYYY/MM/DD HH:mm")
                      .toString()
                  : new Date(
                      props.item.created_at || Date.now()
                    ).toLocaleString("en-GB", {
                      timeZone: "UTC",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
              </p>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeDialog}>{t("close")}</button>
          </form>
        </dialog>
      )}
    </>
  );
}
