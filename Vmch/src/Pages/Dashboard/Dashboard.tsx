import { AppContext } from "@/main";
import { Selector } from "@/Components/Selector/Selector";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Admins, Doctors, Patients, Stats } from "./Admin";
import {
  Doctor as Doctor_struct,
  Patient as Patient_struct,
} from "@/lib/utils";
import { WobbleCard } from "@/Components/WobbleCard/WobbleCard";
import { Star, Wallet } from "lucide-react";
import { toast, Toaster } from "sonner";
import { invoke } from "@tauri-apps/api/core";

function Dashboard() {
  const app = useContext(AppContext);
  const [t, i18n] = useTranslation();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    switch (pathname) {
      case "/Dashboard":
        return t("site.dashboard.title");
      case "/Dashboard/Sessions":
        return t("site.dashboard.Sessions");
      case "/Dashboard/Notification":
        return t("site.dashboard.Notification");
      case "/Dashboard/Settings":
        return t("site.dashboard.Settings");
      default:
        return t("site.dashboard.title");
    }
  });
  useEffect(() => {
    switch (activeTab) {
      case t("site.dashboard.title"):
        if (pathname !== "/Dashboard") {
          nav("/Dashboard");
          window.location.reload();
        }
        break;
      case t("site.dashboard.Sessions"):
        if (pathname !== "/Dashboard/Sessions") {
          nav("/Dashboard/Sessions");
          window.location.reload();
        }
        break;
      case t("site.dashboard.Notification"):
        if (pathname !== "/Dashboard/Notification") {
          nav("/Dashboard/Notification");
          window.location.reload();
        }
        break;
      case t("site.dashboard.Settings"):
        if (pathname !== "/Dashboard/Settings") {
          nav("/Dashboard/Settings");
          window.location.reload();
        }
        break;
    }
  }, [activeTab, pathname]);

  return (
    <div className=" w-full  p-4  flex-col flex  space-y-1">
      {/* Tab Navigation */}
      <Selector
        defaultValue={activeTab}
        onSelect={setActiveTab}
        items={[
          t("site.dashboard.title"),
          t("site.dashboard.Sessions"),
          t("site.dashboard.Notification"),
          t("site.dashboard.Settings"),
        ]}
        name="dashboard"
        divClassName="flex-row min-h-11 "
        className="w-full noiseBackground bg-background-200"
        dynamicClassName=" noiseBackground bg-primary-300"
      />

      {activeTab === t("site.dashboard.title") ? (
        app.appConfig.user?.role === "admin" ? (
          <Admin />
        ) : app.appConfig.user?.role === "patient" ? (
          <Patient />
        ) : app.appConfig.user?.role === "doctor" ? (
          <Doctor />
        ) : null
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Dashboard;

function Admin() {
  const [t, _] = useTranslation();
  const [search_params, set_search_params] = useSearchParams();
  const loc = useLocation();
  const [selected, setSelected] = useState(
    search_params.get("selected") || t("site.dashboard.stats")
  );
  const navigate = useNavigate();
  useEffect(() => {
    set_search_params({ selected: selected });
    navigate(`${loc.pathname}?selected=${selected}`);
  }, [selected, navigate]);
  return (
    <div className="flex flex-col space-y-4 h-full w-full">
      <Selector
        defaultValue={selected}
        onSelect={setSelected}
        key={selected}
        items={[
          t("site.dashboard.stats"),
          t("site.dashboard.admin"),
          t("site.dashboard.patient"),
          t("site.dashboard.doctor"),
        ]}
        name="admin"
        divClassName="flex-row min-h-11 "
        className="w-full noiseBackground bg-primary-300 "
        dynamicClassName="bg-background-200 noiseBackground"
      />
      {selected === t("site.dashboard.stats") ? (
        <Stats />
      ) : selected === t("site.dashboard.admin") ? (
        <Admins />
      ) : selected === t("site.dashboard.patient") ? (
        <Patients />
      ) : selected === t("site.dashboard.doctor") ? (
        <Doctors />
      ) : null}
    </div>
  );
}

function Patient() {
  const app = useContext(AppContext);
  const [t] = useTranslation();
  const user = app.appConfig.user as Patient_struct;
  const banks = ["Mellat", "Melli", "Saderat", "Parsian", "Pasargad", "Saman"];
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const handleDeposit = (id: string, amount: number) => {
    invoke("post", {
      url: `${app.appConfig.server}/deposit`,
      payload: { id: user.id, amount },
    })
      .then((res) => {
        if (JSON.stringify(res) === JSON.stringify("ok")) {
          setDepositAmount(0);
          toast.success(t("site.dashboard.deposit_success"));
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setDepositAmount(0);
          toast.error(t("site.dashboard.deposit_failed"));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setDepositAmount(0);
        toast.error(t("site.dashboard.deposit_failed"));
      });
  };
  const handleWithdraw = (id: string, amount: number) => {
    invoke("post", {
      url: `${app.appConfig.server}/withdraw`,
      payload: { id: user.id, amount },
    })
      .then((res) => {
        if (JSON.stringify(res) === JSON.stringify("ok")) {
          setDepositAmount(0);
          toast.success(t("site.dashboard.deposit_success"));
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setDepositAmount(0);
          toast.error(t("site.dashboard.deposit_failed"));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setDepositAmount(0);
        toast.error(t("site.dashboard.deposit_failed"));
      });
  };
  return (
    <>
      <Toaster
        richColors
        position="top-right"
        visibleToasts={100}
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      />
      {app.appConfig.language === "en" ? (
        <div className="flex flex-col gap-5 p-4 text-text-900">
          {/* English version content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Patient Info Card */}
            <WobbleCard
              containerClassName="col-span-1 bg-background-300 "
              className="p-6 noiseBackground"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-text-300">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.fullName}</h2>
                  <p className="">{t("site.dashboard.patient")}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 w-full ">
                  <span className="">{t("site.dashboard.national_code")}:</span>
                  <span>{user.nationalCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">{t("site.dashboard.email")}:</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </WobbleCard>

            {/* Wallet Card */}
            <WobbleCard
              containerClassName="col-span-1 lg:col-span-2 bg-background-300 "
              className="p-6 noiseBackground"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      {t("site.dashboard.wallet_balance")}
                    </h2>
                    <p className="text-3xl font-bold">
                      ${user.walletBalance.toFixed(2)}
                    </p>
                    <p className="text-sm ">
                      {t("site.dashboard.available_balance")}
                    </p>
                  </div>
                  <Wallet className="w-12 h-12 text-text-800" />
                </div>
                <div className="flex gap-4 mb-4">
                  <button
                    className="flex-1 px-4 py-3 bg-primary  rounded-lg btn btn-success flex items-center justify-center gap-2 z-20 noiseBackground"
                    onClick={() => {
                      (
                        document.getElementById(
                          "depositModal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                  >
                    {t("site.dashboard.deposit")}
                  </button>
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          "withdrawModal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    className="flex-1 px-4 py-3 border  flex items-center justify-center gap-2 btn btn-secondary noiseBackground z-20"
                  >
                    {t("site.dashboard.withdraw")}
                  </button>
                </div>
              </div>
            </WobbleCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Upcoming Appointments Card */}
            <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
              <h3 className=" mb-2">
                {t("site.dashboard.upcoming_appointments")}
              </h3>
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm  mt-2">
                {t("site.dashboard.next_appointment")}{" "}
                {t("site.dashboard.tomorrow")}
              </p>
            </WobbleCard>

            {/* Recent Consultations Card */}
            <WobbleCard
              containerClassName="bg-background-300 rounded-lg"
              className="p-6 noiseBackground"
            >
              <h3 className=" mb-2">
                {t("site.dashboard.recent_consultations")}
              </h3>
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm  mt-2">
                {t("site.dashboard.last_30_days")}
              </p>
            </WobbleCard>

            {/* Medical Records Card */}
            <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
              <h3 className=" mb-2">{t("site.dashboard.medical_records")}</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm ">
                  {t("site.dashboard.documents")}
                </span>
              </div>
              <button className="mt-2 text-primary hover:text-primary/80 text-sm">
                {t("site.dashboard.view_all")}
              </button>
            </WobbleCard>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col gap-5 p-4 text-text-900 font-fa"
          dir="rtl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Patient Info Card */}
            <WobbleCard
              containerClassName="col-span-1 bg-background-300"
              className="p-6 noiseBackground"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-text-300">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.fullName}</h2>
                  <p className="">{t("site.dashboard.patient")}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="">{t("site.dashboard.national_code")}:</span>
                  <span>{user.nationalCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">{t("site.dashboard.email")}:</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </WobbleCard>

            {/* Wallet Card */}
            <WobbleCard
              containerClassName="col-span-1 lg:col-span-2 bg-background-300 "
              className="p-6 noiseBackground"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <Wallet className="w-12 h-12 text-text-800" />
                  <div className="text-left">
                    <h2 className="text-xl font-bold mb-1">
                      {t("site.dashboard.wallet_balance")}
                    </h2>
                    <p className="text-3xl font-bold">
                      ${user.walletBalance.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      {t("site.dashboard.available_balance")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          "depositModal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    className="flex-1 px-4 py-3 bg-primary rounded-lg btn btn-success flex items-center justify-center gap-2 z-20 noiseBackground"
                  >
                    {t("site.dashboard.deposit")}
                  </button>
                  <button
                    onClick={() => {
                      (
                        document.getElementById(
                          "withdrawModal"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    className="flex-1 px-4 py-3 border flex items-center justify-center gap-2 btn btn-secondary noiseBackground z-20"
                  >
                    {t("site.dashboard.withdraw")}
                  </button>
                </div>
              </div>
            </WobbleCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Rest of the cards */}
            {/* Upcoming Appointments Card */}
            <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
              <h3 className=" mb-2 ">
                {t("site.dashboard.upcoming_appointments")}
              </h3>
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm  mt-2">
                {t("site.dashboard.next_appointment")}{" "}
                {t("site.dashboard.tomorrow")}
              </p>
            </WobbleCard>

            {/* Recent Consultations Card */}
            <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
              <h3 className=" mb-2 ">
                {t("site.dashboard.recent_consultations")}
              </h3>
              <div className="text-2xl font-bold">8</div>
              <p className="text-sm  mt-2">
                {t("site.dashboard.last_30_days")}
              </p>
            </WobbleCard>

            {/* Medical Records Card */}
            <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
              <h3 className=" mb-2">{t("site.dashboard.medical_records")}</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm ">
                  {t("site.dashboard.documents")}
                </span>
              </div>
              <button className="mt-2 text-primary hover:text-primary/80 text-sm">
                {t("site.dashboard.view_all")}
              </button>
            </WobbleCard>
          </div>
        </div>
      )}

      <dialog className="modal text-text-800" id="depositModal">
        <div
          className="modal-box"
          style={{ direction: app.appConfig.language === "fa" ? "rtl" : "ltr" }}
        >
          <h3 className="font-bold text-lg">{t("site.dashboard.deposit")}</h3>
          <div className="py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("site.dashboard.amount")}</span>
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setDepositAmount(parseInt(value));
                }}
                placeholder={t("site.dashboard.enter_amount")}
                className="input input-bordered w-full"
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "+" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">
                  {t("site.dashboard.select_bank")}
                </span>
              </label>
              <select className="select select-bordered w-full pr-10">
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button
              onClick={() =>
                (
                  document.getElementById("depositModal") as HTMLDialogElement
                ).close()
              }
              className="btn"
            >
              {t("site.dashboard.cancel")}
            </button>
            <button
              onClick={() => {
                handleDeposit(user.id, depositAmount);
                (
                  document.getElementById("depositModal") as HTMLDialogElement
                ).close();
              }}
              className="btn btn-primary"
              disabled={!depositAmount}
            >
              {t("site.dashboard.confirm")}
            </button>
          </div>
        </div>
      </dialog>
      <dialog className="modal text-text-800" id="withdrawModal">
        <div
          className="modal-box"
          style={{ direction: app.appConfig.language === "fa" ? "rtl" : "ltr" }}
        >
          <h3 className="font-bold text-lg">{t("site.dashboard.deposit")}</h3>
          <div className="py-4">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">
                  {t("site.dashboard.amount")}:{" "}
                  {app.appConfig.language === "fa" ? "ت" : "$"}
                  {withdrawAmount}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={user.walletBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseInt(e.target.value))}
                style={{ direction: "ltr" }}
                className={`range range-primary ${
                  app.appConfig.language === "fa" ? "rotate-180" : ""
                }`}
                step="1"
              />
            </div>
          </div>
          <div className="modal-action flex flex-row gap-5 items-center">
            <button
              onClick={() => {
                (
                  document.getElementById("withdrawModal") as HTMLDialogElement
                ).close();
              }}
              className="btn"
            >
              {t("site.dashboard.cancel")}
            </button>
            <button
              onClick={() => {
                handleWithdraw(user.id, withdrawAmount);
                (
                  document.getElementById("depositModal") as HTMLDialogElement
                ).close();
              }}
              className="btn btn-primary"
              disabled={withdrawAmount <= 0}
            >
              {t("site.dashboard.confirm")}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

function Doctor() {
  const app = useContext(AppContext);
  const [t] = useTranslation();
  const user = app.appConfig.user as Doctor_struct;
  const banks = ["Mellat", "Melli", "Saderat", "Parsian", "Pasargad", "Saman"];
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [selectedCard, setSelectedCard] = useState("");

  const handleDeposit = (id: string, amount: number) => {
    invoke("post", {
      url: `${app.appConfig.server}/deposit`,
      payload: { id: user.id, amount },
    })
      .then((res) => {
        if (JSON.stringify(res) === JSON.stringify("ok")) {
          setDepositAmount(0);
          toast.success(t("site.dashboard.deposit_success"));
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setDepositAmount(0);
          toast.error(t("site.dashboard.deposit_failed"));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setDepositAmount(0);
        toast.error(t("site.dashboard.deposit_failed"));
      });
  };

  const handleWithdraw = (id: string, amount: number) => {
    invoke("post", {
      url: `${app.appConfig.server}/withdraw`,
      payload: { id: user.id, amount },
    })
      .then((res) => {
        if (JSON.stringify(res) === JSON.stringify("ok")) {
          setWithdrawAmount(0);
          setSelectedCard("");
          toast.success(t("site.dashboard.withdraw_success"));
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setWithdrawAmount(0);
          setSelectedCard("");
          toast.error(t("site.dashboard.withdraw_failed"));
        }
      })
      .catch((err: any) => {
        console.error(err);
        setWithdrawAmount(0);
        setSelectedCard("");
        toast.error(t("site.dashboard.withdraw_failed"));
      });
  };

  return (
    <>
      <Toaster
        richColors
        position="top-right"
        visibleToasts={100}
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      />

      <div
        className="flex flex-col gap-5 p-4 text-text-900 font-fa"
        dir={app.appConfig.language === "fa" ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Doctor Info Card */}
          <WobbleCard
            containerClassName="col-span-1 bg-background-300"
            className="p-6 noiseBackground"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-text-300">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p className="">{user.specialization}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="">{t("site.dashboard.medical_code")}:</span>
                <span>{user.medicalCode}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="">{t("site.dashboard.email")}:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </WobbleCard>

          {/* Wallet Card */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 bg-background-300 "
            className="p-6 noiseBackground"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <Wallet className="w-12 h-12 text-text-800" />
                <div className="text-left">
                  <h2 className="text-xl font-bold mb-1">
                    {t("site.dashboard.wallet_balance")}
                  </h2>
                  <p className="text-3xl font-bold">
                    ${user.walletBalance.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    {t("site.dashboard.available_balance")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        "doctorDepositModal"
                      ) as HTMLDialogElement
                    ).showModal();
                  }}
                  className="flex-1 px-4 py-3 bg-primary rounded-lg btn btn-success flex items-center justify-center gap-2 z-20 noiseBackground"
                >
                  {t("site.dashboard.deposit")}
                </button>
                <button
                  onClick={() => {
                    (
                      document.getElementById(
                        "doctorWithdrawModal"
                      ) as HTMLDialogElement
                    ).showModal();
                  }}
                  className="flex-1 px-4 py-3 border flex items-center justify-center gap-2 btn btn-secondary noiseBackground z-20"
                >
                  {t("site.dashboard.withdraw")}
                </button>
              </div>
            </div>
          </WobbleCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Rating Card */}
          <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
            <h3 className="mb-2">{t("site.dashboard.rating")}</h3>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">{user.rating || 4.7}</span>
            </div>
            <p className="text-sm mt-2">
              {t("site.dashboard.based_on_reviews")}
            </p>
          </WobbleCard>

          {/* Appointments Today Card */}
          <WobbleCard
            containerClassName="bg-background-300 rounded-lg"
            className="p-6 noiseBackground"
          >
            <h3 className="mb-2">{t("site.dashboard.appointments_today")}</h3>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm mt-2">
              3 {t("site.dashboard.more_than_yesterday")}
            </p>
          </WobbleCard>

          {/* Earnings Card */}
          <WobbleCard containerClassName="bg-background-300 " className="p-6 noiseBackground">
            <h3 className="mb-2">{t("site.dashboard.earnings_this_month")}</h3>
            <div className="text-2xl font-bold">${(4650).toFixed(2)}</div>
            <p className="text-sm mt-2">
              +20.1% {t("site.dashboard.from_last_month")}
            </p>
          </WobbleCard>
        </div>
      </div>

      {/* Doctor Deposit Dialog */}
      <dialog className="modal text-text-800" id="doctorDepositModal">
        <div
          className="modal-box"
          style={{ direction: app.appConfig.language === "fa" ? "rtl" : "ltr" }}
        >
          <h3 className="font-bold text-lg">{t("site.dashboard.deposit")}</h3>
          <div className="py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("site.dashboard.amount")}</span>
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setDepositAmount(parseInt(value));
                }}
                placeholder={t("site.dashboard.enter_amount")}
                className="input input-bordered w-full"
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "+" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">
                  {t("site.dashboard.select_bank")}
                </span>
              </label>
              <select className="select select-bordered w-full pr-10">
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button
              onClick={() =>
                (
                  document.getElementById(
                    "doctorDepositModal"
                  ) as HTMLDialogElement
                ).close()
              }
              className="btn"
            >
              {t("site.dashboard.cancel")}
            </button>
            <button
              onClick={() => {
                handleDeposit(user.id, depositAmount);
                (
                  document.getElementById(
                    "doctorDepositModal"
                  ) as HTMLDialogElement
                ).close();
              }}
              className="btn btn-primary"
              disabled={!depositAmount}
            >
              {t("site.dashboard.confirm")}
            </button>
          </div>
        </div>
      </dialog>

      {/* Doctor Withdraw Dialog */}
      <dialog className="modal text-text-800" id="doctorWithdrawModal">
        <div
          className="modal-box"
          style={{ direction: app.appConfig.language === "fa" ? "rtl" : "ltr" }}
        >
          <h3 className="font-bold text-lg">{t("site.dashboard.withdraw")}</h3>
          <div className="py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  {t("site.dashboard.select_card")}
                </span>
              </label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="select select-bordered w-full pr-10"
              >
                <option value="">{t("site.dashboard.choose_card")}</option>
                {user.cardNumber?.map((card) => (
                  <option key={card} value={card}>
                    {card}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">
                  {t("site.dashboard.amount")}:{" "}
                  {app.appConfig.language === "fa" ? "ت" : "$"}
                  {withdrawAmount}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={user.walletBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseInt(e.target.value))}
                style={{ direction: "ltr" }}
                className={`range range-primary ${
                  app.appConfig.language === "fa" ? "rotate-180" : ""
                }`}
                step="1"
              />
            </div>
          </div>
          <div className="modal-action flex flex-row gap-5 items-center">
            <button
              onClick={() => {
                (
                  document.getElementById(
                    "doctorWithdrawModal"
                  ) as HTMLDialogElement
                ).close();
              }}
              className="btn"
            >
              {t("site.dashboard.cancel")}
            </button>
            <button
              onClick={() => {
                handleWithdraw(user.id, withdrawAmount);
                (
                  document.getElementById(
                    "doctorWithdrawModal"
                  ) as HTMLDialogElement
                ).close();
              }}
              className="btn btn-primary"
              disabled={!selectedCard || withdrawAmount <= 0}
            >
              {t("site.dashboard.confirm")}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
