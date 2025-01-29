"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SelectorProps {
  items: string[];
  onSelect: (value: string) => void;
  defaultValue: string;
  className?: string;
  divClassName?: string;
  dynamicClassName?: string;
  name: string;
}

export function Selector({
  items,
  onSelect,
  defaultValue,
  name,
  className,
  divClassName,
  dynamicClassName,
  ...props
}: SelectorProps) {
  const [selected, setSelected] = React.useState(defaultValue);
  React.useEffect(() => {
    setSelected(defaultValue);
    onSelect(defaultValue);
  }, [defaultValue]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div
      className={cn(
        " p-1 bg-background-200   rounded-3xl shadow-lg flex  flex-col  min-h-48 min-w-20 justify-around items-center",
        className,
        divClassName
      )}
      {...props}
    >
      {items.map((item) => (
        <label key={item} className="relative ">
          <input
            type="radio"
            name={name}
            value={item}
            className="peer sr-only"
            checked={selected === item}
            onChange={() => handleSelect(item)}
          />
          <span
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 cursor-pointer select-none text-center",
              "text-text-800 hover:text-text-950 ",
              "peer-checked:text-white relative z-10 text-center flex justify-center "
            )}
          >
            {item}
          </span>
          {selected === item && (
            <motion.span
              id={`highlight-${Math.random().toString(36).substr(2, 9)}`}
              className={cn("absolute inset-0 bg-background-500 hover:bg-background-50 rounded-full z-0 ",dynamicClassName)}
              layoutId={`highlight-${Math.random().toString(36).substr(2, 9)}`}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            />
          )}
        </label>
      ))}
    </div>
  );
}
