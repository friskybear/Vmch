import { JSX, useState } from "react";
import { platform } from "@tauri-apps/plugin-os";
import "./App.css";
import { Marquee } from "@/Components/Marquee/Marquee";
import Loader from "@/Components/Loader/Loader";
const is_mobile = platform() == "android" || platform() == "ios";

function shuffle(array: (() => JSX.Element)[]): (() => JSX.Element)[] {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function SC() {
  const [state, _setState] = useState("در حال اتصال");
  return (
    <div
      className={` relative w-screen h-screen  overflow-hidden font-fa ${
        is_mobile ? "" : "rounded-[8%]"
      }`}
      data-tauri-drag-region
    >
      <section
        className=" relative w-screen h-screen from-background-700 to-background-600 bg-gradient-to-tr select-none overflow-hidden flex justify-center items-center"
        data-tauri-drag-region
      >
        <div className="relative z-20" id="logo" data-tauri-drag-region>
          <span data-tauri-drag-region>
            <div className="w-32 h-[4.4rem] absolute bg-primary-800 rounded-t-full top-[4.4rem] left-2"></div>
            <img
              src="/Images/logo-back.png"
              className="size-40 absolute brightness-75"
              data-tauri-drag-region
            />
            <img
              src="/Images/logo-transparent.png"
              className="size-40 invert-[.9] opacity-100"
              data-tauri-drag-region
            />
            <div
              className="h-10 w-36 bg-white text-teal-900 ml-0.5 mt-2 badge badge-primary rounded-full  items-center  font-extrabold flex justify-center "
              data-tauri-drag-region
            >
              {state !== "وصل شد" && <Loader size={40} color={[6, 147, 126]} />}
              {state}
            </div>
          </span>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 blur-lg rounded-lg bg-gradient-to-t from-primary-800 z-30  "
          data-tauri-drag-region
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-12 blur-lg rounded-lg bg-gradient-to-b from-primary-800 z-30  "
          data-tauri-drag-region
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-12 blur-lg rounded-lg bg-gradient-to-r from-primary-800  z-30 "
          data-tauri-drag-region
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-12 blur-lg rounded-lg bg-gradient-to-l from-primary-800 z-30 "
          data-tauri-drag-region
        />
        <ul
          className=" absolute flex flex-col justify-evenly h-[max(120dvw,120dvh)] w-[max(120dvw,120dvh)] items-center  rotate-45 "
          id="icons"
          data-tauri-drag-region
        >
          {Array.from({
            length: Math.ceil(
              Math.max(window.innerWidth, window.innerHeight) / 80
            ),
          }).map((_, index) => (
            <Marquee
              pauseOnHover
              key={index}
              vertical={false}
              reverse={index % 2 == 0}
              className="[--duration:20s]"
              data-tauri-drag-region
              repeat={Math.ceil(
                Math.sqrt(
                  Math.pow(window.innerHeight, 2) +
                    Math.pow(window.innerWidth, 2)
                ) / 70
              )}
            >
              {shuffle([icn_1, icn_2, icn_3, icn_4, icn_5]).map(
                (img, index) => (
                  <div
                    key={index}
                    className="size-10 justify-center items-center flex -rotate-45"
                    data-tauri-drag-region
                  >
                    {img()}
                  </div>
                )
              )}
            </Marquee>
          ))}
        </ul>
      </section>
    </div>
  );
}
export default SC;

// const health_mark = () => {
//   return (
//     <>
//       <svg
//         height="100px"
//         width="100px"
//         version="1.1"
//         id="_x32_"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="-51.2 -51.2 614.40 614.40"
//         fill="#eafbec"
//         className={`absolute left-[1dvw] -top-[1.7dvh]`}
//         stroke="#eafbec"
//         data-tauri-drag-region
//       >
//         <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//         <g
//           id="SVGRepo_tracerCarrier"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         ></g>
//         <g id="SVGRepo_iconCarrier">
//           {" "}
//           <style type="text/css"> </style>{" "}
//           <g>
//             {" "}
//             <path
//               className="st0"
//               d="M29.002,0v368.238L256.002,512l226.996-143.762V0H29.002z M379.593,247.561H287.92v91.659h-63.836v-91.659 h-91.673v-63.843h91.673v-91.68h63.836v91.68h91.673V247.561z"
//             ></path>{" "}
//           </g>{" "}
//         </g>
//       </svg>
//     </>
//   );
// };

const icn_1 = () => {
  return (
    <>
      <svg
        fill="#ffffff"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
        data-tauri-drag-region
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="_x31_"></g> <g id="_x32_"></g> <g id="_x33_"></g>{" "}
          <g id="_x34_"></g> <g id="_x35_"></g> <g id="_x36_"></g>{" "}
          <g id="_x37_"></g> <g id="_x38_"></g> <g id="_x39_"></g>{" "}
          <g id="_x31_0">
            {" "}
            <path
              data-tauri-drag-region
              d="M29,54c-0.5,0-1-0.2-1.4-0.6L14.1,39.9c-2.7-2.7-2.7-7,0-9.7l16.1-16.1c2.7-2.7,7-2.7,9.7,0l13.5,13.5c0.8,0.8,0.8,2,0,2.8 l-23,23C30,53.8,29.5,54,29,54z M35,16.1c-0.7,0-1.5,0.3-2,0.8L16.9,33c-1.1,1.1-1.1,2.9,0,4L29,49.2L49.2,29L37.1,16.9 C36.5,16.3,35.8,16.1,35,16.1z M65,87.9c-1.8,0-3.5-0.7-4.9-2L47.3,73.1c-0.4-0.4-0.6-0.9-0.6-1.4s0.2-1,0.6-1.4l23-23 c0.8-0.8,2-0.8,2.8,0l12.8,12.8c2.7,2.7,2.7,7,0,9.7L69.8,85.9C68.5,87.3,66.7,87.9,65,87.9z M51.6,71.7l11.4,11.4 c1.1,1.1,2.9,1.1,4,0L83.1,67c1.1-1.1,1.1-2.9,0-4L71.7,51.6L51.6,71.7z M48.7,73.7L48.7,73.7c-0.5,0-1-0.2-1.4-0.6L27.6,53.4 c-0.8-0.8-0.8-2,0-2.8l23-23c0.8-0.8,2.1-0.8,2.8,0l19.7,19.7c0.4,0.4,0.6,0.9,0.6,1.4s-0.2,1-0.6,1.4l-23,23 C49.8,73.5,49.3,73.7,48.7,73.7z M31.8,52l16.9,16.9l20.2-20.2L52,31.8L31.8,52z M43.2,53.1c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4c-0.8-0.8-2.1-0.8-2.8,0c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 C42.3,53.7,42.8,53.5,43.2,53.1z M53.1,43.3c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4c-0.8-0.8-2.1-0.8-2.8,0 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6S52.7,43.6,53.1,43.3z M50.2,60.2c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4c-0.8-0.8-2.1-0.7-2.8,0c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 C49.3,60.8,49.8,60.6,50.2,60.2z M60.1,50.3c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4c-0.8-0.8-2.1-0.8-2.8,0 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6C59.2,50.9,59.8,50.7,60.1,50.3z"
            ></path>{" "}
          </g>{" "}
          <g id="_x31_1"></g> <g id="_x31_2"></g> <g id="_x31_3"></g>{" "}
          <g id="_x31_4"></g> <g id="_x31_5"></g> <g id="_x31_6"></g>{" "}
          <g id="_x31_7"></g> <g id="_x31_8"></g> <g id="_x31_9"></g>{" "}
          <g id="_x32_0"></g> <g id="_x32_1"></g> <g id="_x32_2"></g>{" "}
          <g id="_x32_3"></g> <g id="_x32_4"></g> <g id="_x32_5"></g>{" "}
        </g>
      </svg>
    </>
  );
};
const icn_2 = () => {
  return (
    <>
      <svg
        fill="#eafbec"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        data-tauri-drag-region
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="_x31_"></g> <g id="_x32_"></g> <g id="_x33_"></g>{" "}
          <g id="_x34_"></g> <g id="_x35_"></g> <g id="_x36_"></g>{" "}
          <g id="_x37_"></g> <g id="_x38_"></g> <g id="_x39_"></g>{" "}
          <g id="_x31_0"></g> <g id="_x31_1"></g> <g id="_x31_2"></g>{" "}
          <g id="_x31_3"></g> <g id="_x31_4"></g> <g id="_x31_5"></g>{" "}
          <g id="_x31_6"></g> <g id="_x31_7"></g> <g id="_x31_8"></g>{" "}
          <g id="_x31_9"></g>{" "}
          <g id="_x32_0">
            {" "}
            <path
              data-tauri-drag-region
              d="M74.9,86.8H33.2c-1.1,0-2-0.9-2-2c0-1.1,0.8-2,1.9-2c6-0.3,10.7-5.3,10.7-11.3c0-6-4.7-11-10.7-11.3 c-1.1-0.1-1.9-0.9-1.9-2v-37c0-4.3,3.5-7.9,7.9-7.9h35.8c4.3,0,7.9,3.5,7.9,7.9v57.7C82.8,83.2,79.2,86.8,74.9,86.8z M42.9,82.8h32 c2.1,0,3.9-1.7,3.9-3.9V21.1c0-2.1-1.7-3.9-3.9-3.9H39.1c-2.1,0-3.9,1.7-3.9,3.9v35.2c7.2,1.3,12.6,7.6,12.6,15.1 C47.9,75.9,46,79.9,42.9,82.8z M21.8,81.3c-0.6,0-1.2-0.3-1.6-0.8c-1.9-2.6-3-5.8-3-9.1c0-8.4,6.9-15.3,15.3-15.3 c0.3,0,0.5,0,0.8,0c4.7,0.2,9,2.6,11.7,6.4c0.6,0.9,0.4,2.1-0.5,2.8L23,80.9C22.7,81.2,22.2,81.3,21.8,81.3z M32.6,60.1 c-6.2,0-11.3,5.1-11.3,11.3c0,1.8,0.4,3.5,1.2,5l18.1-13.1c-2-1.9-4.5-3.1-7.3-3.2C33,60.1,32.8,60.1,32.6,60.1z M32.6,86.8 c-4.9,0-9.5-2.3-12.3-6.2c-0.3-0.4-0.4-1-0.4-1.5c0.1-0.5,0.4-1,0.8-1.3l21.6-15.6c0.4-0.3,1-0.4,1.5-0.4c0.5,0.1,1,0.4,1.3,0.8 c1.9,2.6,2.9,5.7,2.9,8.9c0,8.2-6.4,14.9-14.5,15.3C33.1,86.7,32.8,86.8,32.6,86.8z M24.8,79.7c2.2,2.1,5.3,3.2,8.4,3.1 c6-0.3,10.7-5.3,10.7-11.3c0-1.7-0.4-3.3-1.1-4.8L24.8,79.7z M45.9,35.6c-4,0-7.3-3.3-7.3-7.3s3.3-7.3,7.3-7.3c4,0,7.3,3.3,7.3,7.3 S49.9,35.6,45.9,35.6z M45.9,25c-1.8,0-3.3,1.5-3.3,3.3c0,1.8,1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3C49.2,26.5,47.7,25,45.9,25z M68,35.6c-4,0-7.3-3.3-7.3-7.3S63.9,21,68,21c4,0,7.3,3.3,7.3,7.3S72,35.6,68,35.6z M68,25c-1.8,0-3.3,1.5-3.3,3.3 c0,1.8,1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3C71.3,26.5,69.8,25,68,25z M45.9,57.7c-4,0-7.3-3.3-7.3-7.3s3.3-7.3,7.3-7.3 c4,0,7.3,3.3,7.3,7.3S49.9,57.7,45.9,57.7z M45.9,47.1c-1.8,0-3.3,1.5-3.3,3.3s1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3 S47.7,47.1,45.9,47.1z M68,57.7c-4,0-7.3-3.3-7.3-7.3s3.3-7.3,7.3-7.3c4,0,7.3,3.3,7.3,7.3S72,57.7,68,57.7z M68,47.1 c-1.8,0-3.3,1.5-3.3,3.3s1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3S69.8,47.1,68,47.1z M68,77.7c-4,0-7.3-3.3-7.3-7.3S63.9,63,68,63 c4,0,7.3,3.3,7.3,7.3S72,77.7,68,77.7z M68,67c-1.8,0-3.3,1.5-3.3,3.3s1.5,3.3,3.3,3.3s3.3-1.5,3.3-3.3S69.8,67,68,67z"
            ></path>{" "}
          </g>{" "}
          <g id="_x32_1"></g> <g id="_x32_2"></g> <g id="_x32_3"></g>{" "}
          <g id="_x32_4"></g> <g id="_x32_5"></g>{" "}
        </g>
      </svg>
    </>
  );
};
const icn_3 = () => {
  return (
    <>
      <svg
        fill="#eafbec"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        data-tauri-drag-region
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="_x31_">
            {" "}
            <path
              data-tauri-drag-region
              d="M63.8,32.7H36.3c-1.1,0-2-0.9-2-2v-9.5c0-1.1,0.9-2,2-2h27.5c1.1,0,2,0.9,2,2v9.5C65.8,31.8,64.9,32.7,63.8,32.7z M38.3,28.7h23.5v-5.5H38.3V28.7z M82.3,80.8H17.7c-2.8,0-5.1-2.3-5.1-5.1v-42c0-2.8,2.3-5.1,5.1-5.1h64.6c2.8,0,5.1,2.3,5.1,5.1 v42C87.4,78.6,85.1,80.8,82.3,80.8z M17.7,32.7c-0.6,0-1.1,0.5-1.1,1.1v42c0,0.6,0.5,1.1,1.1,1.1h64.6c0.6,0,1.1-0.5,1.1-1.1v-42 c0-0.6-0.5-1.1-1.1-1.1H17.7z M55.4,69.4H44.6c-1.1,0-2-0.9-2-2v-6.1h-6.1c-1.1,0-2-0.9-2-2V48.7c0-1.1,0.9-2,2-2h6.1v-6.1 c0-1.1,0.9-2,2-2h10.7c1.1,0,2,0.9,2,2v6.1h6.1c1.1,0,2,0.9,2,2v10.7c0,1.1-0.9,2-2,2h-6.1v6.1C57.4,68.5,56.5,69.4,55.4,69.4z M46.6,65.4h6.7v-6.1c0-1.1,0.9-2,2-2h6.1v-6.7h-6.1c-1.1,0-2-0.9-2-2v-6.1h-6.7v6.1c0,1.1-0.9,2-2,2h-6.1v6.7h6.1c1.1,0,2,0.9,2,2 V65.4z"
            ></path>{" "}
          </g>{" "}
          <g id="_x32_"></g> <g id="_x33_"></g> <g id="_x34_"></g>{" "}
          <g id="_x35_"></g> <g id="_x36_"></g> <g id="_x37_"></g>{" "}
          <g id="_x38_"></g> <g id="_x39_"></g> <g id="_x31_0"></g>{" "}
          <g id="_x31_1"></g> <g id="_x31_2"></g> <g id="_x31_3"></g>{" "}
          <g id="_x31_4"></g> <g id="_x31_5"></g> <g id="_x31_6"></g>{" "}
          <g id="_x31_7"></g> <g id="_x31_8"></g> <g id="_x31_9"></g>{" "}
          <g id="_x32_0"></g> <g id="_x32_1"></g> <g id="_x32_2"></g>{" "}
          <g id="_x32_3"></g> <g id="_x32_4"></g> <g id="_x32_5"></g>{" "}
        </g>
      </svg>
    </>
  );
};
const icn_4 = () => {
  return (
    <>
      <svg
        fill="#eafbec"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        data-tauri-drag-region
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="_x31_"></g> <g id="_x32_"></g> <g id="_x33_"></g>{" "}
          <g id="_x34_"></g> <g id="_x35_"></g> <g id="_x36_"></g>{" "}
          <g id="_x37_"></g> <g id="_x38_"></g> <g id="_x39_"></g>{" "}
          <g id="_x31_0"></g> <g id="_x31_1"></g> <g id="_x31_2"></g>{" "}
          <g id="_x31_3"></g> <g id="_x31_4"></g> <g id="_x31_5"></g>{" "}
          <g id="_x31_6">
            {" "}
            <path
              data-tauri-drag-region
              d="M59,86.3c-0.1,0-0.2,0-0.4,0c-25.3-0.5-45.8-21.5-45.8-46.8c0-8.8,7.1-15.9,15.9-15.9c2.6,0,5.3,0.7,7.6,1.9l0.1,0.1 c4.9,2.7,7.7,8.2,7.1,13.9l-0.2,2.5c-0.4,4.1-2.3,7.8-5.3,10.3c0,0,0,0,0,0c0.3,0.6,0.6,1.1,0.9,1.5c0.2,0.3,0.3,0.5,0.5,0.7 c0,0,0.1,0.1,0.1,0.2c0.1,0.2,0.3,0.4,0.4,0.5c0,0,0,0.1,0.1,0.1c0.2,0.2,0.3,0.4,0.5,0.6c0,0,0,0.1,0.1,0.1 c0.1,0.2,0.3,0.3,0.4,0.5c0,0,0.1,0.1,0.1,0.1c0,0,0,0,0.1,0.1c0.4,0.5,0.9,1,1.5,1.5c0.3,0.3,0.5,0.5,0.8,0.7 c0.3,0.3,0.5,0.5,0.8,0.7c0,0,0.1,0.1,0.1,0.1c0.3,0.2,0.5,0.4,0.8,0.6c0,0,0.1,0.1,0.1,0.1c0.2,0.2,0.4,0.3,0.6,0.4 c0.2,0.1,0.4,0.2,0.5,0.3c2.5-3.1,6.4-5,10.7-5h4c4.7,0,9.2,2.4,11.5,6.3c0.2,0.3,0.4,0.6,0.5,0.9c1.2,2.3,1.8,4.8,1.8,7.4 c0,8.7-7.1,15.8-15.7,15.9H59z M28.7,27.7c-6.6,0-11.9,5.3-11.9,11.9c0,23.2,18.8,42.4,42,42.8c0.1,0,0.2,0,0.2,0l0.1,0 c6.5-0.1,11.8-5.4,11.8-11.9c0-1.9-0.5-3.8-1.4-5.5c-0.1-0.2-0.3-0.5-0.4-0.7c-1.6-2.7-4.8-4.4-8.1-4.4h-4c-3.5,0-6.7,1.8-8.3,4.7 c-0.5,0.9-1.7,1.3-2.7,0.8c-0.9-0.5-1.6-0.9-2.4-1.4c-0.2-0.1-0.5-0.3-0.8-0.6c-0.3-0.2-0.7-0.5-1-0.7c-0.4-0.3-0.7-0.6-1-0.8 c-0.3-0.2-0.6-0.5-0.9-0.8c-0.6-0.5-1.1-1.1-1.7-1.7c0,0-0.1-0.1-0.1-0.1c-0.3-0.3-0.5-0.5-0.7-0.7c-0.2-0.2-0.4-0.5-0.6-0.8 c-0.2-0.3-0.4-0.5-0.6-0.8c-0.2-0.3-0.4-0.5-0.6-0.8c-0.3-0.5-0.7-1-1.1-1.7c-0.2-0.3-0.4-0.6-0.5-0.9l-0.1-0.2 c-0.1-0.2-0.2-0.5-0.4-0.7c-0.5-1-0.1-2.1,0.8-2.6c0.2-0.1,0.4-0.2,0.6-0.4c2.4-1.8,3.9-4.7,4.2-7.9l0.2-2.5c0.4-4.2-1.6-8.1-5-10 C32.6,28.1,30.7,27.7,28.7,27.7z M77.8,42.4h-9.9c-1.1,0-2-0.9-2-2V35h-5.4c-1.1,0-2-0.9-2-2v-9.9c0-1.1,0.9-2,2-2h5.4v-5.4 c0-1.1,0.9-2,2-2h9.9c1.1,0,2,0.9,2,2v5.4h5.4c1.1,0,2,0.9,2,2V33c0,1.1-0.9,2-2,2h-5.4v5.4C79.8,41.5,78.9,42.4,77.8,42.4z M69.9,38.4h5.9V33c0-1.1,0.9-2,2-2h5.4v-5.9h-5.4c-1.1,0-2-0.9-2-2v-5.4h-5.9v5.4c0,1.1-0.9,2-2,2h-5.4V31h5.4c1.1,0,2,0.9,2,2 V38.4z"
            ></path>{" "}
          </g>{" "}
          <g id="_x31_7"></g> <g id="_x31_8"></g> <g id="_x31_9"></g>{" "}
          <g id="_x32_0"></g> <g id="_x32_1"></g> <g id="_x32_2"></g>{" "}
          <g id="_x32_3"></g> <g id="_x32_4"></g> <g id="_x32_5"></g>{" "}
        </g>
      </svg>
    </>
  );
};
const icn_5 = () => {
  return (
    <>
      <svg
        fill="#eafbec"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        data-tauri-drag-region
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g id="_x31_"></g> <g id="_x32_"></g> <g id="_x33_"></g>{" "}
          <g id="_x34_"></g> <g id="_x35_"></g> <g id="_x36_"></g>{" "}
          <g id="_x37_"></g> <g id="_x38_"></g> <g id="_x39_"></g>{" "}
          <g id="_x31_0"></g>{" "}
          <g id="_x31_1">
            {" "}
            <path
              data-tauri-drag-region
              d="M65.1,84.9c-5.3,0-10.2-2.1-14-5.8L36,64c-0.4-0.4-0.6-0.9-0.6-1.4s0.2-1,0.6-1.4L61.1,36c0.4-0.4,0.9-0.6,1.4-0.6l0,0 c0.5,0,1,0.2,1.4,0.6l15.1,15.1c3.7,3.7,5.8,8.7,5.8,14c0,5.3-2.1,10.2-5.8,14C75.4,82.8,70.4,84.9,65.1,84.9z M40.3,62.6L54,76.3 c3,3,6.9,4.6,11.1,4.6c4.2,0,8.2-1.6,11.1-4.6c3-3,4.6-6.9,4.6-11.1c0-4.2-1.6-8.2-4.6-11.1L62.6,40.3L40.3,62.6z M37.4,64.6 c-0.5,0-1-0.2-1.4-0.6L20.9,48.8c-3.7-3.7-5.8-8.7-5.8-14c0-5.3,2.1-10.2,5.8-14c3.7-3.7,8.7-5.8,14-5.8c5.3,0,10.2,2.1,14,5.8h0 L64,36c0.4,0.4,0.6,0.9,0.6,1.4s-0.2,1-0.6,1.4L38.9,64C38.5,64.4,38,64.6,37.4,64.6z M34.9,19.1c-4.2,0-8.2,1.6-11.1,4.6 c-6.1,6.1-6.1,16.1,0,22.3l13.7,13.7l22.3-22.3L46,23.7h0C43,20.7,39.1,19.1,34.9,19.1z M62.1,74.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4c-0.7-0.8-2.1-0.8-2.8,0c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 C61.2,75.2,61.7,75,62.1,74.6z M54.8,67.3c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4c-0.8-0.7-2.1-0.7-2.8,0 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6C53.9,67.9,54.4,67.7,54.8,67.3z"
            ></path>{" "}
          </g>{" "}
          <g id="_x31_2"></g> <g id="_x31_3"></g> <g id="_x31_4"></g>{" "}
          <g id="_x31_5"></g> <g id="_x31_6"></g> <g id="_x31_7"></g>{" "}
          <g id="_x31_8"></g> <g id="_x31_9"></g> <g id="_x32_0"></g>{" "}
          <g id="_x32_1"></g> <g id="_x32_2"></g> <g id="_x32_3"></g>{" "}
          <g id="_x32_4"></g> <g id="_x32_5"></g>{" "}
        </g>
      </svg>
    </>
  );
};
