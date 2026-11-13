import { useState, useMemo } from "react";
import { MERCHANT_DASHBOARD_DATA } from "./merchantData";
import { MerchantProductsView } from "../components/screen/merchant/MerchantProductsView";
import { MerchantOrdersView } from "../components/screen/merchant/MerchantOrdersView";
import { MerchantAnalyticsView } from "../components/screen/merchant/MerchantAnalyticsView";
import { MerchantEarningsView } from "../components/screen/merchant/MerchantEarningsView";
import { MerchantStoreProfileView } from "../components/screen/merchant/MerchantStoreProfileView";
import { MerchantReviewsView } from "../components/screen/merchant/MerchantReviewsView";
import { MerchantSettingsView } from "../components/screen/merchant/MerchantSettingsView";

const MerchantDashboardScreen = ({
  onNavigate = () => {},
  currency = "BDT",
  formatPrice = (bdt) => `৳${Number(bdt || 0).toLocaleString()}`,
}) => {
  const {
    store,
    kpisByPeriod,
    analyticsByPeriod,
    categorySplit,
    bestSellingProducts,
    revenueReports,
  } = MERCHANT_DASHBOARD_DATA;

  const [activeNav, setActiveNav] = useState("dashboard");
  const [period, setPeriod] = useState("30d");
  const [chartMetric, setChartMetric] = useState("revenue");
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const [orders, setOrders] = useState(MERCHANT_DASHBOARD_DATA.recentOrders);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [products, setProducts] = useState(
    MERCHANT_DASHBOARD_DATA.inventoryProducts,
  );
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductImageError, setNewProductImageError] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Audio Tech",
    priceBDT: "",
    stock: "",
    listingStatus: "Active",
    imageUrl: "",
    description: "",
  });

  const [earnings, setEarnings] = useState(MERCHANT_DASHBOARD_DATA.earnings);
  const [storeProfile, setStoreProfile] = useState(
    MERCHANT_DASHBOARD_DATA.storeProfile,
  );
  const [reviews, setReviews] = useState(MERCHANT_DASHBOARD_DATA.reviews);
  const [settings, setSettings] = useState(MERCHANT_DASHBOARD_DATA.settings);
  const [bannerMessage, setBannerMessage] = useState("");

  const baseKpis = kpisByPeriod[period];
  const extraProductsCount =
    products.length - MERCHANT_DASHBOARD_DATA.inventoryProducts.length;
  const currentTotalProducts = Math.max(
    0,
    baseKpis.totalProducts + extraProductsCount,
  );
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10,
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "Pending",
  ).length;
  const unrepliedReviewsCount = reviews.filter((r) => !r.reply).length;

  const chartSeries = analyticsByPeriod[period];

  const maxChartValue = useMemo(() => {
    const values = chartSeries.map((item) =>
      chartMetric === "revenue" ? item.revenueBDT : item.orders,
    );
    return Math.max(...values, 1);
  }, [chartSeries, chartMetric]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "All" || order.status === orderStatusFilter;
      const q = orderSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.product.toLowerCase().includes(q) ||
        order.sku.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const handleOrderStatusChange = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: nextStatus }));
    }
    setBannerMessage(`Order ${orderId} updated to ${nextStatus}.`);
  };

  const handleAdjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextStock = Math.max(0, p.stock + delta);
        const nextStatus =
          nextStock === 0
            ? "Out of Stock"
            : nextStock <= 10
              ? "Low Stock"
              : "In Stock";
        return { ...p, stock: nextStock, status: nextStatus };
      }),
    );
  };

  const handleToggleListingStatus = (productId, listingStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, listingStatus } : p)),
    );
    setBannerMessage(`Product status updated to ${listingStatus}.`);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setBannerMessage(`Updated "${updatedProduct.name}".`);
  };

  const handleDeleteProduct = (productId) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (target) {
      setBannerMessage(`Removed "${target.name}" from catalog.`);
    }
  };

  const handleNewProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewProduct((prev) => ({ ...prev, imageUrl: reader.result }));
        setNewProductImageError(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const price = Number(newProduct.priceBDT) || 1500;
    const stock = Math.max(0, Number(newProduct.stock) || 10);
    const created = {
      id: `prod-${Date.now()}`,
      name: newProduct.name.trim(),
      sku:
        newProduct.sku.trim().toUpperCase() ||
        `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProduct.category,
      priceBDT: price,
      stock,
      sold30d: 0,
      status:
        stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "In Stock",
      listingStatus: newProduct.listingStatus || "Active",
      imageUrl: newProduct.imageUrl.trim(),
      description: newProduct.description.trim(),
    };
    setProducts((prev) => [created, ...prev]);
    setNewProduct({
      name: "",
      sku: "",
      category: "Audio Tech",
      priceBDT: "",
      stock: "",
      listingStatus: "Active",
      imageUrl: "",
      description: "",
    });
    setNewProductImageError(false);
    setIsAddProductOpen(false);
    setBannerMessage(`Product "${created.name}" added to catalog.`);
  };

  const handleRequestWithdrawal = ({ amountBDT, method, note }) => {
    const newReqId = `WDR-${Math.floor(4110 + Math.random() * 800)}`;
    const newTxnId = `TXN-${Math.floor(98500 + Math.random() * 400)}`;
    const todayLabel = "13 Nov 2026";
    setEarnings((prev) => ({
      ...prev,
      availableBalanceBDT: Math.max(0, prev.availableBalanceBDT - amountBDT),
      withdrawalRequests: [
        {
          id: newReqId,
          date: todayLabel,
          method,
          amountBDT,
          status: "Processing",
        },
        ...prev.withdrawalRequests,
      ],
      transactions: [
        {
          id: newTxnId,
          date: todayLabel,
          description: note
            ? `Withdrawal (${note}) · ${method}`
            : `Withdrawal Request · ${method}`,
          type: "Withdrawal",
          amountBDT: -amountBDT,
          status: "Processing",
        },
        ...prev.transactions,
      ],
    }));
    setBannerMessage(
      `Withdrawal request ${newReqId} for ${formatPrice(amountBDT)} submitted.`,
    );
  };

  const handleSaveStoreProfile = (updatedProfile) => {
    setStoreProfile(updatedProfile);
    setBannerMessage(`Store profile "${updatedProfile.name}" saved.`);
  };

  const handleSaveReviewReply = (reviewId, replyText) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r)),
    );
    setBannerMessage("Public reply published to customer review.");
  };

  const handleSaveSettings = (updatedSettings, message) => {
    setSettings(updatedSettings);
    setBannerMessage(message || "Merchant settings saved.");
  };

  const handleExportCsv = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Destination",
      "Product",
      "SKU",
      "Items",
      "Amount (BDT)",
      "Payment",
      "Date",
      "Status",
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customer}"`,
      `"${o.destination}"`,
      `"${o.product}"`,
      o.sku,
      o.itemsCount,
      o.amountBDT,
      `"${o.paymentMethod}"`,
      `"${o.date}"`,
      o.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sonichub-orders-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBannerMessage(`Exported ${filteredOrders.length} orders to CSV.`);
  };

  const formatCompactCurrency = (bdt) => {
    const val = currency === "USD" ? Math.round(bdt / 120) : bdt;
    const sym = currency === "USD" ? "$" : "৳";
    if (val >= 1000000) return `${sym}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${sym}${Math.round(val / 1000)}k`;
    return `${sym}${val}`;
  };

  const renderStatusLabel = (status) => {
    const map = {
      Delivered: {
        icon: "check_circle",
        color: "text-emerald-600 dark:text-emerald-400",
      },
      Completed: {
        icon: "check_circle",
        color: "text-emerald-600 dark:text-emerald-400",
      },
      Settled: {
        icon: "check_circle",
        color: "text-emerald-600 dark:text-emerald-400",
      },
      Shipped: {
        icon: "local_shipping",
        color: "text-primary",
      },
      Processing: {
        icon: "inventory_2",
        color: "text-sky-600 dark:text-sky-400",
      },
      "In Escrow": {
        icon: "lock_clock",
        color: "text-amber-600 dark:text-amber-400",
      },
      Pending: {
        icon: "schedule",
        color: "text-amber-600 dark:text-amber-400",
      },
      Disputed: {
        icon: "error",
        color: "text-error",
      },
      Cancelled: {
        icon: "cancel",
        color: "text-error",
      },
      "In Stock": {
        icon: "check_circle",
        color: "text-emerald-600 dark:text-emerald-400",
      },
      "Low Stock": {
        icon: "warning",
        color: "text-amber-600 dark:text-amber-400",
      },
      "Out of Stock": {
        icon: "cancel",
        color: "text-error",
      },
    };
    const cfg = map[status] || {
      icon: "info",
      color: "text-on-surface-variant",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${cfg.color}`}
      >
        <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
        <span>{status}</span>
      </span>
    );
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    {
      id: "products",
      label: "My Products",
      icon: "inventory_2",
      count: products.length,
    },
    {
      id: "orders",
      label: "Orders",
      icon: "receipt_long",
      count: pendingOrdersCount || undefined,
    },
    { id: "analytics", label: "Sales & Analytics", icon: "monitoring" },
    {
      id: "earnings",
      label: "Earnings & Payments",
      icon: "account_balance_wallet",
    },
    { id: "profile", label: "Store Profile", icon: "storefront" },
    {
      id: "reviews",
      label: "Reviews & Ratings",
      icon: "star",
      count: unrepliedReviewsCount || undefined,
    },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const sectionMeta = {
    dashboard: { title: "Dashboard", crumb: "Dashboard" },
    products: { title: "My Products", crumb: "My Products" },
    orders: { title: "Orders", crumb: "Orders" },
    analytics: { title: "Sales & Analytics", crumb: "Sales & Analytics" },
    earnings: { title: "Earnings & Payments", crumb: "Earnings & Payments" },
    profile: { title: "Store Profile", crumb: "Store Profile" },
    reviews: { title: "Reviews & Ratings", crumb: "Reviews & Ratings" },
    settings: { title: "Settings", crumb: "Settings" },
  };

  const periodLabels = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "12m": "Last 12 Months",
  };

  const activePoint =
    hoveredBarIndex !== null && chartSeries[hoveredBarIndex]
      ? chartSeries[hoveredBarIndex]
      : chartSeries[chartSeries.length - 1];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-lg">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Recommended Merchant Sidebar (240px desktop) */}
        <aside className="w-full lg:w-64 shrink-0 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex flex-col gap-4">
          {/* Brand & Store Identity */}
          <div className="pb-4 border-b border-outline-variant/40">
            <p className="text-[11px] font-semibold text-primary tracking-tight">
              NexusMarket Seller
            </p>
            <div className="flex items-center gap-3 mt-2.5">
              <img
                src={storeProfile.logoUrl}
                alt={`${storeProfile.name} logo`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-10 h-10 rounded-xl object-cover border border-outline-variant/40 shrink-0 bg-surface-container-low"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-on-surface truncate">
                  {storeProfile.name}
                </h2>
                <p className="text-xs text-on-surface-variant truncate">
                  {store.tier}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant tabular-nums">
              <span>Rating {store.rating}/5</span>
              <span aria-hidden="true">·</span>
              <span>{store.fulfillmentRate} on-time</span>
            </div>
          </div>

          {/* 8 Recommended Sidebar Navigation Items */}
          <nav
            className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar"
            aria-label="NexusMarket Seller Navigation"
          >
            {sidebarItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="font-mono text-[11px] tabular-nums text-outline">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Payout Quick Snapshot & Logout */}
          <div className="pt-4 border-t border-outline-variant/40 flex flex-col gap-2">
            <div className="hidden lg:block pb-2">
              <span className="text-xs text-on-surface-variant">
                Available Balance
              </span>
              <p className="text-lg font-bold text-on-surface font-mono tabular-nums mt-0.5">
                {formatPrice(earnings.availableBalanceBDT)}
              </p>
              <p className="text-[11px] text-outline mt-0.5">
                Next payout · {store.nextPayoutDate}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="w-full py-2.5 px-3 rounded-xl border border-outline-variant/60 hover:border-error text-xs font-medium text-error hover:bg-error/5 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Control Panel Viewport */}
        <main className="flex-1 min-w-0 w-full flex flex-col gap-6">
          {/* Top Bar Contract: Breadcrumb on left, primary actions on right */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/50">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
                <span>NexusMarket Seller</span>
                <span aria-hidden="true">/</span>
                <span>{storeProfile.name}</span>
                <span aria-hidden="true">/</span>
                <span className="text-on-surface font-medium">
                  {sectionMeta[activeNav]?.crumb}
                </span>
              </div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
                {sectionMeta[activeNav]?.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {activeNav === "dashboard" && (
                <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl">
                  {["7d", "30d", "12m"].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setPeriod(key);
                        setHoveredBarIndex(null);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        period === key
                          ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {key === "7d"
                        ? "7 Days"
                        : key === "30d"
                          ? "30 Days"
                          : "12 Months"}
                    </button>
                  ))}
                </div>
              )}

              {(activeNav === "dashboard" || activeNav === "orders") && (
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl border border-outline-variant/70 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-medium text-on-surface transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    download
                  </span>
                  <span>Export CSV</span>
                </button>
              )}

              {(activeNav === "dashboard" || activeNav === "products") && (
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    add
                  </span>
                  <span>Add Product</span>
                </button>
              )}
            </div>
          </header>

          {/* Action Feedback Banner */}
          {bannerMessage && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-xs text-on-surface">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary">
                  check_circle
                </span>
                <span>{bannerMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerMessage("")}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer px-2 py-0.5"
                aria-label="Dismiss message"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. DASHBOARD OVERVIEW */}
          {activeNav === "dashboard" && (
            <>
              <section
                aria-label="Key store performance metrics"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
              >
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-medium">Total Revenue</span>
                    <span className="material-symbols-outlined text-lg text-primary">
                      payments
                    </span>
                  </div>
                  <div>
                    <p className="font-price-display text-2xl font-bold text-on-surface font-mono tabular-nums tracking-tight">
                      {formatPrice(baseKpis.totalRevenueBDT)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        {baseKpis.revenueDelta}
                      </span>
                      <span className="text-outline">·</span>
                      <span className="text-on-surface-variant">
                        {periodLabels[period]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-medium">Total Sales</span>
                    <span className="material-symbols-outlined text-lg text-secondary">
                      sell
                    </span>
                  </div>
                  <div>
                    <p className="font-price-display text-2xl font-bold text-on-surface font-mono tabular-nums tracking-tight">
                      {baseKpis.totalSales.toLocaleString()} units
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        {baseKpis.salesDelta}
                      </span>
                      <span className="text-outline">·</span>
                      <span className="text-on-surface-variant">
                        Conv. {baseKpis.conversionRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-medium">Total Orders</span>
                    <span className="material-symbols-outlined text-lg text-primary">
                      shopping_bag
                    </span>
                  </div>
                  <div>
                    <p className="font-price-display text-2xl font-bold text-on-surface font-mono tabular-nums tracking-tight">
                      {baseKpis.totalOrders.toLocaleString()}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        {baseKpis.ordersDelta}
                      </span>
                      <span className="text-outline">·</span>
                      <span className="text-on-surface-variant">
                        AOV {formatPrice(baseKpis.avgOrderValueBDT)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="font-medium">Total Products</span>
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <p className="font-price-display text-2xl font-bold text-on-surface font-mono tabular-nums tracking-tight">
                      {currentTotalProducts} SKUs
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                        <span className="material-symbols-outlined text-sm">
                          warning
                        </span>
                        {lowStockCount} low stock
                      </span>
                      <span className="text-outline">·</span>
                      <span className="text-error font-medium">
                        {outOfStockCount} out
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sales Analytics & Category Breakdown */}
              <section
                aria-label="Sales analytics"
                className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
              >
                <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-on-surface">
                        Sales Analytics
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant tabular-nums">
                        <span>{activePoint.label}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-on-surface font-mono">
                          {formatPrice(activePoint.revenueBDT)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{activePoint.orders} orders</span>
                        <span aria-hidden="true">·</span>
                        <span>{activePoint.units} units</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setChartMetric("revenue")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          chartMetric === "revenue"
                            ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Revenue
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartMetric("orders")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          chartMetric === "orders"
                            ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Order Volume
                      </button>
                    </div>
                  </div>

                  <div className="w-full pt-2">
                    <div className="flex items-stretch gap-3 h-56">
                      <div className="flex flex-col justify-between text-[11px] font-mono tabular-nums text-outline py-1 text-right w-14 shrink-0">
                        <span>
                          {chartMetric === "revenue"
                            ? formatCompactCurrency(maxChartValue)
                            : maxChartValue}
                        </span>
                        <span>
                          {chartMetric === "revenue"
                            ? formatCompactCurrency(
                                Math.round(maxChartValue * 0.5),
                              )
                            : Math.round(maxChartValue * 0.5)}
                        </span>
                        <span>0</span>
                      </div>

                      <div className="flex-1 relative flex items-end justify-between gap-2 sm:gap-3 border-b border-l border-outline-variant/50 px-2 sm:px-4 pt-4">
                        <div className="absolute inset-x-0 top-4 border-t border-dashed border-outline-variant/40 pointer-events-none" />
                        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-outline-variant/40 pointer-events-none" />

                        {chartSeries.map((point, index) => {
                          const rawVal =
                            chartMetric === "revenue"
                              ? point.revenueBDT
                              : point.orders;
                          const heightPct = Math.max(
                            8,
                            Math.round((rawVal / maxChartValue) * 100),
                          );
                          const isHovered = hoveredBarIndex === index;

                          return (
                            <button
                              key={point.label}
                              type="button"
                              onMouseEnter={() => setHoveredBarIndex(index)}
                              onMouseLeave={() => setHoveredBarIndex(null)}
                              onFocus={() => setHoveredBarIndex(index)}
                              onBlur={() => setHoveredBarIndex(null)}
                              aria-label={`${point.label}: ${formatPrice(point.revenueBDT)}, ${point.orders} orders`}
                              className="flex-1 h-full flex flex-col items-center justify-end group focus:outline-none cursor-pointer relative z-10"
                            >
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full max-w-[38px] rounded-t-md transition-all duration-200 ${
                                  isHovered
                                    ? "bg-primary"
                                    : "bg-primary/75 group-hover:bg-primary"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-14 shrink-0" />
                      <div className="flex-1 flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4">
                        {chartSeries.map((point, index) => (
                          <span
                            key={point.label}
                            className={`flex-1 text-center text-[11px] font-mono tabular-nums truncate ${
                              hoveredBarIndex === index
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
                </div>

                <div className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">
                      Revenue by Category
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Share across active catalog lines
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 my-auto">
                    {categorySplit.map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-on-surface truncate">
                            {cat.name}
                          </span>
                          <span className="font-mono tabular-nums text-on-surface-variant shrink-0">
                            {cat.share}% ·{" "}
                            {formatCompactCurrency(cat.revenueBDT)}
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
                    <span>Escrow Protected Rate</span>
                    <span className="font-mono tabular-nums font-semibold text-secondary">
                      100.0%
                    </span>
                  </div>
                </div>
              </section>

              {/* Recent Orders Table */}
              <section
                aria-label="Recent orders"
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-outline-variant/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-on-surface">
                      Recent Orders
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
                      Showing {filteredOrders.length} of {orders.length} recent
                      store orders
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-outline text-base pointer-events-none">
                        search
                      </span>
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search order ID, buyer, SKU..."
                        className="h-9 pl-9 pr-3 w-full sm:w-56 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl overflow-x-auto no-scrollbar">
                      {[
                        "All",
                        "Pending",
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Disputed",
                      ].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            orderStatusFilter === status
                              ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 px-6 text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-outline">
                      receipt_long
                    </span>
                    <p className="text-sm font-semibold text-on-surface">
                      No matching orders found
                    </p>
                    <p className="text-xs text-on-surface-variant max-w-sm">
                      Adjust your search term or clear the active status filter
                      to view recent orders.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSearch("");
                        setOrderStatusFilter("All");
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                          <th className="py-3 px-4 whitespace-nowrap">
                            Order ID
                          </th>
                          <th className="py-3 px-4 whitespace-nowrap">
                            Customer
                          </th>
                          <th className="py-3 px-4 whitespace-nowrap">
                            Product & SKU
                          </th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">
                            Qty
                          </th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">
                            Amount
                          </th>
                          <th className="py-3 px-4 whitespace-nowrap">Date</th>
                          <th className="py-3 px-4 whitespace-nowrap">
                            Status
                          </th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">
                            Update
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40 text-xs">
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="h-11 hover:bg-surface-container-low/60 transition-colors"
                          >
                            <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-on-surface whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="hover:text-primary hover:underline cursor-pointer"
                              >
                                {order.id}
                              </button>
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <div className="font-medium text-on-surface">
                                {order.customer}
                              </div>
                              <div className="text-[11px] text-on-surface-variant">
                                {order.destination}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 max-w-[240px]">
                              <div className="text-on-surface truncate">
                                {order.product}
                              </div>
                              <div className="text-[11px] font-mono text-outline">
                                {order.sku} · {order.paymentMethod}
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono tabular-nums text-on-surface">
                              {order.itemsCount}
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
                              <select
                                aria-label={`Update status for ${order.id}`}
                                value={order.status}
                                onChange={(e) =>
                                  handleOrderStatusChange(
                                    order.id,
                                    e.target.value,
                                  )
                                }
                                className="h-8 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Disputed">Disputed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          {/* 2. MY PRODUCTS */}
          {activeNav === "products" && (
            <MerchantProductsView
              products={products}
              onOpenAddModal={() => setIsAddProductOpen(true)}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onAdjustStock={handleAdjustStock}
              onToggleListingStatus={handleToggleListingStatus}
              formatPrice={formatPrice}
              renderStatusLabel={renderStatusLabel}
            />
          )}

          {/* 3. ORDERS */}
          {activeNav === "orders" && (
            <MerchantOrdersView
              orders={orders}
              onUpdateStatus={handleOrderStatusChange}
              onSelectOrder={setSelectedOrder}
              onExportCsv={handleExportCsv}
              formatPrice={formatPrice}
              renderStatusLabel={renderStatusLabel}
            />
          )}

          {/* 4. SALES & ANALYTICS */}
          {activeNav === "analytics" && (
            <MerchantAnalyticsView
              analyticsByPeriod={analyticsByPeriod}
              bestSellingProducts={bestSellingProducts}
              revenueReports={revenueReports}
              categorySplit={categorySplit}
              formatPrice={formatPrice}
              formatCompactCurrency={formatCompactCurrency}
            />
          )}

          {/* 5. EARNINGS & PAYMENTS */}
          {activeNav === "earnings" && (
            <MerchantEarningsView
              earnings={earnings}
              onRequestWithdrawal={handleRequestWithdrawal}
              formatPrice={formatPrice}
              renderStatusLabel={renderStatusLabel}
            />
          )}

          {/* 6. STORE PROFILE */}
          {activeNav === "profile" && (
            <MerchantStoreProfileView
              profile={storeProfile}
              onSaveProfile={handleSaveStoreProfile}
            />
          )}

          {/* 7. REVIEWS & RATINGS */}
          {activeNav === "reviews" && (
            <MerchantReviewsView
              reviews={reviews}
              onSaveReply={handleSaveReviewReply}
            />
          )}

          {/* 8. SETTINGS */}
          {activeNav === "settings" && (
            <MerchantSettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onNotify={(msg) => setBannerMessage(msg)}
            />
          )}
        </main>
      </div>

      {/* Order Quick Inspect Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/40">
              <div>
                <p className="text-xs text-on-surface-variant font-mono">
                  {selectedOrder.id} · {selectedOrder.date}
                </p>
                <h3 className="text-lg font-bold text-on-surface mt-0.5">
                  {selectedOrder.customer}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Product</span>
                <span className="font-medium text-on-surface text-right">
                  {selectedOrder.product}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">SKU & Quantity</span>
                <span className="font-mono tabular-nums text-on-surface">
                  {selectedOrder.sku} × {selectedOrder.itemsCount}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Destination</span>
                <span className="text-on-surface">
                  {selectedOrder.destination}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="text-on-surface">
                  {selectedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Order Status</span>
                {renderStatusLabel(selectedOrder.status)}
              </div>
              <div className="flex justify-between gap-2 pt-2 border-t border-outline-variant/40">
                <span className="font-semibold text-on-surface">
                  Order Total
                </span>
                <span className="font-mono tabular-nums font-bold text-primary text-sm">
                  {formatPrice(selectedOrder.amountBDT)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              {selectedOrder.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => {
                    handleOrderStatusChange(selectedOrder.id, "Processing");
                  }}
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-semibold cursor-pointer"
                >
                  Accept & Process
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  onNavigate("order-tracking");
                }}
                className="px-4 py-2 rounded-xl border border-outline-variant/70 text-xs font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                Open Live Tracker
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddProductOpen(false)}
        >
          <form
            onSubmit={handleAddProduct}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h3 className="text-base font-bold text-on-surface">
                Add New Product
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Product Title
              </label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="e.g. Studio Monitor Arm Pro"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Product Image Link or Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-medium text-on-surface">
                  Product Image (Link or Upload)
                </label>
                {newProduct.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct({ ...newProduct, imageUrl: "" });
                      setNewProductImageError(false);
                    }}
                    className="text-[11px] font-medium text-error hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-xl border border-outline-variant/60 bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center">
                  {newProduct.imageUrl && !newProductImageError ? (
                    <img
                      src={newProduct.imageUrl}
                      alt={newProduct.name || "New product preview"}
                      referrerPolicy="no-referrer"
                      onError={() => setNewProductImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-outline">
                      {newProductImageError
                        ? "broken_image"
                        : "add_photo_alternate"}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    inputMode="url"
                    value={newProduct.imageUrl}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        imageUrl: e.target.value,
                      });
                      setNewProductImageError(false);
                    }}
                    placeholder="https://example.com/product.jpg"
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl border border-outline-variant/70 hover:border-primary bg-surface-container-low text-on-surface hover:text-primary font-medium cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                      <span className="material-symbols-outlined text-sm">
                        upload
                      </span>
                      <span>Upload Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewProductImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      {newProductImageError
                        ? "Could not load image URL"
                        : "Paste image link or pick from device"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                  placeholder="SH-ARM-01"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Audio Tech</option>
                  <option>Computing</option>
                  <option>Accessories</option>
                  <option>Protection</option>
                  <option>Smart Wear</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Price (BDT)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newProduct.priceBDT}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, priceBDT: e.target.value })
                  }
                  placeholder="3200"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                  placeholder="25"
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Status
                </label>
                <select
                  value={newProduct.listingStatus}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      listingStatus: e.target.value,
                    })
                  }
                  className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Key specifications and warranty highlights..."
                className="w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant/70 font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboardScreen;
