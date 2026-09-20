import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const TrustStrip = ({ currency = "BDT" }) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            100% Authentic Guarantee
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verified makers only
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            {currency === "USD"
              ? "Free Delivery Over $75"
              : "Free Delivery Over ৳1,500"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Single basket orders
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            7-Day Easy Return
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hassle-free doorstep pickup
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Concierge Resolution
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            24/7 dedicated mediation
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
