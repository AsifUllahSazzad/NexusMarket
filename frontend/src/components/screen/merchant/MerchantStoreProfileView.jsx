import { useState } from "react";

export const MerchantStoreProfileView = ({ profile, onSaveProfile }) => {
  const [form, setForm] = useState({ ...profile });
  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs">
      {/* Store Banner & Logo Preview Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="relative h-48 sm:h-56 bg-surface-container-low overflow-hidden">
          {!bannerError && form.bannerUrl ? (
            <img
              src={form.bannerUrl}
              alt={`${form.name} store banner`}
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white/80 gap-1">
              <span className="material-symbols-outlined text-3xl">storefront</span>
              <span className="font-medium">{form.name} Storefront Banner</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <label className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-medium cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            <span>Change Banner</span>
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
                  alt={`${form.name} logo`}
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl">
                  {form.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="pt-10 sm:pt-0">
              <h2 className="text-lg font-bold text-on-surface">{form.name}</h2>
              <p className="text-xs text-on-surface-variant">
                {form.handle} · {form.city}
              </p>
            </div>
          </div>

          <label className="px-3.5 py-2 rounded-xl border border-outline-variant/70 hover:border-primary bg-surface-container-lowest text-xs font-medium text-on-surface hover:text-primary cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span className="material-symbols-outlined text-sm">upload</span>
            <span>Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "logoUrl")}
              className="sr-only"
            />
          </label>
        </div>
      </section>

      {/* Store Details Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Identity & Description */}
        <section className="xl:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">Store Identity & Description</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Public brand details displayed across NexusMarket storefronts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">Store Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">Store Handle</label>
              <input
                type="text"
                required
                value={form.handle}
                onChange={(e) => setForm({ ...form, handle: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">Short Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">Store Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </section>

        {/* Contact Information & Address */}
        <section className="xl:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-outline-variant/40">
            <h3 className="text-base font-bold text-on-surface">Contact & Store Address</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Used for courier pickups, returns, and buyer inquiries
            </p>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">Support Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">Operating Hours</label>
              <input
                type="text"
                value={form.supportHours}
                onChange={(e) => setForm({ ...form, supportHours: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">Street Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-on-surface mb-1">City</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-medium text-on-surface mb-1">Postal Code</label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold transition-colors cursor-pointer"
            >
              Save Store Profile
            </button>
          </div>
        </section>
      </div>
    </form>
  );
};
