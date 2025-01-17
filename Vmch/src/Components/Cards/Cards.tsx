import { cn } from "@/lib/utils";
import i18 from "@/i18";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { AppContext } from "@/main";

export const Cards = ({
  items,
  className,
}: {
  items:
    | {
        title: string;
        en_description: string;
        fa_description: string;
        name: string;
      }[]
    | "Not Ready";
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center items-center m-1",
        className
      )}
    >
      {items === "Not Ready"
        ? Array.from({ length: 6 }).map((_, idx) => (
            <div
              className="skeleton m-3 rounded-xl border shadow-lg z-20 h-40 w-[80dvw]  md:max-w-80 relative"
              key={idx}
            />
          ))
        : items.map((item, idx) => (
            <NavLink
              to={`/category/${item?.title}`}
              key={`/category/${item?.title}`}
              className="relative p-2"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-secondary-100 block rounded-3xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>
              <Card item={item}></Card>
            </NavLink>
          ))}
    </div>
  );
};

export const Card = ({
  className,
  item,
}: {
  className?: string;
  item: {
    title: string;
    name: string;
    en_description: string;
    fa_description: string;
  };
}) => {
  const app = useContext(AppContext);
  const memoizedImage = useMemo(
    () => (
      <img
        src={`${app.appConfig.server}/static/Images/${item?.title.replace(
          "Pediatric ",
          ""
        )}.svg`}
        className="h-12 w-12 transition-transform group-hover:scale-110"
        style={{
          filter: "invert(44%) sepia(100%) saturate(100%) hue-rotate(120deg)",
        }}
      />
    ),
    [item?.title]
  );
  return (
    <div
      className={cn(
        className,
        "relative rounded-xl border border-background-200 bg-background-100 p-6 shadow-background-300 transition-all duration-300 hover:shadow-xl z-10 h-40 w-[80dvw] md:w-auto md:max-w-80"
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          {memoizedImage}
        </div>
        <div className="flex-1 space-y-2">
          <h3
            className={`font-bold text-xl text-text-900 line-clamp-2 ${
              i18.language === "fa" ? "font-fa text-right" : "font-Roboto"
            }`}
          >
            {i18.language === "en" ? item.title : item.name}
          </h3>
          <p
            className={`text-sm text-text-600  line-clamp-2 ${
              i18.language === "fa" ? "font-fa text-right" : "font-Roboto"
            }`}
          >
            {i18.language === "en" ? item.en_description : item.fa_description}
          </p>
        </div>
      </div>
    </div>
  );
};
