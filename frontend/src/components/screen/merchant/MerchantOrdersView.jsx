import { useState, useMemo } from "react";

export const MerchantOrdersView = ({
  orders,
  onUpdateStatus,
  onSelectOrder,
  onExportCsv,
  formatPrice,
  renderStatusLabel
}) => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("active"); // 'active' | 'history' | 'all'
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("Out of stock at warehouse");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const isHistory = o.status === "Delivered" || o.status === "Cancelled";
      if (viewMode === "active" && isHistory) return false;
      if (viewMode === "history" && !isHistory) return false;
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.sku.toLowerCase().includes(q)
      );
    });
  }, [orders, viewMode, statusFilter, search]);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const completedCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Order Queue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">Awaiting Acceptance</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-1">
              {pendingCount}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-amber-600 dark:text-amber-400">
            schedule
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">In Processing</p>
            <p className="text-xl font-bold text-primary font-mono tabular-nums mt-1">
              {processingCount}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">Completed History</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-1">
              {completedCount}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-emerald-600 dark:text-emerald-400">
            check_circle
          </span>
        </div>
      </div>

      {/* Orders Table Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-outline-variant/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {viewMode === "history" ? "Order History" : "Customer Orders"}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
                Accept pending orders, update dispatch statuses, or inspect escrow details
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl">
              {[
                { id: "active", label: "Active Queue" },
                { id: "history", label: "Order History" },
                { id: "all", label: "All Orders" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setViewMode(tab.id);
                    setStatusFilter("All");
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === tab.id
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID, buyer, SKU..."
                className="h-9 pl-9 pr-3 w-full sm:w-52 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              aria-label="Filter by order status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Disputed">Disputed</option>
            </select>

            <button
              type="button"
              onClick={onExportCsv}
              className="px-3.5 py-2 rounded-xl border border-outline-variant/70 hover:bg-surface-container-low text-xs font-medium text-on-surface flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 px-6 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-outline">receipt_long</span>
            <p className="text-sm font-semibold text-on-surface">No orders found</p>
            <p className="text-xs text-on-surface-variant">
              Switch between Active Queue and Order History or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setViewMode("all");
                setStatusFilter("All");
                setSearch("");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-medium cursor-pointer"
            >
              Show All Orders
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                  <th className="py-3 px-4 whitespace-nowrap">Order ID</th>
                  <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                  <th className="py-3 px-4 whitespace-nowrap">Items</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Total</th>
                  <th className="py-3 px-4 whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="h-12 hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-on-surface whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order)}
                        className="hover:text-primary hover:underline cursor-pointer"
                      >
                        {order.id}
                      </button>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-on-surface">{order.customer}</div>
                      <div className="text-[11px] text-on-surface-variant">{order.destination}</div>
                    </td>
                    <td className="py-2.5 px-4 max-w-[230px]">
                      <div className="text-on-surface truncate">{order.product}</div>
                      <div className="text-[11px] font-mono text-outline">
                        {order.itemsCount} qty · {order.paymentMethod}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-on-surface whitespace-nowrap">
                      {formatPrice(order.amountBDT)}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-on-surface-variant whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {renderStatusLabel(order.status)}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {order.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(order.id, "Processing")}
                            className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-container transition-colors cursor-pointer"
                          >
                            Accept & Process
                          </button>
                        )}
                        <select
                          aria-label={`Change status for ${order.id}`}
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          className="h-8 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Disputed">Disputed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:border-primary text-xs font-medium text-on-surface hover:text-primary cursor-pointer"
                        >
                          Details
                        </button>
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(order)}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:border-error text-xs font-medium text-error cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cancel Order Modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCancelTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-xl">cancel</span>
              <h3 className="text-base font-bold text-on-surface">
                Cancel Order {cancelTarget.id}
              </h3>
            </div>
            <p className="text-on-surface-variant">
              Buyer <span className="font-semibold text-on-surface">{cancelTarget.customer}</span> will receive an automated escrow refund of{" "}
              <span className="font-mono font-semibold text-on-surface">
                {formatPrice(cancelTarget.amountBDT)}
              </span>.
            </p>
            <div>
              <label className="block font-medium text-on-surface mb-1">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option>Out of stock at warehouse</option>
                <option>Customer requested cancellation</option>
                <option>Courier unable to service destination</option>
                <option>Duplicate order detected</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant/70 font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(cancelTarget.id, "Cancelled");
                  setCancelTarget(null);
                }}
                className="px-4 py-2 rounded-xl bg-error text-on-error font-semibold cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
