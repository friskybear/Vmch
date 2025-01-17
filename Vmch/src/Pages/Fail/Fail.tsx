import { useTranslation } from "react-i18next";

function Fail() {
  const [t, i18] = useTranslation();

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          i18.language === "fa" ? "font-fa" : "font-Roboto"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4 text-teal-800">
          {t("disconnect")}
        </h1>
        <button
          className="btn btn-accent text-text-700"
          onClick={() => window.location.reload()}
        >
          {t("retry")}
        </button>
      </div>
    </>
  );
}

export default Fail;
