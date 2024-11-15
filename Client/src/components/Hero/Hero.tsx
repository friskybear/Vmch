import { type FunctionComponent, useEffect, useState } from "react";
import Selector from "../Selector/Selector";
const Hero: FunctionComponent = () => {
  const [gender, set_gender] = useState("مرد");

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.id);
  };

  return (
    <>
      {" "}
      <section className="flex  items-center space-y-4">
        <Selector
          label="test"
          options={["مرد", "زن", "کودک"]}
          return={set_gender}
        />
        <section className=" h-[85dvh] w-[28dvh] relative">
          {gender === "مرد" ? (
            <>
              <div
                id="head"
                className=" absolute bg-red-600 h-[14dvh] w-[12.5dvh] top-[.5dvh] left-[7.4dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(25% 0%, 80% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="chest"
                className=" absolute bg-red-600 h-[13dvh] w-[15.5dvh] top-[14.9dvh] left-[6.1dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(3% 0%, 100% 0%, 96% 20%, 94% 70%, 92% 100%, 12% 100%, 12% 79%, 10% 30%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="stomach"
                className=" absolute bg-red-600 h-[11.9dvh] w-[14dvh] top-[28dvh] left-[7dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(0% 0%, 96% 0%, 96% 20%, 99% 80%, 80% 95%, 20% 90%, 0% 80%, 0% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="below-abdomen"
                className=" absolute bg-red-600 h-[11dvh] w-[17dvh] top-[38dvh] left-[6dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(14% 9%, 90% 5%, 100% 35%, 100% 40%, 100% 100%,0% 100%, 0% 80%, 4% 30%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="foot"
                className=" absolute bg-red-600 h-[30.4dvh] w-[26.1dvh] top-[49.1dvh] left-[1dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon( 17% 0%, 84% 0%, 81% 20%, 80% 80%,99% 99%,0% 100%, 15% 80%, 20% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="right-hand"
                className=" absolute bg-yellow-600 h-[30dvh] w-[5dvh] top-[12dvh] left-[21dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(20% 9%, 65% 20%, 86% 50%, 86% 80%, 80% 86%, 35% 100%, 0% 80%, 0% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="left-hand"
                className=" absolute bg-blue-600 h-[30dvh] w-[8dvh] top-[14dvh] left-[0dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(50% 5%, 79% 0%, 94% 20%, 80% 50%, 95% 85%, 80% 100%, 6% 60%, 5% 30%)",
                }}
                onMouseDown={handleClick}
              />
            </>
          ) : gender === "زن" ? (
            <>
              <>
                <div
                  id="head"
                  className=" absolute bg-red-600 h-[16.5dvh] w-[17dvh] top-[.01dvh] left-[4.4dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(28% 3%, 80% 3%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="chest"
                  className=" absolute bg-yellow-600 h-[11dvh] w-[17dvh] top-[16.6dvh] left-[4dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(15% 0%, 93% 0%, 90% 20%, 90% 45%, 87% 100%, 30% 100%, 24% 79%, 24% 40%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="stomach"
                  className=" absolute bg-red-600 h-[10.9dvh] w-[16dvh] top-[27.7dvh] left-[7.6dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 70% 0%, 76% 15%,86% 60%, 80% 80%, 2% 80%, 1% 70%, 5% 20%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="below-abdomen"
                  className=" absolute bg-red-600 h-[8.4dvh] w-[19dvh] top-[36.6dvh] left-[5dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(20% 0%, 85% 0%, 96% 25%, 95% 40%, 95% 100%,3% 100%, 2% 80%, 15% 20%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="foot"
                  className=" absolute bg-red-600 h-[41.5dvh] w-[28dvh] top-[45.1dvh] left-[.1dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon( 18% 0%, 80% 0%, 76% 20%, 67% 63%,87% 83%,0% 83%, 15% 65%, 18% 30%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="right-hand"
                  className=" absolute bg-blue-600 h-[30dvh] w-[8dvh] top-[13dvh] left-[18dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(25% 10%, 70% 35%, 53% 40%, 65% 55%, 82% 75%, 75% 85%, 50% 85%, 33% 60%, 15% 50%,13% 40%)",
                  }}
                  onMouseDown={handleClick}
                />
                <div
                  id="left-hand"
                  className=" absolute bg-red-600 h-[30dvh] w-[9dvh] top-[16dvh] left-[.6dvh] opacity-0"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 65% 3%, 83% 16%, 70% 47%, 83% 70%, 65% 83%, 36% 70%, 20% 30%)",
                  }}
                  onMouseDown={handleClick}
                />
              </>
            </>
          ) : (
            <>
              <div
                id="head"
                className=" absolute bg-red-600 h-[22dvh] w-[24dvh] top-[.5dvh] left-[.1dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(25% 0%, 80% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="chest"
                className=" absolute bg-red-600 h-[10dvh] w-[15.5dvh] top-[22.7dvh] left-[4.1dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(3% 0%, 100% 0%, 90% 20%, 85% 70%, 89% 100%, 12% 100%, 12% 79%, 10% 30%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="stomach"
                className=" absolute bg-red-600 h-[11.9dvh] w-[14dvh] top-[32.8dvh] left-[5.5dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(3% 0%, 85% 0%, 90% 25%, 98% 74%, 80% 80%, 20% 88%, 0% 80%, 1% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="below-abdomen"
                className=" absolute bg-red-600 h-[11dvh] w-[17dvh] top-[41dvh] left-[3.6dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(14% 19%, 90% 12%, 100% 35%, 98% 40%, 96% 100%,2% 100%, 0% 80%, 5% 22%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="foot"
                className=" absolute bg-red-600 h-[27.7dvh] w-[22.1dvh] top-[52.1dvh] left-[2dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(7% 0%, 84% 0%, 76% 20%, 70% 70%,80% 99%,8% 100%, 15% 80%, 15% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="right-hand"
                className=" absolute bg-yellow-600 h-[25dvh] w-[6dvh] top-[20dvh] left-[17.5dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(45% 9%, 65% 20%, 86% 50%, 86% 80%, 80% 97%, 37% 95%, 10% 60%, 5% 20%)",
                }}
                onMouseDown={handleClick}
              />
              <div
                id="left-hand"
                className=" absolute bg-blue-600 h-[24dvh] w-[8dvh] top-[22dvh] left-[0.1dvh] opacity-0"
                style={{
                  clipPath:
                    "polygon(40% 5%, 50% 0%, 70% 20%, 70% 50%, 65% 85%, 44% 100%, 6% 60%, 5% 30%)",
                }}
                onMouseDown={handleClick}
              />
            </>
          )}
          <img
            className={"h-[80dvh] select-none"}
            src={`/Images/${gender}.png?${Date.now()}`}
            alt=""
          />
        </section>
      </section>
    </>
  );
};

