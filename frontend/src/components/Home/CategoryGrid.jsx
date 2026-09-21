import { CATEGORIES } from "../data/mockData";

const CategoryGrid = ({ selectedCategory, onSelectCategory, onViewAll }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Browse by Verified Categories
          </h2>
          <p className="font-body-sm text-body-sm text-outline">
            Directly categorized from 1,200+ authenticated marketplace vendors
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>All Categories</span>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`group flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 shadow-xs cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "bg-surface-container-lowest dark:bg-surface-container-low border-outline-variant hover:border-primary"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors mb-3 ${
                  isSelected
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low dark:bg-surface-container group-hover:bg-primary-fixed text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {cat.icon}
                </span>
              </div>
              <span
                className={`font-label-lg text-xs sm:text-sm leading-tight ${
                  isSelected
                    ? "text-primary font-bold"
                    : "text-on-surface group-hover:text-primary"
                }`}
              >
                {cat.name}
              </span>
              <span className="font-body-sm text-body-sm text-outline mt-0.5">
                {cat.itemCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
