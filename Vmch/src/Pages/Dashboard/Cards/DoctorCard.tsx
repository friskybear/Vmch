import { AppContext } from "@/main";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { DoctorFull } from "../Admin";

function DoctorCard(props: {
  align: string;
  item: DoctorFull;
  set_selected_doctor: (item: DoctorFull | null) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        props.set_selected_doctor(props.item);
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

export default DoctorCard;

function CardEng(props: { item: DoctorFull }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className="noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
        >
          <img
            src={props.item.profile_image}
            className="object-cover -mt-8 sm:-mt-0 md:-ml-6 mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow"
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <div className="flex flex-col justify-center items-start p-4 w-full">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <h2 className="text-lg font-semibold">{props.item.full_name}</h2>
              <p className="text-sm ">Medical ID: {props.item.medical_code}</p>
              <p className="text-sm ">Specialty: {props.item.specialization}</p>
              <p className="text-sm ">
                Fee: ${(props.item.consultation_fee / 80000).toLocaleString()}
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    props.item.status === "active"
                      ? "bg-success-500"
                      : "bg-error-500"
                  }`}
                ></div>
                <p className="text-sm ">{props.item.status}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={props.item.profile_image}
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

function CardFa(props: { item: DoctorFull }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {loaded ? (
        <div
          role="button"
          tabIndex={0}
          className="noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5"
        >
          <img
            src={props.item.profile_image}
            className="object-cover -mt-8 sm:-mt-0 md:-ml-6 mask mask-squircle w-[60%] sm:w-[40%] md:w-[40%] shadow"
            onLoad={() => {
              setLoaded(true);
            }}
          />
          <div className="flex flex-col justify-center items-start p-4 w-full">
            <div className="flex flex-col justify-center items-center md:items-start w-full space-y-2">
              <h2 className="text-lg font-semibold">{props.item.full_name}</h2>
              <p className="text-sm ">کد پزشکی: {props.item.medical_code}</p>
              <p className="text-sm ">تخصص: {props.item.specialization}</p>
              <p className="text-sm ">
                ویزیت: {props.item.consultation_fee} تومان
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    props.item.status === "active"
                      ? "bg-success-500"
                      : "bg-error-500"
                  }`}
                ></div>
                <p className="text-sm ">
                  {props.item.status === "active" ? "فعال" : "غیرفعال"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={props.item.profile_image}
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
    <div className="noiseBackground bg-background-300 backdrop-blur-3xl bg-repeat flex flex-col md:flex-row justify-start items-center relative w-48 sm:w-64 md:w-80 h-80 md:h-40 mt-8 sm:mt-0 sm:ml-10 rounded-lg shadow-lg m-5 animate-pulse">
      <div className="w-24 h-24 bg-background-400 rounded-full -mt-8 sm:-mt-0 md:-ml-6"></div>
      <div className="flex flex-col justify-center items-start p-4 w-full space-y-3">
        <div className="h-4 bg-background-400 rounded w-3/4"></div>
        <div className="h-3 bg-background-400 rounded w-1/2"></div>
        <div className="h-3 bg-background-400 rounded w-1/2"></div>
        <div className="h-3 bg-background-400 rounded w-1/2"></div>
        <div className="h-3 bg-background-400 rounded w-1/4"></div>
      </div>
    </div>
  );
}
