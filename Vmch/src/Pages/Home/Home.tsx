import { Selector } from "@/Components/Selector/Selector";
import Hero from "@/Components/Hero/Hero";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Cards } from "@/Components/Cards/Cards";
import i18n from "@/i18";
import { invoke } from "@tauri-apps/api/core";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "@/main";
function Home() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>();
  const [t, i18] = useTranslation();
  const app = useContext(AppContext);
  const [gender, setGender] = useState<string>(t("gender.male"));
  const [data, setData] = useState<JSON | null>();
  const { isSuccess } = useQuery({
    queryKey: ["categories"],
    retry: true,
    retryDelay: 3000,
    queryFn: async () => {
      const json = invoke<JSON>("fetch", {
        url: `${app.appConfig.server}/categories`,
      }).then((result) => {
        setData(result);
        return 1;
      });

      return json;
    },
  });

  useEffect(() => {
    if (window.innerWidth < 768 && selectedBodyPart) {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }, [selectedBodyPart]);
  useEffect(() => {
    setSelectedBodyPart(null);
  }, [gender]);
  useEffect(() => {
    console.log(app.appConfig.theme);
  }, [app.appConfig]);
  const gender_option = [t("gender.man"), t("gender.woman"), t("gender.child")];

  return (
    <div
      className={`flex justify-end md:justify-around items-start md:ml-5 mr-6 flex-col relative ${
        i18.language === "fa" ? "font-fa" : "font-roboto"
      }`}
    >
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`md:hidden rounded-xl shadow-inner justify-end items-center text-center flex bg-background-100 text-wrap max-w-28 sm:max-w-44 max-h-20 top-0 right-0 font-extrabold absolute text-text-800  z-10 p-2 ${
          app.appConfig.language === "fa" ? "text-3xl" : "text-xl"
        }`}
      >
        {t("site.where_does_it_hurt")}
      </motion.section>
      <section className="flex justify-center md:justify-around w-screen items-center flex-col md:flex-row ">
        <motion.div
          layoutId="hover"
          className="ml-10 h-[calc(100dvh-5rem)] z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Hero gender={gender} setBodyPart={setSelectedBodyPart} />
        </motion.div>
        <motion.div
          className=" w-[100dvw] md:max-w-[40dvw] md:w-fit rounded-tr-lg rounded-tl-lg  md:rounded-lg bg-background-600 md:max-h-[80dvh] md:overflow-auto z-10 md:-mt-8 "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {selectedBodyPart ? (
            <>
              <Cards
                items={
                  isSuccess
                    ? JSON.parse(JSON.stringify(data!))[getGenderEng(gender)][
                        selectedBodyPart
                      ]
                    : "Not Ready"
                }
              />
            </>
          ) : (
            <h1
              className={`hidden md:flex text-4xl font-bold text-center text-text-100 rounded-t-xl p-8 ${
                i18.language === "fa" ? "font-fa" : "font-roboto"
              }`}
            >
              {t("site.where_does_it_hurt")}
            </h1>
          )}
        </motion.div>
      </section>
      <motion.section
        id="options"
        className="absolute top-16 left-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Selector
          name="gender"
          defaultValue={gender_option[0]}
          items={gender_option}
          onSelect={setGender}
          divClassName="h-40"
        />
        <button
          className="p-1 bg-background-100 rounded-full shadow-lg flex items-center justify-center h-12 mt-3 w-20"
          onClick={() => setSelectedBodyPart(null)}
        >
          <RefreshCw
            style={{
              filter:
                "invert(44%) sepia(100%) saturate(100%) hue-rotate(120deg)",
            }}
          />
        </button>
      </motion.section>
    </div>
  );
}

export default Home;

function getGenderEng(gender: string) {
  if (i18n.t("gender.man") === gender) {
    return "man";
  } else if (i18n.t("gender.woman") === gender) {
    return "woman";
  } else {
    return "child";
  }
}
