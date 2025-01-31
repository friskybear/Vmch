import { t } from "i18next";
import { Plus, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

const CardNumberComponent: React.FC<{
  defaultValue: string[] | undefined;
  onChange: Function;
}> = (props) => {
  const [cardNumbers, setCardNumbers] = useState<string[]>(
    props.defaultValue || []
  );

  useEffect(() => {
    props.onChange(cardNumbers);
  }, [cardNumbers]);
  const handleInputChange = (index: number, value: string) => {
    const newCardNumbers = [...cardNumbers];
    newCardNumbers[index] = value;
    setCardNumbers(newCardNumbers);
  };

  const addSlot = () => {
    if (cardNumbers.length < 3) {
      setCardNumbers([...cardNumbers, ""]);
    }
  };

  const removeSlot = (index: number) => {
    if (cardNumbers.length > 0) {
      const newCardNumbers = cardNumbers.filter((_, i) => i !== index);
      setCardNumbers(newCardNumbers);
    }
  };

  return (
    <div className="max-w-md mx-auto flex justify-center items-center flex-col p-6 border card border-gray-300 rounded-lg shadow-sm">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        {t("site.dashboard.card_numbers")}
      </h2>
      <div>
        {cardNumbers.map((number, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder={`Card number ${index + 1}`}
              value={number}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\s/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim()
                  .slice(0, 19);
                handleInputChange(index, value);
              }}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
                if (e.key.length === 1 && isNaN(parseInt(e.key))) {
                  e.preventDefault();
                }
              }}
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginRight: "10px",
              }}
            />
            <button
              type="button"
              onClick={() => removeSlot(index)}
              className="btn btn-error btn-square"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSlot}
        disabled={cardNumbers.length >= 3}
        className="btn btn-primary btn-square flex justify-center items-center"
        style={{ display: cardNumbers.length >= 3 ? "none" : "block" }}
      >
        <Plus className="w-6 h-6 ml-2.5" />
      </button>
    </div>
  );
};

export default CardNumberComponent;
