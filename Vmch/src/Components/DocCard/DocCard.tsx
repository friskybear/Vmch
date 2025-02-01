import { AppContext } from "@/main";
import { Star, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { t } from "i18next";
interface Doctors {
  full_name: string;
  specialization: string;
  profile_image: string;
  consultation_fee: number;
  availability: number;
  medical_code: string;
  status: string;
  rate?: number;
}
interface Inputs {
  phone_number: number;
  national_code: number;
  full_name: string;
  gender: string;
}
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";

import { invoke } from "@tauri-apps/api/core";
interface IdSession {
  id: string;
}
let server = "";
let user_id = "";
const request_doctor = async (medical_code: string, data?: Inputs) => {
  const session_id = await invoke<IdSession>("post", {
    url: `${server}/add_session`,
    payload: {
      user_id: user_id,
      medical_code,
      guest_data: data ? data : null,
    },
  });
  console.log(session_id);
  window.location.replace(`/Sessions/${session_id.id}`);
};

function DocCard(props: { align: string; item: Doctors }) {
  const app = useContext(AppContext);
  server = app.appConfig.server;
  user_id = app.appConfig.user?.id || "";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {}}
      className={`text-text-800  ${
        props.align === "left" ? "font-Roboto" : "font-fa"
      }`}
    >
      {props.item ? (
        props.align == "left" ? (
          <CardEng item={props.item} />
        ) : (
          <CardFa item={props.item} />
        )
      ) : (
        <CardLoader />
      )}
    </div>
  );
}

export default DocCard;

