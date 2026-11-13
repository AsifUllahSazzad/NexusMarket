import { useState, useMemo } from "react";

export const MerchantAnalyticsView = ({
  analyticsByPeriod,
  bestSellingProducts,
  revenueReports,
  categorySplit,
  formatPrice,
  formatCompactCurrency
}) => {
  const [granularity, setGranularity] = useState("daily"); // 'daily' | 'monthly'
  const [metric, setMetric] = useState("revenue"); // 'revenue' | 'orders'
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const series = granularity === "daily" ? analyticsByPeriod["7d"] : analyticsByPeriod["12m"];

  const maxVal = useMemo(() => {
    const vals = series.map((d) => (metric === "revenue" ? d.revenueBDT : d.orders));
    return Math.max(...vals, 1);
  }, [series, metric]);

  const activePoint =
    hoveredIdx !== null && series[hoveredIdx]
      ? series[hoveredIdx]
      : series[series.length - 1];

  const totalSeriesRevenue = series.reduce((sum, item) => sum + item.revenueBDT, 0);
  const totalSeriesOrders = series.reduce((sum, item) => sum + item.orders, 0);
  const totalSeriesUnits = series.reduce((sum, item) => sum + item.units, 0);

  const handleDownloadReport = () => {
    const headers = ["Month", "Orders", "Gross Revenue (BDT)", "Marketplace Fees (BDT)", "Refunds (BDT)", "Net Revenue (BDT)"];
    const rows = revenueReports.map((r) => [
      `"${r.month}"`,
      r.orders,
      r.grossBDT,
      r.feesBDT,
      r.refundsBDT,
      r.netBDT
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `sonichub-revenue-report-${granularity}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Daily vs Monthly Sales Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">
          <p className="text-xs text-on-surface-variant font-medium">
            {granularity === "daily" ? "7-Day Sales Revenue" : "12-Month Gross Revenue"}
          </p>
          <p className="text-2xl font-bold text-on-surface font-mono tabular-nums mt-1.5">
            {formatPrice(totalSeriesRevenue)}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            {granularity === "daily" ? "Daily average " : "Monthly average "}
            {formatPrice(Math.round(totalSeriesRevenue / series.length))}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">
          <p className="text-xs text-on-surface-variant font-medium">
            {granularity === "daily" ? "Daily Order Volume (7d)" : "Annual Order Volume (12m)"}
          </p>
          <p className="text-2xl font-bold text-on-surface font-mono tabular-nums mt-1.5">
            {totalSeriesOrders.toLocaleString()} orders
          </p>
          <p className="text-xs text-on-surface-variant mt-1 tabular-nums">
            {totalSeriesUnits.toLocaleString()} total units fulfilled
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5">
          <p className="text-xs text-on-surface-variant font-medium">Average Basket Size</p>
          <p className="text-2xl font-bold text-on-surface font-mono tabular-nums mt-1.5">
            {formatPrice(Math.round(totalSeriesRevenue / Math.max(1, totalSeriesOrders)))}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 tabular-nums">
            {(totalSeriesUnits / Math.max(1, totalSeriesOrders)).toFixed(2)} items per order
          </p>
        </div>
      </div>

      {/* Main Sales Chart + Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <section className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {granularity === "daily" ? "Daily Sales Performance" : "Monthly Sales Performance"}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant tabular-nums">
                <span className="font-semibold text-on-surface">{activePoint.label}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-primary">
                  {formatPrice(activePoint.revenueBDT)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activePoint.orders} orders</span>
                <span aria-hidden="true">·</span>
                <span>{activePoint.units} units</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setGranularity("daily");
                    setHoveredIdx(null);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    granularity === "daily"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Daily Sales
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGranularity("monthly");
                    setHoveredIdx(null);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    granularity === "monthly"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Monthly Sales
                </button>
              </div>

              <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMetric("revenue")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    metric === "revenue"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setMetric("orders")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    metric === "orders"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>

          <div className="w-full pt-2">
            <div className="flex items-stretch gap-3 h-60">
              <div className="flex flex-col justify-between text-[11px] font-mono tabular-nums text-outline py-1 text-right w-14 shrink-0">
                <span>
                  {metric === "revenue" ? formatCompactCurrency(maxVal) : maxVal}
                </span>
                <span>
                  {metric === "revenue"
                    ? formatCompactCurrency(Math.round(maxVal * 0.5))
                    : Math.round(maxVal * 0.5)}
                </span>
                <span>0</span>
              </div>

              <div className="flex-1 relative flex items-end justify-between gap-2 border-b border-l border-outline-variant/50 px-2 sm:px-4 pt-4">
                <div className="absolute inset-x-0 top-4 border-t border-dashed border-outline-variant/40 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-outline-variant/40 pointer-events-none" />

                {series.map((point, index) => {
                  const val = metric === "revenue" ? point.revenueBDT : point.orders;
                  const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
                  const isHovered = hoveredIdx === index;

                  return (
                    <button
                      key={point.label}
                      type="button"
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onFocus={() => setHoveredIdx(index)}
                      onBlur={() => setHoveredIdx(null)}
                      aria-label={`${point.label}: ${formatPrice(point.revenueBDT)}`}
                      className="flex-1 h-full flex flex-col items-center justify-end group focus:outline-none cursor-pointer relative z-10"
                    >
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[36px] rounded-t-md transition-all duration-200 ${
                          isHovered ? "bg-primary" : "bg-primary/75 group-hover:bg-primary"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-14 shrink-0" />
              <div className="flex-1 flex items-center justify-between gap-2 px-2 sm:px-4">
                {series.map((point, index) => (
                  <span
                    key={point.label}
                    className={`flex-1 text-center text-[11px] font-mono tabular-nums truncate ${
                      hoveredIdx === index
                        ? "text-on-surface font-semibold"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category Contribution */}
        <section className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">Category Share</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Revenue distribution by product line
            </p>
          </div>
          <div className="flex flex-col gap-4 my-auto">
            {categorySplit.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-on-surface truncate">{cat.name}</span>
                  <span className="font-mono tabular-nums text-on-surface-variant shrink-0">
                    {cat.share}% · {formatCompactCurrency(cat.revenueBDT)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Conversion Rate</span>
            <span className="font-mono tabular-nums font-semibold text-secondary">4.3%</span>
          </div>
        </section>
      </div>

      {/* Best-Selling Products & Revenue Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Best-Selling Products */}
        <section className="xl:col-span-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant/50">
            <h2 className="text-base font-bold text-on-surface">Best-Selling Products</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Top revenue-generating SKUs over the last 30 days
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {bestSellingProducts.map((item) => (
                  <tr key={item.id} className="h-11 hover:bg-surface-container-low/60">
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-on-surface">{item.name}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">
                        {item.sku} · ★ {item.rating}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-on-surface">
                      {item.unitsSold}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-on-surface">
                      {formatPrice(item.revenueBDT)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Monthly Revenue Reports */}
        <section className="xl:col-span-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant/50 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-on-surface">Revenue Reports</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Gross sales, platform fees (5%), refunds, and net payout
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadReport}
              className="px-3 py-1.5 rounded-xl border border-outline-variant/70 hover:bg-surface-container-low text-xs font-medium text-on-surface flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download CSV</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Gross</th>
                  <th className="py-3 px-4 text-right">Fees & Refunds</th>
                  <th className="py-3 px-4 text-right">Net Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {revenueReports.map((rep) => (
                  <tr key={rep.month} className="h-11 hover:bg-surface-container-low/60">
                    <td className="py-2.5 px-4 font-medium text-on-surface whitespace-nowrap">
                      {rep.month}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-on-surface-variant">
                      {rep.orders.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-on-surface">
                      {formatPrice(rep.grossBDT)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-error">
                      -{formatPrice(rep.feesBDT + rep.refundsBDT)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(rep.netBDT)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
