import { Menu, Headphones } from "lucide-react";

const SecondaryNav = ({
  activeTab = "Deals of the Week",
  onSelectTab = () => {},
  onCustomerServiceClick = () => {},
  onAllCategoriesClick = () => {},
}) => {
  const navItems = [
    "Deals of the Week",
    "Best Sellers",
    "New Arrivals",
    "Verified Independent Stores",
    "Editorial Collections",
  ];

  return (
    <section className="bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto py-2.5 gap-6">
        <div className="flex items-center gap-6 lg:gap-8 text-xs whitespace-nowrap">
          {/* All Categories Trigger */}
          <button
            onClick={onAllCategoriesClick}
            className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pr-4 border-r border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          {/* Links */}
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onSelectTab(item)}
              className={`transition-colors cursor-pointer ${
                activeTab === item
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Help Desk */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
          <button
            onClick={onCustomerServiceClick}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Customer Service</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecondaryNav;
