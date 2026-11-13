import { useState } from "react";

export const MerchantSettingsView = ({
  settings,
  onSaveSettings,
  onNotify,
}) => {
  const [personal, setPersonal] = useState({
    ownerName: settings.ownerName,
    role: settings.role,
    email: settings.email,
    phone: settings.phone,
  });
  const [notifications, setNotifications] = useState({
    ...settings.notifications,
  });
  const [security, setSecurity] = useState({ ...settings.security });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSavePersonal = (e) => {
    e.preventDefault();
    onSaveSettings(
      {
        ...settings,
        ...personal,
        notifications,
        security,
      },
      "Personal information updated.",
    );
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.next.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordError("");
    const updatedSecurity = {
      ...security,
      lastPasswordUpdate: "Just now",
    };
    setSecurity(updatedSecurity);
    onSaveSettings(
      { ...settings, ...personal, notifications, security: updatedSecurity },
      "Merchant account password updated.",
    );
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    onSaveSettings(
      { ...settings, ...personal, notifications: updated, security },
      "Notification preferences saved.",
    );
  };

  const handleToggleSecurity = (key) => {
    const updated = { ...security, [key]: !security[key] };
    setSecurity(updated);
    onSaveSettings(
      { ...settings, ...personal, notifications, security: updated },
      "Security settings updated.",
    );
  };

  const notificationOptions = [
    {
      key: "newOrders",
      title: "New Customer Orders",
      desc: "Instant alerts when buyers place an escrow-backed order.",
    },
    {
      key: "lowStockAlerts",
      title: "Low Stock Threshold Alerts",
      desc: "Notify when active SKU inventory drops to 10 units or fewer.",
    },
    {
      key: "customerReviews",
      title: "Customer Reviews & Ratings",
      desc: "Alerts whenever a verified buyer leaves product feedback.",
    },
    {
      key: "payoutSettlements",
      title: "Payout & Escrow Settlements",
      desc: "Confirmations for bank withdrawals and released escrow funds.",
    },
    {
      key: "marketingUpdates",
      title: "NexusMarket Campaigns",
      desc: "Invitations to seasonal flash drops and featured seller spotlights.",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-xs">
      {/* Left Column: Personal Info & Password */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        <form
          onSubmit={handleSavePersonal}
          className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4"
        >
          <div className="pb-3 border-b border-outline-variant/40">
            <h2 className="text-base font-bold text-on-surface">
              Personal Information
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Authorized store administrator details
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={personal.ownerName}
                onChange={(e) =>
                  setPersonal({ ...personal, ownerName: e.target.value })
                }
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={personal.role}
                onChange={(e) =>
                  setPersonal({ ...personal, role: e.target.value })
                }
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={personal.email}
                onChange={(e) =>
                  setPersonal({ ...personal, email: e.target.value })
                }
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Mobile Phone
              </label>
              <input
                type="tel"
                required
                value={personal.phone}
                onChange={(e) =>
                  setPersonal({ ...personal, phone: e.target.value })
                }
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer"
            >
              Update Personal Info
            </button>
          </div>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4"
        >
          <div className="pb-3 border-b border-outline-variant/40 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Change Password
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Last updated · {security.lastPasswordUpdate}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords((prev) => !prev)}
              className="text-xs font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {showPasswords ? "visibility_off" : "visibility"}
              </span>
              <span>{showPasswords ? "Hide" : "Show"}</span>
            </button>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Current Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              required
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Enter current password"
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                required
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({ ...passwords, next: e.target.value })
                }
                placeholder="Min. 8 characters"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                required
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                placeholder="Repeat new password"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-error font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{passwordError}</span>
            </p>
          )}

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Notification Preferences & Security Settings */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h2 className="text-base font-bold text-on-surface">
              Notification Preferences
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Choose which operational alerts reach your inbox and SMS
            </p>
          </div>

          <div className="divide-y divide-outline-variant/40">
            {notificationOptions.map((item) => {
              const enabled = !!notifications[item.key];
              return (
                <div
                  key={item.key}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-on-surface">
                      {item.title}
                    </p>
                    <p className="text-on-surface-variant mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => handleToggleNotification(item.key)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      enabled ? "bg-primary" : "bg-outline-variant"
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h2 className="text-base font-bold text-on-surface">
              Security Settings
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Protect payouts, API access, and store login sessions
            </p>
          </div>

          <div className="divide-y divide-outline-variant/40">
            <div className="py-3 first:pt-0 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-on-surface">
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-on-surface-variant mt-0.5">
                  Require a 6-digit authenticator OTP for logins and payouts
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={security.twoFactorEnabled}
                onClick={() => handleToggleSecurity("twoFactorEnabled")}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                  security.twoFactorEnabled
                    ? "bg-secondary"
                    : "bg-outline-variant"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    security.twoFactorEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-on-surface">
                  Unrecognized Login Alerts
                </p>
                <p className="text-on-surface-variant mt-0.5">
                  Send immediate email alerts when signed in from a new device
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={security.loginAlerts}
                onClick={() => handleToggleSecurity("loginAlerts")}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                  security.loginAlerts ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    security.loginAlerts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 last:pb-0 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-on-surface">
                  Escrow Withdrawal OTP Lock
                </p>
                <p className="text-on-surface-variant mt-0.5">
                  Verify every bank or bKash settlement via registered phone OTP
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={security.escrowAutoReleaseOtp}
                onClick={() => handleToggleSecurity("escrowAutoReleaseOtp")}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                  security.escrowAutoReleaseOtp
                    ? "bg-primary"
                    : "bg-outline-variant"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    security.escrowAutoReleaseOtp
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-3">
            <span className="text-on-surface-variant">
              Active sessions · 2 devices (Dhaka, BD)
            </span>
            <button
              type="button"
              onClick={() =>
                onNotify("All other browser sessions have been signed out.")
              }
              className="px-3.5 py-2 rounded-xl border border-outline-variant/70 hover:border-error text-error font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign Out Other Devices
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
