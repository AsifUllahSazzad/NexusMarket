import { useState } from "react";
import storeLaunchHeroImg from "../../assets/images/merchant_store_launch_hero.jpg";
import { useNavigate } from "react-router";

export const MerchantNoStoreView = ({
  application = {},
  onCreateStore = () => {},
  onNavigate = () => {},
  onStatusChange = () => {},
  onStorePreviewChange = () => {},
}) => {
  const [heroImageError, setHeroImageError] = useState(false);

  const navigate = useNavigate()

  const launchCapabilities = [
    {
      index: "01",
      icon: "inventory_2",
      title: "Catalog & SKU Studio",
      detail:
        "Publish product listings with SKU tracking, tiered stock alerts, and category organization.",
    },
    {
      index: "02",
      icon: "local_shipping",
      title: "Live Order Fulfillment",
      detail:
        "Manage incoming customer orders, courier handoffs, and delivery status updates from one queue.",
    },
    {
      index: "03",
      icon: "monitoring",
      title: "Sales & Revenue Analytics",
      detail:
        "Track 7-day, 30-day, and 12-month performance alongside net settlement breakdowns.",
    },
    {
      index: "04",
      icon: "account_balance_wallet",
      title: "Direct Merchant Payouts",
      detail:
        "Withdraw cleared store revenue to bKash Merchant, Nagad, or your verified commercial bank.",
    },
  ];

  const onboardingSteps = [
    {
      step: "01",
      title: "Merchant Account Approved",
      detail: `Your commercial seller credentials for ${application.ownerName || "Tanvir Ahmed"} are active and verified.`,
      status: "Completed",
      state: "done",
    },
    {
      step: "02",
      title: "Create Your Store Profile",
      detail:
        "Set your public store name, @handle, customer support email, and courier pickup address.",
      status: "Required Next · ~2 mins",
      state: "current",
    },
    {
      step: "03",
      title: "Unlock Merchant Dashboard & Publish SKUs",
      detail:
        "Gain full access to analytics, inventory management, public storefront preview, and customer orders.",
      status: "Unlocks Automatically",
      state: "upcoming",
    },
  ];

  const checklistItems = [
    {
      num: "01",
      label: "Store Identity",
      desc: "Display name, unique @handle, and optional logo or banner",
    },
    {
      num: "02",
      label: "Support Contact",
      desc: "Buyer support email, phone line, and operating hours",
    },
    {
      num: "03",
      label: "Pickup Location",
      desc: "Street address, city, and postal code for courier dispatch",
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-lg flex flex-col gap-6">
      {/* Top Bar */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
            <span>NexusMarket Seller</span>
            <span aria-hidden="true">/</span>
            <span className="truncate">
              {application.ownerName || "Merchant Account"}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-on-surface font-medium">
              Store Setup Required
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
            Launch Your NexusMarket Storefront
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("signin")}
            className="px-3.5 py-2 rounded-xl border border-outline-variant/60 hover:border-outline text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Split Editorial Hero: Clear Store Creation Gate */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Content Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Merchant Account Active
              </span>
              <span aria-hidden="true">·</span>
              <span>Dashboard Locked Until Store Creation</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">0% Month-1 Fee</span>
            </div>

            <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight max-w-2xl text-balance">
              Create your store profile to open the Merchant Dashboard
            </h2>

            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
              Your seller account is verified, but you have not registered a
              storefront yet. Set up your store identity and pickup address once
              to unlock the Merchant Dashboard, product publishing, and live
              customer orders.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/merchant/create-store")}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">
                add_business
              </span>
              <span>Create Store Profile</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="px-5 py-3 rounded-xl border border-outline-variant/70 hover:bg-surface-container-low text-xs sm:text-sm font-medium text-on-surface transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">
                storefront
              </span>
              <span>Explore Marketplace</span>
            </button>
          </div>

          {/* Inline 3-Point Readiness Summary */}
          <div className="pt-5 border-t border-outline-variant/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {checklistItems.map((item) => (
              <div key={item.num} className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono tabular-nums font-semibold text-primary">
                    {item.num}
                  </span>
                  <span className="font-bold text-on-surface">
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Editorial Media Column */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-surface-container-low overflow-hidden">
          {!heroImageError ? (
            <img
              src={storeLaunchHeroImg}
              alt="Independent merchant studio desk prepared for storefront launch"
              referrerPolicy="no-referrer"
              onError={() => setHeroImageError(true)}
              className="w-full h-full lg:h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-8 text-center text-white/90 gap-2">
              <span className="material-symbols-outlined text-4xl">
                storefront
              </span>
              <p className="text-sm font-bold">NexusMarket Seller Studio</p>
              <p className="text-xs text-white/70 max-w-xs">
                Register your store details to unlock catalog management and
                fulfillment tools.
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-white/80">
              <span>Seller Launch Kit</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">2-Minute Setup</span>
            </div>
            <p className="text-base font-bold leading-snug">
              Instant storefront activation upon profile submission
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              Next-day courier pickup, zero monthly listing fees, and direct
              bKash or bank settlement.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Full-Width Storefront Capabilities Strip */}
      <section
        aria-label="What unlocks when you create your store"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {launchCapabilities.map((cap) => (
          <div
            key={cap.index}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">
                  {cap.icon}
                </span>
              </div>
              <span className="text-[11px] font-mono tabular-nums font-semibold text-outline">
                {cap.index}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">{cap.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {cap.detail}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom Two-Column Split: Roadmap & Direct Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Storefront Activation Path
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Complete step 02 to unlock the Merchant Dashboard workspace
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-primary">
              1 of 3 Complete
            </span>
          </div>

          <div className="relative space-y-0">
            {onboardingSteps.map((item, idx) => {
              const isDone = item.state === "done";
              const isCurrent = item.state === "current";
              const isLast = idx === onboardingSteps.length - 1;

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
                          ? "bg-primary/15 text-primary border border-primary/35"
                          : "bg-surface-container-low text-outline border border-outline-variant/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isDone
                        ? "check_circle"
                        : isCurrent
                          ? "add_business"
                          : "lock_open"}
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
                              ? "text-primary"
                              : "text-outline"
                        }`}
                      >
                        {item.status}
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
              Why Store Setup Comes First
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Every listing, order, and payout belongs to a verified store
              identity
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
              <span className="material-symbols-outlined text-lg text-primary shrink-0 mt-0.5">
                verified_user
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  Authenticated Buyer Trust
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  Buyers see your store name, handle, and support hours before
                  placing orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70">
              <span className="material-symbols-outlined text-lg text-secondary shrink-0 mt-0.5">
                pin_drop
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  Automated Courier Dispatch
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  Your store address enables instant courier pickup scheduling
                  when orders arrive.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-2">
            <button
              type="button"
              onClick={onCreateStore}
              className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">
                add_business
              </span>
              <span>Set Up My Store Profile</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
