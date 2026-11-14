import { useState } from "react";

export const MerchantRejected = ({
  application = {},
  onResubmit = () => {},
  onNavigate = () => {},
}) => {
  const [isReapplyOpen, setIsReapplyOpen] = useState(false);
  const [supportNotice, setSupportNotice] = useState("");
  const [reapplyForm, setReapplyForm] = useState({
    ownerName: application.ownerName || "Tanvir Ahmed",
    storeName: application.storeName || "SonicHub Official",
    category: application.category || "Electronics & Audio",
    tradeLicense: application.tradeLicense || "TRAD/DNCC/01928",
    phone: application.phone || "+880 1712 000000",
    complianceNote: "",
  });

  const verificationSteps = [
    {
      step: "01",
      title: "Application & Merchant Profile Submitted",
      detail: `Received commercial submission for ${application.storeName || "SonicHub Official"}.`,
      timing: "Completed",
      state: "completed",
    },
    {
      step: "02",
      title: "Commercial Compliance & Trade License Vetting",
      detail:
        "Trade License / BIN mismatch flagged during municipal registry cross-check.",
      timing: "Action Required",
      state: "rejected",
    },
    {
      step: "03",
      title: "Escrow Vault & Settlement Bank Verification",
      detail: "Paused until updated business details clear compliance check.",
      timing: "Paused",
      state: "upcoming",
    },
    {
      step: "04",
      title: "Storefront & Seller Control Panel Activation",
      detail: "Ready to unlock once your resubmitted application is approved.",
      timing: "Locked",
      state: "upcoming",
    },
  ];

  const handleOpenReapply = () => {
    setReapplyForm({
      ownerName: application.ownerName || "Tanvir Ahmed",
      storeName: application.storeName || "SonicHub Official",
      category: application.category || "Electronics & Audio",
      tradeLicense: application.tradeLicense || "TRAD/DNCC/01928",
      phone: application.phone || "+880 1712 000000",
      complianceNote: "",
    });
    setSupportNotice("");
    setIsReapplyOpen(true);
  };

  const handleResubmitSubmit = (e) => {
    e.preventDefault();
    onResubmit({
      ...application,
      ownerName: reapplyForm.ownerName.trim(),
      storeName: reapplyForm.storeName.trim(),
      category: reapplyForm.category,
      tradeLicense: reapplyForm.tradeLicense.trim(),
      phone: reapplyForm.phone.trim(),
      complianceNote: reapplyForm.complianceNote.trim(),
      submittedAt: "14 Nov 2026, Just now",
    });
    setIsReapplyOpen(false);
    setSupportNotice("");
  };

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
              Application Rejected
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Application Declined
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

      {/* Atmospheric Rejection Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-error/35 bg-gradient-to-br from-rose-500/[0.09] via-surface-container-lowest to-surface-container-low p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-error/12 border border-error/25 text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">
                gpp_bad
              </span>
            </div>

            <div className="space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-error">
                  <span className="material-symbols-outlined text-sm">
                    cancel
                  </span>
                  <span>Verification Declined</span>
                </span>
                <span className="text-outline">·</span>
                <span className="font-mono tabular-nums text-on-surface-variant">
                  Ref #{application.applicationId || "APP-2026-8412"}
                </span>
                <span className="text-outline">·</span>
                <span className="font-mono tabular-nums text-error font-medium">
                  Code ERR-TRAD-402
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-snug">
                Action required before{" "}
                {application.storeName || "SonicHub Official"} can go live
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Your application was not approved during commercial vetting.
                Review the compliance reason below, update your business
                registration details, and resubmit directly for priority
                re-review.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenReapply}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                edit_document
              </span>
              <span>Fix &amp; Resubmit Application</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
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
          <div className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0">
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
          <div className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">category</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Commercial Category
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
          <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">badge</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Submitted License / BIN
            </p>
            <p className="text-sm font-bold text-on-surface font-mono tabular-nums mt-0.5 truncate">
              {application.tradeLicense || "TRAD/DNCC/01928"}
            </p>
            <p className="text-[11px] text-error mt-0.5 truncate">
              Flagged for mismatch
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">
              event_busy
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant">
              Decision Timestamp
            </p>
            <p className="text-sm font-bold text-error font-mono tabular-nums mt-0.5">
              14 Nov 2026
            </p>
            <p className="text-[11px] text-outline mt-0.5 truncate">
              Re-review SLA: 24 Hours
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Compliance Decision &amp; Vetting Log
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Specific reason flagged by the verification desk
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-error">
              Resubmission Eligible
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-error/[0.06] border border-error/30 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-error">
                <span className="material-symbols-outlined text-base">
                  report
                </span>
                <span>Rejection Reason from Compliance Team</span>
              </div>
              <span className="text-[11px] font-mono text-error/80">
                Dhaka Vetting Desk
              </span>
            </div>
            <p className="text-on-surface leading-relaxed">
              {application.rejectionReason ||
                "Submitted Trade License / BIN code could not be matched with active commercial registry records, or the business owner contact details could not be verified."}
            </p>
          </div>

          <div className="relative space-y-0">
            {verificationSteps.map((item, idx) => {
              const isDone = item.state === "completed";
              const isFailed = item.state === "rejected";
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
                        : isFailed
                          ? "bg-error/15 text-error border border-error/35"
                          : "bg-surface-container-low text-outline border border-outline-variant/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isDone
                        ? "check_circle"
                        : isFailed
                          ? "cancel"
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
                            : isFailed
                              ? "text-error"
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

        {/* Right Column: Actionable Guide OR Inline Resubmit Form */}
        <section className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-5 text-xs">
          {isReapplyOpen ? (
            <form onSubmit={handleResubmitSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    Update &amp; Resubmit
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Corrected details re-enter priority 24-hr vetting
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReapplyOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reapplyForm.ownerName}
                  onChange={(e) =>
                    setReapplyForm({
                      ...reapplyForm,
                      ownerName: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Studio / Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={reapplyForm.storeName}
                  onChange={(e) =>
                    setReapplyForm({
                      ...reapplyForm,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Trade License / BIN
                  </label>
                  <input
                    type="text"
                    required
                    value={reapplyForm.tradeLicense}
                    onChange={(e) =>
                      setReapplyForm({
                        ...reapplyForm,
                        tradeLicense: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={reapplyForm.phone}
                    onChange={(e) =>
                      setReapplyForm({ ...reapplyForm, phone: e.target.value })
                    }
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Correction Note for Reviewers
                </label>
                <textarea
                  rows={2}
                  value={reapplyForm.complianceNote}
                  onChange={(e) =>
                    setReapplyForm({
                      ...reapplyForm,
                      complianceNote: e.target.value,
                    })
                  }
                  placeholder="Explain the updated Trade License / BIN or owner verification..."
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  send
                </span>
                <span>Resubmit for Commercial Review</span>
              </button>
            </form>
          ) : (
            <>
              <div className="pb-3 border-b border-outline-variant/40">
                <h3 className="text-base font-bold text-on-surface">
                  How to Get Approved
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Three quick steps to clear compliance review
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
                  <span className="material-symbols-outlined text-lg text-error shrink-0 mt-0.5">
                    fact_check
                  </span>
                  <div>
                    <p className="font-semibold text-on-surface">
                      Verify License Ownership
                    </p>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      Confirm Trade License / NID / BIN matches owner{" "}
                      <span className="font-medium text-on-surface">
                        {application.ownerName || "Tanvir Ahmed"}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
                  <span className="material-symbols-outlined text-lg text-error shrink-0 mt-0.5">
                    phone_in_talk
                  </span>
                  <div>
                    <p className="font-semibold text-on-surface">
                      Active Business Contact
                    </p>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      Ensure{" "}
                      <span className="font-mono font-medium text-on-surface">
                        {application.phone || "+880 1712 000000"}
                      </span>{" "}
                      can receive OTP &amp; compliance verification calls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
                  <span className="material-symbols-outlined text-lg text-primary shrink-0 mt-0.5">
                    restart_alt
                  </span>
                  <div>
                    <p className="font-semibold text-on-surface">
                      Instant Re-entry to Queue
                    </p>
                    <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                      Resubmitted applications go straight to priority 24-hour
                      commercial vetting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleOpenReapply}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    edit_document
                  </span>
                  <span>Update Details &amp; Reapply</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSupportNotice(
                      `Appeal request logged for #${application.applicationId || "APP-2026-8412"}. Contact compliance@nexus.market for manual document review.`,
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl border border-outline-variant/70 hover:bg-surface-container-low text-on-surface font-medium transition-colors cursor-pointer"
                >
                  Appeal Compliance Decision
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
