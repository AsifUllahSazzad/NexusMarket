import { useState } from "react";
const Register = ({ onNavigate }) => {
  const [role, setRole] = useState("merchant");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Dhaka");
  const [tradeLicense, setTradeLicense] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880 ");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("Electronics & Audio");
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onNavigate("home");
      }, 1500);
    }, 1e3);
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-gutter">
      <div className="w-full max-w-xl bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">
              storefront
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Join the NexusMarket Network
          </h1>
          <p className="text-xs text-outline mt-1 max-w-sm mx-auto">
            Choose whether you're joining to discover curated goods or onboard
            your independent brand.
          </p>
        </div>

        {/* Account Mode Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${role === "buyer" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-outline-variant/60 hover:border-outline"}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary text-xl">
                shopping_cart
              </span>
              <span className="text-xs font-bold text-on-surface">
                Buyer & Collector
              </span>
            </div>
            <p className="text-[11px] text-outline leading-snug">
              Shop 5,000+ verified studios, escrow checkout, and 7-day doorstep
              inspection guarantee.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole("merchant")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${role === "merchant" ? "border-secondary bg-secondary/5 ring-1 ring-secondary" : "border-outline-variant/60 hover:border-outline"}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-secondary text-xl">
                verified
              </span>
              <span className="text-xs font-bold text-on-surface">
                Store Merchant & Maker
              </span>
            </div>
            <p className="text-[11px] text-outline leading-snug">
              0% Month 1 commission, unified logistics, 48-hr vetting, and
              automated bi-weekly bank settlements.
            </p>
          </button>
        </div>

        { success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">
                verified
              </span>
            </div>
            <h3 className="font-bold text-base text-on-surface">
              Welcome to NexusMarket!
            </h3>
            <p className="text-xs text-outline max-w-sm mx-auto">
              Your{" "}
              {role === "merchant"
                ? "merchant studio application"
                : "buyer profile"}{" "}
              has been registered. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {role === "merchant" ? (
                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Studio / Brand Name
                  </label>
                  <input
                    key="merchant-store-name"
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Apex Acoustics"
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Delivery City
                  </label>
                  <input
                    key="buyer-delivery-city"
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanvir@example.com"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Mobile Phone (OTP Verification)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712 000000"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {role === "merchant" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Primary Product Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option>Electronics & Audio</option>
                    <option>Mechanical Keyboards & Tech Gear</option>
                    <option>Curated Apparel & Leather Goods</option>
                    <option>Smart Home & IoT</option>
                    <option>Photography & Optics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-on-surface mb-1">
                    Trade License / NID / BIN
                  </label>
                  <input
                    key="merchant-trade-license"
                    type="text"
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    placeholder="e.g. TRAD/DNCC/01928"
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Create Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters with numbers"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary border-outline-variant accent-primary cursor-pointer"
                />
                <span className="text-[11px] text-outline leading-tight">
                  I agree to NexusMarket's Merchant & Buyer Code of Conduct,
                  Escrow Vault Guarantee, and 7-Day Doorstep Inspection Rules.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">
                    refresh
                  </span>
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    verified_user
                  </span>
                  <span>
                    {role === "merchant"
                      ? "Submit Merchant Studio Application"
                      : "Create Buyer Account & Start Exploring"}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center pt-4 border-t border-outline-variant/30 text-xs text-outline">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => onNavigate("signin")}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Sign In to Existing Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
