import { useState } from "react";
export const Navbar = ({
  currentScreen,
  onNavigate,
  cartCount,
  wishlistCount,
  isDark,
  onToggleTheme,
  currency,
  onToggleCurrency,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  const [department, setDepartment] = useState("All Departments");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScreensMenuOpen, setIsScreensMenuOpen] = useState(false);
  const departments = [
    "All Departments",
    "Computing",
    "Phones & Audio",
    "Smart Wear",
    "Apparel & Gear",
    "Cameras",
    "Smart Home"
  ];
  const screensList = [
    { id: "home", label: "1. Home Marketplace", icon: "storefront" },
    { id: "catalog", label: "2. All Products Catalog", icon: "grid_view" },
    { id: "product-detail", label: "3. Product Detail (AeroPro)", icon: "headphones" },
    { id: "cart", label: "4. Shopping Cart / Bag", icon: "shopping_bag" },
    { id: "checkout", label: "5. Secure Checkout", icon: "credit_card" },
    { id: "order-tracking", label: "6. Order Tracking #10025", icon: "local_shipping" },
    { id: "signin", label: "7. Sign In", icon: "login" },
    { id: "signup", label: "8. Sign Up / Register", icon: "person_add" }
  ];
  return <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant/60 shadow-xs transition-colors duration-200">
      {
    /* 1. Top Announcement Notification */
  }
      <div className="bg-surface-container-lowest border-b border-outline-variant/40 text-xs text-on-surface-variant py-2 px-gutter">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="material-symbols-outlined text-sm text-primary flex-shrink-0">local_shipping</span>
            <span className="font-semibold text-on-surface">Free Worldwide Delivery on Orders Over $75</span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="text-on-surface-variant hidden sm:inline truncate">
              Curated Network of 5,000+ Independent Designers & Artisans
            </span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 text-xs">
            {
    /* Quick Screen Switcher Menu for full review of all 8 screens */
  }
            <div className="relative">
              <button
    type="button"
    onClick={() => setIsScreensMenuOpen(!isScreensMenuOpen)}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all font-semibold"
    title="Switch between the 8 designed screens"
  >
                <span className="material-symbols-outlined text-xs">dashboard</span>
                <span className="hidden sm:inline">Explore Screens (8)</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>

              {isScreensMenuOpen && <div
    className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest border border-outline-variant/80 rounded-xl shadow-xl py-2 z-50 text-left"
    onMouseLeave={() => setIsScreensMenuOpen(false)}
  >
                  <div className="px-3 py-1.5 border-b border-outline-variant/30 text-[11px] font-bold uppercase tracking-wider text-outline">
                    Application Screens
                  </div>
                  {screensList.map((screen) => <button
    key={screen.id}
    type="button"
    onClick={() => {
      onNavigate(screen.id);
      setIsScreensMenuOpen(false);
    }}
    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${currentScreen === screen.id ? "bg-primary/10 text-primary font-bold" : "text-on-surface hover:bg-surface-container-low"}`}
  >
                      <span className="material-symbols-outlined text-sm">{screen.icon}</span>
                      <span>{screen.label}</span>
                    </button>)}
                </div>}
            </div>

            <a
    href="#customer-service"
    onClick={(e) => {
      e.preventDefault();
      onNavigate("order-tracking");
    }}
    className="hover:text-primary transition-colors hidden md:inline"
  >
              Customer Service
            </a>

            <span className="text-outline-variant hidden md:inline">|</span>

            {
    /* Currency Switcher */
  }
            <button
    type="button"
    onClick={onToggleCurrency}
    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
    title="Click to toggle currency"
  >
              <span className="font-semibold text-on-surface">{currency === "BDT" ? "BDT (\u09F3)" : "USD ($)"}</span>
              <span className="material-symbols-outlined text-xs">sync_alt</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* 2. Main Navigation Bar */
  }
      <div className="w-full max-w-[1440px] mx-auto px-gutter py-3 flex items-center justify-between gap-4 md:gap-6">
        {
    /* Brand Logo */
  }
        <button
    type="button"
    onClick={() => onNavigate("home")}
    className="flex items-center gap-2 text-left group flex-shrink-0 cursor-pointer"
  >
          <span className="font-headline-lg text-2xl tracking-tight font-extrabold text-on-surface group-hover:text-primary transition-colors">
            Nexus<span className="text-primary font-bold">Market</span>
          </span>
        </button>

        {
    /* Center Pill Search Bar with Department Selector */
  }
        <div className="flex-1 max-w-2xl hidden md:flex items-center">
          <div className="w-full flex items-center bg-surface-container-lowest rounded-full border border-outline-variant hover:border-primary/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 pl-4 pr-1 py-1 transition-all shadow-xs">
            <div className="relative">
              <button
    type="button"
    onClick={() => setIsDeptOpen(!isDeptOpen)}
    className="flex items-center gap-1 text-xs font-label-md text-on-surface hover:text-primary pr-3 flex-shrink-0 focus:outline-none"
  >
                <span className="truncate max-w-[110px]">{department}</span>
                <span className="material-symbols-outlined text-xs text-outline">expand_more</span>
              </button>

              {isDeptOpen && <div
    className="absolute left-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-lg py-1.5 z-50"
    onMouseLeave={() => setIsDeptOpen(false)}
  >
                  {departments.map((dept) => <button
    key={dept}
    type="button"
    onClick={() => {
      setDepartment(dept);
      setIsDeptOpen(false);
    }}
    className="w-full text-left px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
  >
                      {dept}
                    </button>)}
                </div>}
            </div>

            <div className="h-4 w-px bg-outline-variant flex-shrink-0" />

            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchSubmit();
                }
              }}
              placeholder="Search curated goods, categories, independent stores..."
              className="w-full bg-transparent border-0 font-body-sm text-xs focus:ring-0 text-on-surface placeholder:text-outline py-1 px-3 focus:outline-none"
            />

            <button
    type="button"
    onClick={onSearchSubmit}
    className="w-8 h-8 rounded-full bg-on-surface text-surface hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
    aria-label="Search"
  >
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </div>
        </div>

        {
    /* Right Action Utilities */
  }
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
    type="button"
    onClick={() => onNavigate("signup")}
    className="hidden lg:inline text-xs font-label-md text-on-surface hover:text-primary transition-colors font-medium cursor-pointer"
  >
            Sell with Us
          </button>

          {
    /* Wishlist Button */
  }
          <button
    type="button"
    onClick={() => onNavigate("catalog")}
    className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low flex items-center justify-center cursor-pointer"
    aria-label="Wishlist"
    title="Wishlist"
  >
            <span className="material-symbols-outlined text-xl">favorite_border</span>
            {wishlistCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>}
          </button>

          {
    /* Theme Toggle Button */
  }
          <button
    id="themeToggle"
    type="button"
    onClick={onToggleTheme}
    className="w-9 h-9 rounded-full border border-outline-variant/60 hover:border-primary text-on-surface hover:text-primary bg-surface-container-lowest flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
    title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    aria-label="Toggle theme"
  >
            <span className="material-symbols-outlined text-lg">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {
    /* Account Menu */
  }
          <div className="relative">
            <button
    type="button"
    onClick={() => setIsAccountOpen(!isAccountOpen)}
    className="flex items-center gap-1.5 py-1 text-xs font-label-md text-on-surface hover:text-primary transition-colors cursor-pointer"
  >
              <span className="material-symbols-outlined text-xl">person</span>
              <span className="hidden sm:inline font-medium">Account</span>
              <span className="material-symbols-outlined text-xs text-outline">expand_more</span>
            </button>

            {isAccountOpen && <div
    className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest border border-outline-variant/80 rounded-xl shadow-lg py-2 z-50"
    onMouseLeave={() => setIsAccountOpen(false)}
  >
                <div className="px-4 py-2 border-b border-outline-variant/30">
                  <p className="text-xs font-semibold text-on-surface">Signed in as</p>
                  <p className="text-[11px] text-outline truncate">tanvir@nexus.market</p>
                </div>
                <button
    type="button"
    onClick={() => {
      onNavigate("order-tracking");
      setIsAccountOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors text-left"
  >
                  <span className="material-symbols-outlined text-sm text-outline">package_2</span>
                  <span>My Orders (Order #10025)</span>
                </button>
                <button
    type="button"
    onClick={() => {
      onNavigate("catalog");
      setIsAccountOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors text-left"
  >
                  <span className="material-symbols-outlined text-sm text-outline">storefront</span>
                  <span>Browse Catalog</span>
                </button>
                <button
    type="button"
    onClick={() => {
      onNavigate("signin");
      setIsAccountOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors text-left"
  >
                  <span className="material-symbols-outlined text-sm text-outline">login</span>
                  <span>Sign In Screen</span>
                </button>
                <button
    type="button"
    onClick={() => {
      onNavigate("signup");
      setIsAccountOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors text-left"
  >
                  <span className="material-symbols-outlined text-sm text-outline">person_add</span>
                  <span>Create Account / Merchant</span>
                </button>
                <div className="my-1 border-t border-outline-variant/30" />
                <button
    type="button"
    onClick={() => {
      onNavigate("signin");
      setIsAccountOpen(false);
    }}
    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-surface-container-low transition-colors text-left"
  >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Switch User / Sign Out</span>
                </button>
              </div>}
          </div>

          {
    /* Bag Button */
  }
          <button
    type="button"
    onClick={() => onNavigate("cart")}
    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-on-surface text-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all text-xs font-label-md active:scale-[0.98] cursor-pointer shadow-xs"
  >
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            <span className="font-semibold">Bag ({cartCount})</span>
          </button>
        </div>
      </div>

      {
    /* 3. Secondary Sub-Navigation Bar */
  }
      <nav className="bg-surface-container-lowest border-t border-outline-variant/30">
        <div className="w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between overflow-x-auto py-2.5 gap-6 no-scrollbar">
          <div className="flex items-center gap-7 text-xs font-label-md whitespace-nowrap">
            <button
    type="button"
    onClick={() => onNavigate("catalog")}
    className="flex items-center gap-2 text-on-surface font-bold hover:text-primary transition-colors pr-3 border-r border-outline-variant/40"
  >
              <span className="material-symbols-outlined text-base">menu</span>
              <span>All Categories</span>
            </button>
            <button
    type="button"
    onClick={() => onNavigate("catalog")}
    className="text-on-surface hover:text-primary font-medium transition-colors"
  >
              Deals of the Week
            </button>
            <button
    type="button"
    onClick={() => onNavigate("catalog")}
    className="text-on-surface-variant hover:text-on-surface transition-colors"
  >
              Best Sellers
            </button>
            <button
    type="button"
    onClick={() => onNavigate("catalog")}
    className="text-on-surface-variant hover:text-on-surface transition-colors"
  >
              New Arrivals
            </button>
            <button
    type="button"
    onClick={() => onNavigate("home")}
    className="text-on-surface-variant hover:text-on-surface transition-colors"
  >
              Verified Independent Stores
            </button>
            <button
    type="button"
    onClick={() => onNavigate("product-detail")}
    className="text-on-surface-variant hover:text-on-surface transition-colors"
  >
              Editorial Collections
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-label-md text-outline flex-shrink-0">
            <button
    type="button"
    onClick={() => onNavigate("order-tracking")}
    className="text-on-surface-variant hover:text-primary transition-colors font-medium flex items-center gap-1.5"
  >
              <span className="material-symbols-outlined text-sm text-secondary">support_agent</span>
              <span>Customer Service</span>
            </button>
          </div>
        </div>
      </nav>
    </header>;
};