function CardEng(props: { item: Doctors }) {
  const [loaded, setLoaded] = useState(false);
  const app = useContext(AppContext);
  const randomNumber = Math.floor(Math.random() * 100);
  const [formVisible, setFormVisible] = useState(false);
  const time = new Date().getTime().toString();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    request_doctor(props.item.medical_code, data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors]);
  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className=" noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat  flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
          onClick={() => {
            (document.getElementById(
              props.item.full_name + randomNumber.toString()
            ) as HTMLDialogElement)!.showModal();
          }}
        >
          <img
            src={props.item.profile_image + "?" + time}
            className="object-cover -mt-8 sm:-mt-0  md:-ml-6  mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow "
          />
          <div className="flex flex-col justify-center items-start p-4 w-full ">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <div className="w-full text-center flex justify-center items-center md:items-start flex-col h-20">
                <h1 className="text-lg font-bold text-center">
                  {props.item.full_name}
                </h1>
                <h1 className="text-sm text-left">
                  {props.item.specialization}
                </h1>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < props.item.rate!
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-text-100 dark:text-text-800 text-zinc-700"
                    }`}
                  />
                ))}
                <span className="ml-2 mt-1 ">{props.item.rate || "0.0"}</span>
              </div>
              <div className="w-full flex items-center justify-between    rounded-lg">
                <div className="">
                  <p className="text-xl font-semibold">
                    ${(props.item.consultation_fee / 80000).toLocaleString()}
                  </p>
                </div>

                {props.item.availability > 6 ? (
                  <div className="badge badge-md gap-1 dark:bg-primary-200 bg-primary-700 badge-ghost border-0 shadow-sm">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                ) : props.item.availability > 3 ? (
                  <div className="badge badge-md gap-1 badge-warning shadow-sm  ">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                ) : (
                  <div className="badge badge-md gap-1 badge-error shadow-sm">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={props.item.profile_image + "?" + time}
            className="hidden h-0 w-0"
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <CardLoader />
        </>
      )}
      <dialog
        id={props.item.full_name + randomNumber.toString()}
        className="modal modal-middle font-fa "
      >
        <Toaster
          richColors
          position="top-right"
          visibleToasts={100}
          dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
        />
        <div className="modal-box ">
          <div className="w-full h-full flex justify-center items-center flex-col">
            <img
              src={props.item.profile_image + "?" + time}
              className="object-cover avatar ring-text-800 ring-offset-background-300  rounded-full ring ring-offset-2 w-24 h-24 shadow"
            />
            <div className="flex flex-col justify-center items-center p-4 w-full ">
              <div className="flex flex-col justify-center items-center  w-full space-y-2">
                <div className="w-full text-center flex justify-center items-center flex-col h-20 ">
                  <h1 className="text-lg font-bold text-center">
                    {props.item.full_name}
                  </h1>
                  <h1 className="text-sm text-left">
                    {props.item.specialization}
                  </h1>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < props.item.rate!
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-text-100 dark:text-text-800 text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="ml-2 mt-1 ">{props.item.rate || "0.0"}</span>
                </div>
                <p className="text-xl font-semibold flex-wrap text-pretty w-40 flex justify-center items-center">
                  ${(props.item.consultation_fee / 80000).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="py-4">
              {t("site.wallet_balance")}:{" "}
              {
                //@ts-ignore
                (app.appConfig.user?.walletBalance / 80000).toLocaleString() ||
                  0.0
              }
            </p>
          </div>
          {props.item.consultation_fee <
            //@ts-ignore
            (app.appConfig.user?.walletBalance || 0.0) && (
            <div className="flex flex-col justify-end items-center">
              <div className="form-control w-60">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    onChange={() => {
                      setFormVisible(!formVisible);
                    }}
                    defaultChecked={false}
                  />
                  <span className="label-text text-center">
                    {t("site.request_doctor_guest")}
                  </span>
                </label>
              </div>
            </div>
          )}

          {formVisible && (
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  id="full_name"
                  placeholder={t("login.sign_up.full_name")}
                  className={`mt-1 mb-2 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("full_name", {
                    required: t("login.sign_up.full_name_is_required"),
                    pattern: {
                      value:
                        /^[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s]{1,29}$/,
                      message: t("login.sign_up.invalid_full_name"),
                    },
                  })}
                />
                {/* National Code */}
                <div className=" flex flex-row gap-2 ">
                  <select
                    defaultValue={t("gender.title")}
                    id="gender"
                    className={`mt-1 mb-2  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-2/3 ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                    {...register("gender", {
                      validate: (value) =>
                        value === "man" ||
                        value === "woman" ||
                        t("login.sign_up.gender_is_required"),
                    })}
                  >
                    <option disabled>{t("gender.title")}</option>
                    <option value="man">{t("gender.man")}</option>
                    <option value="woman">{t("gender.woman")}</option>
                  </select>
                  <input
                    type="number"
                    id="national_code"
                    placeholder={t("login.sign_up.national_code")}
                    className={`mt-1 mb-2 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full pr-8 ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                    {...register("national_code", {
                      required: t("login.sign_up.national_code_is_required"),
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: t("login.sign_up.invalid_national_code"),
                      },
                    })}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row gap-3 w-full">
                <input
                  type="tel"
                  id="phone_number"
                  placeholder={t("login.sign_up.phone_number")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("phone_number", {
                    required: t("login.sign_up.phone_number_is_required"),
                    pattern: {
                      value: /^[0-9]{10,14}$/,
                      message: t("login.sign_up.invalid_phone_number"),
                    },
                  })}
                />
              </div>
              <div className="modal-action ">
                <button className="btn btn-secondary" type="submit">
                  {t("site.request_doctor")}
                </button>
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        props.item.full_name + randomNumber.toString()
                      ) as HTMLDialogElement
                    )?.close();
                  }}
                  className="btn bg-text-800 hover:bg-text-800 text-text-300"
                >
                  {t("filter.cancel")}
                </button>
              </div>
            </form>
          )}
          {props.item.consultation_fee >
          //@ts-ignore
          (app.appConfig.user?.walletBalance || 0.0) ? (
            <>
              <p className="text-error text-center w-full">
                {t("site.not_enough_balance")}
              </p>
              <div className=" flex justify-end items-center">
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        props.item.full_name + randomNumber.toString()
                      ) as HTMLDialogElement
                    )?.close();
                  }}
                  className="btn bg-text-800 hover:bg-text-800 text-text-300"
                >
                  {t("filter.cancel")}
                </button>
              </div>
            </>
          ) : (
            <>
              {!formVisible && (
                <div className="modal-action ">
                  <button
                    className="btn btn-secondary"
                    type="submit"
                    onClick={() => {
                      request_doctor(props.item.medical_code);
                    }}
                  >
                    {t("site.request_doctor")}
                  </button>
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          props.item.full_name + randomNumber.toString()
                        ) as HTMLDialogElement
                      )?.close();
                    }}
                    className="btn bg-text-800 hover:bg-text-800 text-text-300"
                  >
                    {t("filter.cancel")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

function CardFa(props: { item: Doctors }) {
  const [loaded, setLoaded] = useState(false);
  const app = useContext(AppContext);
  const randomNumber = Math.floor(Math.random() * 100);
  const [formVisible, setFormVisible] = useState(false);
  const time = new Date().getTime().toString();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    request_doctor(props.item.medical_code, data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      //@ts-ignore
      if (errors[key]?.message) {
        //@ts-ignore
        toast.error(errors[key].message);
      }
    });
  }, [errors]);
  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className=" noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat  flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
          onClick={() => {
            (document.getElementById(
              props.item.full_name + randomNumber.toString()
            ) as HTMLDialogElement)!.showModal();
          }}
        >
          <img
            src={props.item.profile_image + "?" + time}
            className="object-cover -mt-8 sm:-mt-0  md:-ml-6  mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow "
          />
          <div className="flex flex-col justify-center items-start p-4 w-full ">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <div className="w-full text-center flex justify-center items-center md:items-start flex-col h-20 ">
                <h1 className="text-lg font-bold text-center">
                  {props.item.full_name}
                </h1>
                <h1 className="text-sm text-left">
                  {props.item.specialization}
                </h1>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < props.item.rate!
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-text-100 dark:text-text-800 text-zinc-700"
                    }`}
                  />
                ))}
                <span className="ml-2 mt-1 ">{props.item.rate || "0.0"}</span>
              </div>
              <div className="w-full flex items-center justify-between    rounded-lg">
                <div className="">
                  <p className="text-xl font-semibold flex-wrap w-40 flex">
                    {props.item.consultation_fee.toLocaleString()}
                    <span className="text-sm mt-1 ml-1"> ت </span>
                  </p>
                </div>

                {props.item.availability > 6 ? (
                  <div className="badge badge-md gap-1 dark:bg-primary-200 bg-primary-700 badge-ghost border-0 shadow-sm">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                ) : props.item.availability > 3 ? (
                  <div className="badge badge-md gap-1 badge-warning shadow-sm  ">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                ) : (
                  <div className="badge badge-md gap-1 badge-error shadow-sm">
                    <User className="w-5 h-5" />
                    <span className="">{props.item.availability}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={props.item.profile_image + "?" + time}
            className="hidden h-0 w-0"
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <CardLoader />
        </>
      )}

      <dialog
        id={props.item.full_name + randomNumber.toString()}
        className="modal modal-middle font-fa "
      >
        <Toaster
          richColors
          position="top-right"
          visibleToasts={100}
          dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
        />
        <div className="modal-box ">
          <div className="w-full h-full flex justify-center items-center flex-col">
            <img
              src={props.item.profile_image + "?" + time}
              className="object-cover avatar ring-text-800 ring-offset-background-300  rounded-full ring ring-offset-2 w-24 h-24 shadow"
            />
            <div className="flex flex-col justify-center items-center p-4 w-full ">
              <div className="flex flex-col justify-center items-center  w-full space-y-2">
                <div className="w-full text-center flex justify-center items-center flex-col h-20 ">
                  <h1 className="text-lg font-bold text-center">
                    {props.item.full_name}
                  </h1>
                  <h1 className="text-sm text-left">
                    {props.item.specialization}
                  </h1>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < props.item.rate!
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-text-100 dark:text-text-800 text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="ml-2 mt-1 ">{props.item.rate || "0.0"}</span>
                </div>
                <p className="text-xl font-semibold flex-wrap text-pretty w-40 flex justify-center items-center">
                  {props.item.consultation_fee.toLocaleString()}
                  <span className="text-sm mt-1 ml-1"> ت </span>
                </p>
              </div>
            </div>
            <p className="py-4">
              {t("site.wallet_balance")}:{" "}
              {
                //@ts-ignore
                app.appConfig.user?.walletBalance.toLocaleString() || 0.0
              }
            </p>
          </div>
          {props.item.consultation_fee <
            //@ts-ignore
            (app.appConfig.user?.walletBalance || 0.0) && (
            <div className="flex flex-col justify-end items-center">
              <div className="form-control w-60">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    onChange={() => {
                      setFormVisible(!formVisible);
                    }}
                    defaultChecked={false}
                  />
                  <span className="label-text">
                    {t("site.request_doctor_guest")}
                  </span>
                </label>
              </div>
            </div>
          )}

          {formVisible && (
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  id="full_name"
                  placeholder={t("login.sign_up.full_name")}
                  className={`mt-1 mb-2 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("full_name", {
                    required: t("login.sign_up.full_name_is_required"),
                    pattern: {
                      value:
                        /^[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s]{1,29}$/,
                      message: t("login.sign_up.invalid_full_name"),
                    },
                  })}
                />
                {/* National Code */}
                <div className=" flex flex-row gap-2 ">
                  <select
                    defaultValue={t("gender.title")}
                    id="gender"
                    className={`mt-1 mb-2  max-h-9 text-sm rounded-md  shadow-sm min-h-0 select select-bordered w-2/3 ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                    {...register("gender", {
                      validate: (value) =>
                        value === "man" ||
                        value === "woman" ||
                        t("login.sign_up.gender_is_required"),
                    })}
                  >
                    <option disabled>{t("gender.title")}</option>
                    <option value="man">{t("gender.man")}</option>
                    <option value="woman">{t("gender.woman")}</option>
                  </select>
                  <input
                    type="number"
                    id="national_code"
                    placeholder={t("login.sign_up.national_code")}
                    className={`mt-1 mb-2 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full pr-8 ${
                      app.appConfig.language === "fa" ? "text-right" : ""
                    }`}
                    {...register("national_code", {
                      required: t("login.sign_up.national_code_is_required"),
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: t("login.sign_up.invalid_national_code"),
                      },
                    })}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-row gap-3 w-full">
                <input
                  type="tel"
                  id="phone_number"
                  placeholder={t("login.sign_up.phone_number")}
                  className={`mt-1 input input-bordered input-ghost  max-h-9 text-sm rounded-md  shadow-sm w-full ${
                    app.appConfig.language === "fa" ? "text-right" : ""
                  }`}
                  {...register("phone_number", {
                    required: t("login.sign_up.phone_number_is_required"),
                    pattern: {
                      value: /^[0-9]{10,14}$/,
                      message: t("login.sign_up.invalid_phone_number"),
                    },
                  })}
                />
              </div>
              <div className="modal-action ">
                <button className="btn btn-secondary" type="submit">
                  {t("site.request_doctor")}
                </button>
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        props.item.full_name + randomNumber.toString()
                      ) as HTMLDialogElement
                    )?.close();
                  }}
                  className="btn bg-text-800 hover:bg-text-800 text-text-300"
                >
                  {t("filter.cancel")}
                </button>
              </div>
            </form>
          )}
          {props.item.consultation_fee >
          //@ts-ignore
          (app.appConfig.user?.walletBalance || 0.0) ? (
            <>
              <p className="text-error text-center w-full">
                {t("site.not_enough_balance")}
              </p>
              <div className=" flex justify-end items-center">
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        props.item.full_name + randomNumber.toString()
                      ) as HTMLDialogElement
                    )?.close();
                  }}
                  className="btn bg-text-800 hover:bg-text-800 text-text-300"
                >
                  {t("filter.cancel")}
                </button>
              </div>
            </>
          ) : (
            <>
              {!formVisible && (
                <div className="modal-action ">
                  <button
                    className="btn btn-secondary"
                    type="submit"
                    onClick={() => {
                      request_doctor(props.item.medical_code);
                    }}
                  >
                    {t("site.request_doctor")}
                  </button>
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          props.item.full_name + randomNumber.toString()
                        ) as HTMLDialogElement
                      )?.close();
                    }}
                    className="btn bg-text-800 hover:bg-text-800 text-text-300"
                  >
                    {t("filter.cancel")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

function CardLoader() {
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className=" doc bg-background-300 backdrop-blur-3xl bg-repeat  flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
      >
        <div className="object-cover -mt-8 sm:-mt-0  md:-ml-6  mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] h-40 shadow skeleton" />
        <div className="flex flex-col justify-center items-start p-4 w-full ">
          <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
            <div className="w-full text-center flex justify-center items-center md:items-start flex-col h-20">
              <h1 className="text-lg font-bold text-center skeleton w-32 h-5"></h1>
              <h1 className="text-sm text-left skeleton h-3 w-24 mt-1"></h1>
            </div>

            <div className="flex items-center space-x-1 skeleton w-40 h-5"></div>
            <div className="w-full flex items-center justify-between rounded-lg ">
              <div className="skeleton w-20 h-6"></div>

              <div className="badge badge-md gap-1 badge-ghost border-0 shadow-sm skeleton w-20 h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
