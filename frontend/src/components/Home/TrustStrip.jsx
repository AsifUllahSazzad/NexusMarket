const TrustStrip = ({ currencySymbol = "৳", freeDeliveryThreshold = 1500 }) => {
  const features = [
    {
      icon: "verified",
      title: "100% Authentic Guarantee",
      subtitle: "Verified merchants only",
    },
    {
      icon: "local_shipping",
      title: `Free Delivery Over ${currencySymbol}${freeDeliveryThreshold.toLocaleString()}`,
      subtitle: "Single basket orders",
    },
    {
      icon: "published_with_changes",
      title: "7-Day Easy Return",
      subtitle: "Hassle-free doorstep pickup",
    },
    {
      icon: "support_agent",
      title: "Concierge Resolution",
      subtitle: "24/7 dedicated mediation",
    },
  ];

  return (
    <section
      id="valueTrustStrip"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 px-6 bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-xs"
    >
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-on-surface-variant leading-normal">
              {item.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TrustStrip;
