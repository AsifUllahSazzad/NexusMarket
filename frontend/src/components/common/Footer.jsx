import { useState } from "react";
import {
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  CreditCard,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

const Footer = ({
  onOpenSellModal = () => {},
  onCustomerServiceClick = () => {},
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      {/* Newsletter & Value Proposition Strip */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Get 10% off your first artisan order
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Join 45,000+ shoppers receiving weekly curated drops and limited
              discount drops.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto flex-1 max-w-md"
          >
            <div className="flex items-center bg-slate-800/90 rounded-full border border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 p-1 pl-4 transition-all">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work or personal email..."
                className="w-full bg-transparent border-none text-xs text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Identity Column (Spans 2 cols on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Nexus<span className="text-indigo-400">Market</span>
              </span>
            </a>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Connecting certified regional distributors, independent artisans,
              and global hardware manufacturers directly with discerning
              consumers. Guaranteed authenticity on all items.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium">Escrow Protected:</span>
                <span className="text-slate-400">
                  256-Bit SSL Encrypted Checkout
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">100% Genuine:</span>
                <span className="text-slate-400">
                  Direct-from-Maker Warranty
                </span>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span>Track Active Waybill</span>
            </button>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Doorstep Returns &amp; Exchange</span>
            </button>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Buyer Protection Guarantee</span>
            </button>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Help Center &amp; Dispute Desk</span>
            </button>
          </div>

          {/* Merchant Hub */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Merchant Hub
            </h4>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="text-left font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Open a Seller Store</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Merchant Fee Schedule
            </button>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Fulfillment by NexusDirect
            </button>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Artisan &amp; Maker Grants
            </button>
          </div>

          {/* Regional & Verified Payments */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Payment Methods
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Instant settlement through certified local and international
              payment gateways:
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-200">
                bKash
              </div>
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-200">
                Nagad
              </div>
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-200">
                Visa Card
              </div>
              <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-200">
                Mastercard
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cash on Delivery (Available in 64 Districts)</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} NexusMarket Ltd. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onCustomerServiceClick}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Escrow Guidelines
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Merchant Agreement
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
