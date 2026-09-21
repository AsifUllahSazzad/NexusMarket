const Footer = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant mt-auto transition-colors duration-200">
      <div className="w-full max-w-[1700px] mx-auto px-gutter py-space-xl flex flex-col gap-space-lg">
        {/* Top Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg pb-space-lg border-b border-outline-variant/40">
          {/* Brand Summary Column (2 Cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 text-left w-fit"
            >
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-xl">
                  storefront
                </span>
              </div>
              <span className="text-headline-sm font-headline-sm font-bold text-primary tracking-tight">
                Nexus<span className="text-on-surface">Market</span>
              </span>
            </button>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              Bangladesh’s leading multi-vendor commerce infrastructure. Uniting
              certified distributors, local makers, and global tech direct to
              consumers with guaranteed authenticity.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-label-md text-label-md text-on-surface">
                Regional Escrow:
              </span>
              <span className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary">
                <span className="material-symbols-outlined text-sm">
                  security
                </span>{" "}
                256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          {/* Links Column 1: Customer Care */}
          <div className="flex flex-col gap-2">
            <h4 className="font-title-lg text-title-lg text-on-surface mb-1">
              Customer Care
            </h4>
            <button
              type="button"
              onClick={() => onNavigate("order-tracking")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Buyer Protection
            </button>
            <button
              type="button"
              onClick={() => onNavigate("order-tracking")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Track Direct Shipment
            </button>
            <button
              type="button"
              onClick={() => onNavigate("product-detail")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Doorstep Returns Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate("order-tracking")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Help Center & Disputes
            </button>
          </div>

          {/* Links Column 2: Merchant Hub */}
          <div className="flex flex-col gap-2">
            <h4 className="font-title-lg text-title-lg text-on-surface mb-1">
              Merchant Hub
            </h4>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-left text-primary font-label-md hover:underline transition-colors duration-200"
            >
              Sell with Us
            </button>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Merchant Solutions
            </button>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Fulfillment by NovaDirect
            </button>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Seller Code of Conduct
            </button>
          </div>

          {/* Links Column 3: Trust & Regional */}
          <div className="flex flex-col gap-2">
            <h4 className="font-title-lg text-title-lg text-on-surface mb-1">
              Trust & Regional
            </h4>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Trust & Safety
            </button>
            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate("checkout")}
              className="text-left text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </button>
            <div className="mt-2 pt-2 border-t border-outline-variant/50">
              <span className="font-label-md text-label-md text-outline block mb-1">
                Payment Partners:
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface">
                  bKash
                </span>
                <span className="bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface">
                  Nagad
                </span>
                <span className="bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface">
                  Visa
                </span>
                <span className="bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface">
                  Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© 2025 NexusMarket Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-body-sm">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-primary transition-colors"
            >
              Buyer Protection
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="hover:text-primary transition-colors"
            >
              Merchant Solutions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="hover:text-primary transition-colors"
            >
              Sell with Us
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-primary transition-colors"
            >
              Trust & Safety
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("checkout")}
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate("checkout")}
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
