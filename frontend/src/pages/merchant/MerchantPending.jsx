import { useState, useEffect } from "react";

export const MerchantPending = ({
  application = {},
  onNavigate = () => {},
}) => {
  const [supportNotice, setSupportNotice] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    23 * 3600 + 48 * 60 + 15,
  );

  const formatClockTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const [lastCheckedAt, setLastCheckedAt] = useState(() =>
    formatClockTime(new Date()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`;
  };

  const handleRefreshStatus = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      const checkedTime = formatClockTime(new Date());
      setLastCheckedAt(checkedTime);
      setIsRefreshing(false);
      setSupportNotice(
        `Status refreshed at ${checkedTime} — Ref #${application.applicationId || "APP-2026-8412"} is actively in Stage 2 (Commercial Compliance Vetting).`,
      );
    }, 550);
  };

  const verificationSteps = [
    {
      step: "01",
      title: "Application & Merchant Profile Submitted",
      detail: `Business profile and contact records received for ${application.storeName || "SonicHub Official"}.`,
      timing: "Completed",
      state: "completed",
    },
    {
      step: "02",
      title: "Commercial Compliance & Trade License Vetting",
      detail: `Cross-checking Trade License / BIN (${application.tradeLicense || "TRAD/DNCC/01928"}) with registry records.`,
      timing: "In Progress · 24–48h SLA",
      state: "current",
    },
    {
      step: "03",
      title: "Escrow Vault & Settlement Bank Verification",
      detail:
        "Configuring automated bKash, Nagad, and bi-weekly bank settlement routing.",
      timing: "Next Stage",
      state: "upcoming",
    },
    {
      step: "04",
      title: "Storefront & Seller Control Panel Activation",
      detail:
        "Unlock product publishing, order fulfillment, and 0% Month-1 commission.",
      timing: "Pending Approval",
      state: "upcoming",
    },
  ];

  return (
    <div className="w-full max-w-[1160px] mx-auto px-gutter py-space-lg flex flex-col gap-6">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span>NexusMarket Seller</span>
            <span aria-hidden="true">/</span>
            <span className="truncate">
              {application.storeName || "Merchant Studio"}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-on-surface font-medium">
              Application Under Review
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Application Under Review
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("signin")}
            className="px-3.5 py-2 rounded-xl border border-outline-variant/60 hover:border-outline text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {supportNotice && (
        <div
          role="status"
          className="px-4 py-3 rounded-2xl bg-surface-container-lowest border border-primary/35 text-xs text-on-surface flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-base text-primary">
              support_agent
            </span>
            <span>{supportNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSupportNotice("")}
            className="text-on-surface-variant hover:text-on-surface font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Atmospheric Commercial Review Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/35 bg-gradient-to-br from-amber-500/[0.09] via-surface-container-lowest to-primary/[0.05] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">
                hourglass_top
              </span>
            </div>

            <div className="space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                  <span className="material-symbols-outlined text-sm">
                    verified_user
                  </span>
                  <span>Commercial Verification in Progress</span>
                </span>
                <span className="text-outline">·</span>
                <span className="font-mono tabular-nums text-on-surface-variant">
                  Ref #{application.applicationId || "APP-2026-8412"}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-snug">
                We&apos;re reviewing{" "}
                {application.storeName || "SonicHub Official"} for storefront
                launch
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Our Dhaka Commercial Compliance Team is validating your Trade
                License / BIN and payout eligibility. Seller inventory, order
                dispatch, and withdrawal tools will unlock automatically once
                approved.
              </p>

              {/* Horizontal Onboarding Completion Track */}
              <div className="pt-2 max-w-md space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-on-surface">Verification Progress</span>
                  <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400 font-semibold">
                    Step 2 of 4 · 50%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2.5 shrink-0 w-full lg:w-64">
            {/* Attractive Live Review Timer & Sync Status Box */}
            <div className="rounded-2xl border border-amber-500/30 bg-surface-container-lowest/90 px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <span className="material-symbols-outlined text-sm">
                    timer
                  </span>
                  <span>Est. Review Window</span>
                </span>
                <span className="text-on-surface-variant font-mono">
                  48h SLA
                </span>
              </div>

              <div className="text-base font-extrabold font-mono tabular-nums tracking-tight text-on-surface">
                {formatCountdown(remainingSeconds)}
              </div>

              <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5 border-t border-outline-variant/40">
                <span>Last checked</span>
                <span className="font-mono tabular-nums font-medium text-on-surface">
                  {lastCheckedAt}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="w-full px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-80 text-on-primary text-xs font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-base ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              >
                refresh
              </span>
              <span>
                {isRefreshing ? "Refreshing Status..." : "Refresh Status"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="w-full px-5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                storefront
              </span>
              <span>Browse Marketplace</span>
            </button>
          </div>
        </div>
      </section>

      {/* Application Metadata Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">
              storefront
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Store / Brand Name
            </p>
            <p className="text-sm font-bold text-on-surface mt-0.5 truncate">
              {application.storeName || "SonicHub Official"}
            </p>
            <p className="text-[11px] text-outline mt-0.5 truncate">
              Owner: {application.ownerName || "Tanvir Ahmed"}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">category</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Primary Category
            </p>
            <p className="text-sm font-bold text-on-surface mt-0.5 truncate">
              {application.category || "Electronics & Audio"}
            </p>
            <p className="text-[11px] text-outline mt-0.5 truncate">
              {application.email || "merchant@nexus.market"}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/12 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">badge</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Trade License / BIN
            </p>
            <p className="text-sm font-bold text-on-surface font-mono tabular-nums mt-0.5 truncate">
              {application.tradeLicense || "TRAD/DNCC/01928"}
            </p>
            <p className="text-[11px] text-outline mt-0.5 font-mono tabular-nums truncate">
              {application.phone || "+880 1712 000000"}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">schedule</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Estimated Decision SLA
            </p>
            <p className="text-sm font-bold text-on-surface font-mono tabular-nums mt-0.5">
              24–48 Hours
            </p>
            <p className="text-[11px] text-outline mt-0.5 truncate">
              Submitted: {application.submittedAt || "14 Nov 2026"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Two-Column Review Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Commercial Vetting Pipeline
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Live verification milestones for your merchant account
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
              Queue: Standard 48h
            </span>
          </div>

          <div className="relative space-y-0">
            {verificationSteps.map((item, idx) => {
              const isDone = item.state === "completed";
              const isCurrent = item.state === "current";
              const isLast = idx === verificationSteps.length - 1;

              return (
                <div
                  key={item.step}
                  className="relative flex items-start gap-4 pb-6 last:pb-0"
                >
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={`absolute left-[15px] top-8 bottom-0 w-px ${
                        isDone ? "bg-emerald-500/40" : "bg-outline-variant/50"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : isCurrent
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/35"
                          : "bg-surface-container-low text-outline border border-outline-variant/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isDone
                        ? "check_circle"
                        : isCurrent
                          ? "hourglass_top"
                          : "radio_button_unchecked"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-on-surface">
                        {item.step}. {item.title}
                      </p>
                      <span
                        className={`text-[11px] font-semibold ${
                          isDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isCurrent
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-outline"
                        }`}
                      >
                        {item.timing}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-5 text-xs">
          <div className="pb-3 border-b border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">
              Seller Launch Perks & Updates
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              What unlocks automatically upon verification approval
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
              <span className="material-symbols-outlined text-lg text-primary shrink-0 mt-0.5">
                mark_email_read
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  Instant Approval Alerts
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  Email & SMS notification dispatched to{" "}
                  <span className="font-medium text-on-surface">
                    {application.email || "merchant@nexus.market"}
                  </span>{" "}
                  immediately after compliance sign-off.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
              <span className="material-symbols-outlined text-lg text-secondary shrink-0 mt-0.5">
                percent
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  0% Month-1 Seller Commission
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  Your 30-day fee waiver starts on activation day — not while
                  your application is in review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
              <span className="material-symbols-outlined text-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                account_balance_wallet
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  Unified Escrow & Payouts
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  Direct bi-weekly settlement to bKash Merchant, Nagad, or local
                  commercial bank accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={() =>
                setSupportNotice(
                  `Priority verification inquiry sent for #${application.applicationId || "APP-2026-8412"}. Our onboarding desk replies within 4 business hours.`,
                )
              }
              className="w-full py-2.5 px-4 rounded-xl border border-outline-variant/70 hover:border-primary hover:bg-surface-container-low text-on-surface font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base text-primary">
                bolt
              </span>
              <span>Request Expedited Review</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
