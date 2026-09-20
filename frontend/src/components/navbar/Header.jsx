import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  ChevronDown,
  X,
  Package,
  MapPin,
  Store,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";

const DEPARTMENTS = [
  "All Departments",
  "Computing",
  "Smartphones",
  "Audio Tech",
  "Apparel",
  "Cameras",
  "Smart Wear",
  "Appliances",
  "Gaming",
];

const Header = ({
  cartCount = 0,
  wishlistCount = 0,
  searchTerm = "",
  onSearchChange = () => {},
  selectedDepartment = "All Departments",
  onSelectDepartment = () => {},
  onOpenCart = () => {},
  onOpenWishlist = () => {},
  onOpenSellModal = () => {},
  isDark = false,
  onToggleTheme = () => {},
}) => {
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Nexus
              <span className="text-indigo-600 dark:text-indigo-400">
                Market
              </span>
            </span>
          </a>
        </div>

        {/* Pill Search Bar with Department Selector (Desktop/Tablet) */}
        <div className="flex-1 max-w-2xl mx-2 hidden md:flex items-center relative">
          <div className="w-full flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-500/60 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 pl-4 pr-1.5 py-1.5 transition-all">
            {/* Department Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 pr-3 flex-shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="max-w-[110px] truncate">
                  {selectedDepartment}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDeptDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setShowDeptDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50 max-h-60 overflow-y-auto">
                    {DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          onSelectDepartment(dept);
                          setShowDeptDropdown(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                          selectedDepartment === dept
                            ? "font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 flex-shrink-0" />

            {/* Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search curated products, categories, sellers..."
              className="w-full bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 py-1 px-3 outline-none"
            />

            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 mr-1 text-xs cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Submit Button */}
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
          <button
            onClick={onOpenSellModal}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            Sell with Us
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 cursor-pointer relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <span className="hidden lg:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-1.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Account</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showAccountDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAccountDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Asif Sazzad
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      asifullahsazzad0@gmail.com
                    </p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAccountDropdown(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </a>
                    <a
                      href="#orders"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAccountDropdown(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </a>
                    <a
                      href="#addresses"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAccountDropdown(false);
                      }}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>Saved Addresses</span>
                    </a>
                    <button
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onOpenSellModal();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-slate-400" />
                      <span>Seller Dashboard</span>
                    </button>
                  </div>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <a
                    href="#signout"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAccountDropdown(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="themeToggle"
            type="button"
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 hover:text-indigo-600 bg-white dark:bg-slate-800 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Bag Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all text-xs font-semibold active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="whitespace-nowrap">Bag ({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="w-full flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goods, brands, stores..."
            className="w-full bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
