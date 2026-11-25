import { useState } from "react";
import { MERCHANT_DASHBOARD_DATA } from "../../merchant/merchantData";

import { MerchantStoreProfileView } from "../../components/screen/merchant/MerchantStoreProfileView";

export const MerchantCreateStoreProfile = ({
  onNavigate = () => {},
  // storeProfile,
  merchantApplication = {},
  onSaveStoreProfile = () => {},
}) => {
  // Store Profile
  const storeProfile = {
    name: "SonicHub Official",
    handle: "@sonichub_bd",
    tagline: "Direct-from-maker spatial acoustics & precision desk hardware.",
    description:
      "Official flagship studio store for AeroTech acoustic gear, custom CNC keyboard accessories, and lossless DACs. Every unit ships sealed with a 12-month official replacement warranty.",
    email: "support@sonichub.nexus.market",
    phone: "+880 1711-904820",
    supportHours: "Sat – Thu, 9:00 AM – 8:00 PM BST",
    address: "Level 4, Suite 402, Multiplan Center, New Elephant Road",
    city: "Dhaka",
    postalCode: "1205",
    logoUrl: "../../assets/images/logo.jpeg",
    bannerUrl: "../../assets/images/merchant_store_banner_1794571596713.jpg",
  };

  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (updatedProfile) => {
    onSaveStoreProfile(updatedProfile);
    setSavedMessage(
      `Store profile "${updatedProfile.name}" has been created and saved to your NexusMarket seller account.`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-lg flex flex-col gap-6">
      {/* Page Header & Breadcrumb */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              NexusMarket
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onNavigate("merchant-dashboard")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Merchant Account
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-on-surface font-medium">
              Create Store Profile
            </span>
          </div>

          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Create Store Profile
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Set up your merchant store identity, contact details, and pickup
            address on NexusMarket.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("merchant-dashboard")}
            className="px-4 py-2 rounded-xl border border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">
              dashboard
            </span>
            <span>Back to Merchant Dashboard</span>
          </button>
        </div>
      </header>

      {/* Save Confirmation Banner */}
      {savedMessage && (
        <div
          role="status"
          className="bg-surface-container-lowest border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-xl text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              check_circle
            </span>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-on-surface">
                Store Profile Created
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {savedMessage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("merchant-dashboard")}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Merchant Dashboard
          </button>
        </div>
      )}

      {/* Store Profile Form */}
      <MerchantStoreProfileView
        profile={storeProfile}
        sampleProfile={storeProfile}
        mode="create"
        application={merchantApplication}
        onSaveProfile={handleSave}
      />
    </div>
  );
};
