import {
  ShoppingBag,
  ArrowRight,
  Store,
  Star,
  ShieldCheck,
  Zap,
  Flame,
  Eye,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { HERO_PRODUCT, formatPrice } from "../data/mockData";

const HeroSection = ({
  currency = "BDT",
  onAddToCart = () => {},
  onQuickView = () => {},
  onOpenSellModal = () => {},
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-2">
      {/* 1. LEFT COLUMN: Editorial & Exclusive Drop Highlights (7 Columns) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[440px] shadow-sm transition-colors">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Creator Drop Badge */}
          <div className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 mb-5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wider font-bold uppercase text-[11px] text-indigo-600 dark:text-indigo-400">
              Exclusive Creator Drop #042
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              Limited Run
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-[40px] text-slate-900 dark:text-white tracking-tight font-extrabold mb-3 leading-tight">
            Curated Goods from World-Class Independent Artisans &amp; Studios.
          </h1>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 max-w-xl leading-relaxed">
            Direct-from-maker acoustics, bespoke mechanical keyboards, and
            titanium EDC essentials. Verified authenticity with guaranteed buyer
            escrow protection.
          </p>

          {/* Featured Drop Scarcity Preview Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {HERO_PRODUCT.title}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {HERO_PRODUCT.vendor.subtitle}
                  </span>
                </div>
              </div>

              {/* Price & Discount Pill */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {formatPrice(HERO_PRODUCT.priceBDT, currency)}
                </span>
                {HERO_PRODUCT.originalPriceBDT && (
                  <span className="line-through text-slate-400 text-xs font-mono">
                    {formatPrice(HERO_PRODUCT.originalPriceBDT, currency)}
                  </span>
                )}
                <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {HERO_PRODUCT.discountPercentage}% OFF
                </span>
              </div>
            </div>

            {/* Scarcity Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {HERO_PRODUCT.stockLeft} units remaining in today's drop
                </span>
                <span className="text-slate-400 font-mono">86% claimed</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full w-[86%] transition-all duration-700 ease-out" />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-6">
            <button
              type="button"
              onClick={() => onAddToCart(HERO_PRODUCT)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Featured Drop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenSellModal}
              className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Sell Your Craft on NexusMarket</span>
            </button>
          </div>
        </div>

        {/* Trust Badges Bottom Row */}
        <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block leading-none">
                4.96/5
              </span>
              <span className="text-slate-400 text-[11px]">Artisan Trust</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block leading-none">
                100%
              </span>
              <span className="text-slate-400 text-[11px]">Escrow Shield</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block leading-none">
                48h
              </span>
              <span className="text-slate-400 text-[11px]">
                Insured Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: High-Key Studio Photography & Floating Glass Card (5 Columns) */}
      <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[380px] lg:min-h-[440px] group bg-slate-100 dark:bg-slate-800">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          src={HERO_PRODUCT.image}
          alt={HERO_PRODUCT.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Right Badge */}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700 px-3.5 py-2 shadow-xs transition-all flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Verified Maker Drop
          </span>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
            22% OFF
          </span>
        </div>

        {/* Bottom Floating Glass Card */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700 p-4 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="truncate">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {HERO_PRODUCT.title}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  4.9 <Star className="w-3 h-3 fill-amber-400" />
                </span>
                <span className="text-slate-400">
                  ({HERO_PRODUCT.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {formatPrice(HERO_PRODUCT.priceBDT, currency)}
              </p>
              {HERO_PRODUCT.originalPriceBDT && (
                <span className="text-[11px] text-slate-400 line-through font-mono">
                  {formatPrice(HERO_PRODUCT.originalPriceBDT, currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onQuickView(HERO_PRODUCT)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(HERO_PRODUCT)}
              className="flex-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Instant Buy / Drop</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
