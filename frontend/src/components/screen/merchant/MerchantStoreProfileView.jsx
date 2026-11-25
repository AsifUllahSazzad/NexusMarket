import { useState, useEffect } from "react";

const EMPTY_STORE_FORM = {
  name: "",
  handle: "",
  tagline: "",
  description: "",
  email: "",
  phone: "",
  supportHours: "",
  address: "",
  city: "",
  postalCode: "",
  logoUrl: "",
  bannerUrl: "",
};

export const MerchantStoreProfileView = ({
  profile,
  sampleProfile,
  mode = "update",
  application = {},
  onSaveProfile,
  onOpenPublicStore,
}) => {
  const isCreateMode = mode === "create";

  const buildInitialForm = () => {
    if (!isCreateMode && profile) {
      return { ...profile };
    }
    const customAppName =
      application.storeName && application.storeName !== "SonicHub Official"
        ? application.storeName
        : "";
    return {
      ...EMPTY_STORE_FORM,
      name: customAppName,
      email: application.email || "",
      phone: application.phone || "",
    };
  };

  const [form, setForm] = useState(buildInitialForm);
  const [preSampleForm, setPreSampleForm] = useState(null);
  const [isSampleFilled, setIsSampleFilled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm(buildInitialForm());
    setPreSampleForm(null);
    setIsSampleFilled(false);
    setLogoError(false);
    setBannerError(false);
    setErrors({});
    setSubmitError("");
  }, [mode, profile]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({ ...prev, [field]: reader.result }));
        if (field === "logoUrl") setLogoError(false);
        if (field === "bannerUrl") setBannerError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSample = () => {
    if (!sampleProfile) return;
    if (isSampleFilled) {
      setForm(preSampleForm || buildInitialForm());
      setPreSampleForm(null);
      setIsSampleFilled(false);
    } else {
      setPreSampleForm(form);
      setForm({ ...sampleProfile });
      setIsSampleFilled(true);
    }
    setLogoError(false);
    setBannerError(false);
    setErrors({});
    setSubmitError("");
  };

  // Validation
  const validateStoreForm = (storeProfileData) => {
    const errors = {};

    const {
      storeName = "",
      handle = "",
      tagline = "",
      description = "",
      email = "",
      phone = "",
      address = "",
      city = "",
      postalCode = "",
    } = storeProfileData;

    // 1. Store name
    if (!storeName) {
      errors.name = "Store name is required.";
    } else if (storeName.length < 4) {
      errors.name = "Store name must be at least 4 characters.";
    } else if (storeName.length > 60) {
      errors.name = "Store name cannot exceed 60 characters.";
    }

    // 2. Store handle
    if (!handle) {
      errors.handle = "Store handle is required.";
    } else if (!/^@[a-zA-Z0-9_]{3,30}$/.test(handle)) {
      errors.handle =
        "Handle must start with @ and contain 3-30 letters, numbers, or underscores.";
    }

    // 3. Tagline (optional)
    if (tagline.length > 120) {
      errors.tagline = "Tagline cannot exceed 120 characters.";
    }

    // 4. Description (optional)
    if (description.length > 2000) {
      errors.description = "Description cannot exceed 2000 characters.";
    }

    // 5. Support email
    if (!email) {
      errors.email = "Support email is required.";
    } else if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid support email address.";
    }

    // 6. Contact phone (Bangladesh)
    if (!phone) {
      errors.phone = "Contact phone number is required.";
    } else if (!/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(phone)) {
      errors.phone = "Enter a valid Bangladesh mobile number.";
    }

    // 7. Address
    if (!address) {
      errors.address = "Street address is required.";
    } else if (address.length < 5) {
      errors.address = "Address must be at least 5 characters.";
    } else if (address.length > 250) {
      errors.address = "Address cannot exceed 250 characters.";
    }

    // 8. City
    if (!city) {
      errors.city = "City is required.";
    } else if (city.length < 2) {
      errors.city = "City must be at least 2 characters.";
    } else if (city.length > 100) {
      errors.city = "City cannot exceed 100 characters.";
    }

    // 9. Postal code (Bangladesh)
    if (!postalCode) {
      errors.postalCode = "Postal code is required.";
    } else if (!/^\d{4}$/.test(postalCode)) {
      errors.postalCode = "Postal code must contain exactly 4 digits.";
    }
    return errors;
  };

  // Normalization
  const normalizeStoreForm = (form) => {
    let handle = form.handle?.trim() || "";

    // Add @ automatically
    if (handle && !handle.startsWith("@")) {
      handle = `@${handle}`;
    }

    return {
      storeName: form.name?.trim() || "",
      handle,
      tagline: form.tagline?.trim() || "",
      description: form.description?.trim() || "",
      email: form.email?.trim().toLowerCase() || "",
      phone: form.phone?.trim() || "",
      supportHours:
        form.supportHours?.trim() || "Sat – Thu, 9:00 AM – 8:00 PM BST",
      address: form.address?.trim() || "",
      city: form.city?.trim() || "",
      postalCode: form.postalCode?.trim() || "",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storeProfileData = normalizeStoreForm(form);

    // Validate
    const validationErrors = validateStoreForm(storeProfileData);

    setErrors(validationErrors);

    const errorCount = Object.keys(validationErrors).length;

    if (errorCount > 0) {
      setSubmitError(
        `Please fix the ${errorCount} highlighted field${
          errorCount === 1 ? "" : "s"
        } before ${isCreateMode ? "creating" : "updating"} your store profile.`,
      );

      return;
    }

    setSubmitError("");

    try {
      await onSaveProfile(storeProfileData);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const displayName = form.name.trim() || "New Merchant Store";
  const displayHandle = form.handle.trim() || "@store_handle";
  const displayCity = form.city.trim() || "City not set";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-xs"
    >
      {isCreateMode && sampleProfile && (
        <section
          aria-label="Store creation quick fill"
          className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-on-surface">
              Store Setup Details
            </h2>
            <p className="text-xs text-on-surface-variant">
              Fill in your storefront branding, support email, and courier
              pickup address below.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={isSampleFilled}
            onClick={handleToggleSample}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 ${
              isSampleFilled
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/15"
                : "border-outline-variant/70 hover:border-primary text-on-surface hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isSampleFilled ? "close" : "auto_fix_high"}
            </span>
            <span>
              {isSampleFilled
                ? "Clear Sample Details"
                : "Autofill Sample Details"}
            </span>
          </button>
        </section>
      )}

      {/* Store Banner & Logo Preview Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="relative h-48 sm:h-56 bg-surface-container-low overflow-hidden">
          {!bannerError && form.bannerUrl ? (
            <img
              src={form.bannerUrl}
              alt={`${displayName} store banner`}
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white/80 gap-1">
              <span className="material-symbols-outlined text-3xl">
                storefront
              </span>
              <span className="font-medium">
                {displayName} Storefront Banner
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <label className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-medium cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-sm">
              photo_camera
            </span>
            <span>{form.bannerUrl ? "Change Banner" : "Upload Banner"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "bannerUrl")}
              className="sr-only"
            />
          </label>
        </div>

        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 relative z-10">
          <div className="flex items-end gap-4">
            <div className="relative w-20 h-20 rounded-2xl border-4 border-surface-container-lowest bg-surface-container-low overflow-hidden shrink-0 shadow-sm">
              {!logoError && form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt={`${displayName} logo`}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="pt-10 sm:pt-0">
              <h2 className="text-lg font-bold text-on-surface">
                {displayName}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {displayHandle} · {displayCity}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <label className="px-3.5 py-2 rounded-xl border border-outline-variant/70 hover:border-primary bg-surface-container-lowest text-xs font-medium text-on-surface hover:text-primary cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-sm">upload</span>
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logoUrl")}
                className="sr-only"
              />
            </label>

            {!isCreateMode && onOpenPublicStore && (
              <button
                type="button"
                onClick={onOpenPublicStore}
                className="px-3.5 py-2 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/15 text-xs font-semibold text-primary inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">store</span>
                <span>View Public Store Page</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Store Details Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Identity & Description */}
        <section className="xl:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">
              Store Identity & Description
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Public brand details displayed across NexusMarket storefronts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                Store Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. SonicHub Official"
                className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 border ${
                  errors.name
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {errors.name && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Store Handle <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.handle}
                aria-invalid={Boolean(errors.handle)}
                onChange={(e) => updateField("handle", e.target.value)}
                placeholder="e.g. @sonichub_bd"
                className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 border ${
                  errors.handle
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {errors.handle && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{errors.handle}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Short Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="e.g. Direct-from-maker spatial acoustics & precision desk hardware."
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Store Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your product specialty, authenticity guarantee, and warranty policy..."
              className="w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </section>

        {/* Contact Information & Address */}
        <section className="xl:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">
              Contact & Store Address
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Used for courier pickups, returns, and buyer inquiries
            </p>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Support Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="support@yourstore.nexus.market"
              className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 border ${
                errors.email
                  ? "bg-error/[0.04] border-error focus:ring-error"
                  : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
              }`}
            />
            {errors.email && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
              >
                <span className="material-symbols-outlined text-[14px] shrink-0">
                  error
                </span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                Contact Phone <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                aria-invalid={Boolean(errors.phone)}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+880 1711-904820"
                className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 border ${
                  errors.phone
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {errors.phone && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={form.supportHours}
                onChange={(e) => updateField("supportHours", e.target.value)}
                placeholder="Sat – Thu, 9:00 AM – 8:00 PM"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Street Address <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.address}
              aria-invalid={Boolean(errors.address)}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Level 4, Suite 402, Multiplan Center"
              className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 border ${
                errors.address
                  ? "bg-error/[0.04] border-error focus:ring-error"
                  : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
              }`}
            />
            {errors.address && (
              <p
                role="alert"
                className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
              >
                <span className="material-symbols-outlined text-[14px] shrink-0">
                  error
                </span>
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label className="block font-medium text-on-surface mb-1">
                City <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                aria-invalid={Boolean(errors.city)}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Dhaka"
                className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 border ${
                  errors.city
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {errors.city && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{errors.city}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-on-surface mb-1">
                Postal Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.postalCode}
                aria-invalid={Boolean(errors.postalCode)}
                onChange={(e) => updateField("postalCode", e.target.value)}
                placeholder="1205"
                className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 border ${
                  errors.postalCode
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {errors.postalCode && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{errors.postalCode}</span>
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-error/35 bg-error/[0.08] text-error"
            >
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
                error
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-xs">
                  {isCreateMode
                    ? "Unable to create store profile"
                    : "Unable to update store profile"}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug">{submitError}</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {isCreateMode ? "add_business" : "save"}
              </span>
              <span>
                {isCreateMode ? "Create Store Profile" : "Update Store Profile"}
              </span>
            </button>
          </div>
        </section>
      </div>
    </form>
  );
};
