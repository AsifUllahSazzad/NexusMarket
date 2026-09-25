import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router";
const Register = ({ onNavigate }) => {
  const [role, setRole] = useState("merchant");
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Dhaka");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880 ");
  const [category, setCategory] = useState("Electronics & Audio");
  const [tradeLicense, setTradeLicense] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // validation form:
  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const cleanPhone = phone.replace(/[\s-]/g, "");

      const bdPhoneRegex = /^(?:01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

      if (!bdPhoneRegex.test(cleanPhone)) {
        newErrors.phone = "Enter a valid Bangladesh phone number";
      }
    }
    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Merchant-specific validation
    if (role === "merchant") {
      // Studio/Brand Name
      if (!storeName.trim()) {
        newErrors.storeName = "Store name is required";
      } else if (storeName.trim().length < 2) {
        newErrors.storeName = "Store name must be at least 2 characters";
      }

      // Trade License/NID/BIN
      if (!tradeLicense.trim()) {
        newErrors.tradeLicense = "Trade license / NID / BIN is required";
      } else if (!/^[A-Za-z0-9]{4,20}$/.test(tradeLicense.trim())) {
        newErrors.tradeLicense =
          "Enter a valid Trade license / NID / BIN (4–20 alphanumeric characters)";
      }
    }

    // Buyer-specific validation
    if (role === "buyer") {
      if (!deliveryCity.trim()) {
        newErrors.deliveryCity = "Delivery city is required";
      }
    }

    // Terms
    if (!agreed) {
      newErrors.agreed = "You must agree to the terms";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const validationError = validateForm();
    setErrors(validationError);

    if (Object.keys(validationError).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (role === "merchant") {
        const response = await axios.post("/api/auth/register/merchant", {
          name,
          storeName,
          email,
          phone,
          category,
          tradeLicense,
          password,
        });
        console.log("Merchant: ", response);
      } else {
        const response = await axios.post("/api/auth/register/customer", {
          name,
          email,
          phone,
          password,
          deliveryCity,
        });

        console.log("Customer: ", response);
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigate("home");
      }, 1500);
    } catch (err) {
      // console.error(err.response.data.error);

      if (err.response?.status === 409) {
        return setErrors(err.response?.data?.errors);
      }

      setErrors({
        submit:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

        {/* resolve must */}
        {success ? (
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
                  placeholder="e.g. Shariful Islam"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="mt-1 pl-1 text-[11px] text-red-500">
                    {errors.name}
                  </p>
                )}
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

                  {errors.storeName && (
                    <p className="mt-1 pl-1 text-[11px] text-red-500">
                      {errors.storeName}
                    </p>
                  )}
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

                  {errors.deliveryCity && (
                    <p className="mt-1 pl-1 text-[11px] text-red-500">
                      {errors.deliveryCity}
                    </p>
                  )}
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

                {errors.email && (
                  <p className="mt-1 pl-1 text-[11px] text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Mobile Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712 000000"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.phone && (
                  <p className="mt-1 pl-1 text-[11px] text-red-500">
                    {errors.phone}
                  </p>
                )}
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

                  {errors.tradeLicense && (
                    <p className="mt-1 pl-1 text-[11px] text-red-500">
                      {errors.tradeLicense}
                    </p>
                  )}
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

              {errors.password && (
                <p className="mt-1 pl-1 text-[11px] text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {role === "merchant" ? (
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
                    I agree to NexusMarket’s Merchant Code of Conduct, Escrow
                    Vault Guarantee, and 7-Day Doorstep Inspection Rules.
                  </span>
                </label>
              </div>
            ) : (
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
                    I agree to NexusMarket’s Buyer Code of Conduct, Escrow Vault
                    Guarantee, and 7-Day Doorstep Inspection Rules.
                  </span>
                </label>
              </div>
            )}

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
          <NavLink
          to={'/login'}
            onClick={() => onNavigate("signin")}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Sign In to Existing Account
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
