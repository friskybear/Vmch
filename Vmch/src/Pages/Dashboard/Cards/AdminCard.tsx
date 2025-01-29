import { AppContext } from "@/main";
import { Dispatch, SetStateAction, useContext, useState } from "react";

import { AdminFull } from "../Admin";

function DocCard(props: {
  align: string;
  item: AdminFull;
  set_selected_admin: (item: AdminFull | null) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        props.set_selected_admin(props.item);
      }}
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

function CardEng(props: { item: AdminFull }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className=" noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat  flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
        >
          <img
            src="/Images/vmch_grayscale.png"
            className="object-cover -mt-8 sm:-mt-0  md:-ml-6  mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow "
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <div className="flex flex-col justify-center items-start p-4 w-full ">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <div className="w-full text-center flex justify-center items-center md:items-start flex-col h-20">
                <h1 className="text-lg font-bold text-center">
                  {props.item.full_name}
                </h1>
                <h1 className="text-sm text-left">{props.item.email}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src="/Images/vmch_grayscale.png"
            className="hidden h-0 w-0"
            onLoadCapture={() => {
              setLoaded(true);
            }}
          />
          <CardLoader />
        </>
      )}
    </>
  );
}

function CardFa(props: { item: AdminFull }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className=" noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat  flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
        >
          <img
            src="/Images/vmch_grayscale.png"
            className="object-cover -mt-8 sm:-mt-0  md:-ml-6  mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow "
          />
          <div className="flex flex-col justify-center items-start p-4 w-full ">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <div className="w-full text-center flex justify-center items-center md:items-start flex-col h-20 ">
                <h1 className="text-lg font-bold text-center">
                  {props.item.full_name}
                </h1>
                <h1 className="text-sm text-left">{props.item.email}</h1>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src="/Images/vmch_grayscale.png"
            className="hidden h-0 w-0"
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <CardLoader />
        </>
      )}
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
