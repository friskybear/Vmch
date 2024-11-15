import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface SelectorPorps {
  bg_color?: string;
  selected_color?: string;
  unslected_color?: string;
  row?: boolean;
  options: string[];
  return: React.Dispatch<React.SetStateAction<string>>;
  label: string;
}

export default function SelectorPorps(props: SelectorPorps) {
  const [selected, setSelected] = useState(props.options[0]);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const selected_color = props.selected_color
    ? props.selected_color
    : "bg-primary-700 text-text-100";
  const bg_color = props.bg_color ? props.bg_color : "bg-background-100";
  const unslected_color = props.unslected_color
    ? props.unslected_color
    : "bg-text-200 text-text-900 hover:bg-secondary/80";
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    props.return(selected);
  }, [selected]);
  return (
    <div className={"flex justify-center items-center"}>
      <div className={`${bg_color} p-4 rounded-lg shadow-md select-none`}>
        <fieldset>
          <legend className="sr-only">{props.label}</legend>
          <div className={`flex  ${props.row? "":"flex-col"}`} ref={parent}>
            {props.options.map((option) => (
              <label
                key={option}
                className={`flex justify-center items-center max-w-[10dvh] max-h-[6dvh] cursor-pointer m-1 px-6 py-3 text-sm  text-center font-medium rounded-md transition-colors duration-200 ease-in-out focus-within:outline-offset-2  focus-within:border-red-400 ${
                  selected === option ? selected_color : unslected_color
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={option}
                  checked={selected === option}
                  onChange={() => setSelected(option)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