export default Hero;

const doctorCategories = {
  men: {
    head: [
      "متخصص مغز و اعصاب",
      "متخصص گوش و حلق و بینی",
      "متخصص روانپزشکی",
      "متخصص چشم پزشکی",
      "متخصص جراحی مغز و اعصاب",
    ],
    chest: [
      "متخصص قلب و عروق",
      "متخصص ریه",
      "متخصص داخلی",
      "متخصص جراحی قفسه سینه",
    ],
    stomach: ["متخصص گوارش و کبد", "متخصص تغذیه", "متخصص جراحی عمومی"],
    belowAbdomen: [
      "متخصص کلیه و مجاری ادراری",
      "متخصص غدد",
      "متخصص جراحی کلیه و مجاری ادراری",
    ],
    feet: [
      "متخصص ارتوپدی",
      "متخصص طب فیزیکی و توانبخشی",
      "متخصص جراحی پا و مچ پا",
    ],
    hands: ["متخصص ارتوپدی", "متخصص جراحی دست", "متخصص توانبخشی"],
  },
  women: {
    head: [
      "متخصص مغز و اعصاب",
      "متخصص گوش و حلق و بینی",
      "متخصص روانپزشکی",
      "متخصص چشم پزشکی",
      "متخصص جراحی مغز و اعصاب",
    ],
    chest: [
      "متخصص قلب و عروق",
      "متخصص ریه",
      "متخصص داخلی",
      "متخصص جراحی قفسه سینه",
      "متخصص پستان",
    ],
    stomach: ["متخصص گوارش و کبد", "متخصص تغذیه", "متخصص جراحی عمومی"],
    belowAbdomen: [
      "متخصص کلیه و مجاری ادراری",
      "متخصص غدد",
      "متخصص زنان و زایمان",
      "متخصص جراحی کلیه و مجاری ادراری",
    ],
    feet: [
      "متخصص ارتوپدی",
      "متخصص طب فیزیکی و توانبخشی",
      "متخصص جراحی پا و مچ پا",
    ],
    hands: ["متخصص ارتوپدی", "متخصص جراحی دست", "متخصص طب فیزیکی و توانبخشی"],
  },
  children: {
    head: [
      "متخصص مغز و اعصاب کودکان",
      "متخصص گوش و حلق و بینی کودکان",
      "متخصص روانپزشکی کودکان",
      "متخصص چشم پزشکی کودکان",
    ],
    chest: [
      "متخصص قلب و عروق کودکان",
      "متخصص ریه کودکان",
      "متخصص داخلی کودکان",
    ],
    stomach: [
      "متخصص گوارش و کبد کودکان",
      "متخصص تغذیه کودکان",
      "متخصص جراحی کودکان",
    ],
    belowAbdomen: ["متخصص کلیه و مجاری ادراری کودکان", "متخصص غدد کودکان"],
    feet: ["متخصص ارتوپدی کودکان", "متخصص طب فیزیکی و توانبخشی کودکان"],
    hands: [
      "متخصص ارتوپدی کودکان",
      "متخصص جراحی دست کودکان",
      "متخصص طب فیزیکی و توانبخشی کودکان",
    ],
  },
};
