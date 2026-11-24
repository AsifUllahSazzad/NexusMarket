import { useState, useMemo } from "react";

export const MerchantProductsView = ({
  products,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onAdjustStock,
  onToggleListingStatus,
  formatPrice,
  renderStatusLabel,
  productErrors = {},
  productSubmitError = "",
  onClearProductError = () => {},
  onResetProductErrors = () => {},
}) => {
  console.log("productErrors", productErrors.name);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImageError, setEditImageError] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState({});
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesStatus =
        statusFilter === "All" ||
        p.listingStatus === statusFilter ||
        p.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [products, search, statusFilter]);

  const activeCount = products.filter(
    (p) => p.listingStatus === "Active",
  ).length;
  const draftCount = products.filter((p) => p.listingStatus === "Draft").length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10,
  ).length;

  const updateEditField = (field, value) => {
    setEditingProduct((prev) => (prev ? { ...prev, [field]: value } : prev));
    onClearProductError(field);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
    setEditImageError(false);
    onResetProductErrors();
  };

  const compressImage = (file, maxSize = 2000, quality = 0.95) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas
          .getContext("2d")
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleEditImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditImageError(true);
      return;
    }
    try {
      const dataUrl = await compressImage(file);
      setEditingProduct((prev) =>
        prev ? { ...prev, imageUrl: dataUrl } : prev,
      );
      setEditImageError(false);
      onClearProductError("imageUrl");
    } catch {
      setEditImageError(true);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      const ok = await onEditProduct({
        ...editingProduct,
        imageBroken: editImageError,
      });
      if (ok !== false) {
        setBrokenImageIds((prev) => {
          if (!prev[editingProduct.id]) return prev;
          const next = { ...prev };
          delete next[editingProduct.id];
          return next;
        });
        handleCloseEditModal();
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">
              Total Catalog SKUs
            </p>
            <p className="text-xl font-bold text-on-surface font-mono tabular-nums mt-1">
              {products.length}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-primary">
            inventory_2
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">
              Active / Draft Listings
            </p>
            <p className="text-xl font-bold text-on-surface font-mono tabular-nums mt-1">
              {activeCount} / {draftCount}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-secondary">
            storefront
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">Low Stock Alerts</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mt-1">
              {lowStockCount}
            </p>
          </div>
          <span className="material-symbols-outlined text-xl text-amber-600 dark:text-amber-400">
            warning
          </span>
        </div>
      </div>

      {/* Main Products Table */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-outline-variant/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">My Products</h2>
            <p className="text-xs text-on-surface-variant mt-0.5 tabular-nums">
              Manage listings, stock quantities, pricing, and visibility status
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-base pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, SKU, category..."
                className="h-9 pl-9 pr-3 w-full sm:w-56 bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl overflow-x-auto no-scrollbar">
              {["All", "Active", "Draft", "Low Stock", "Out of Stock"].map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      statusFilter === st
                        ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {st}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-12 px-6 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-outline">
              inventory_2
            </span>
            <p className="text-sm font-semibold text-on-surface">
              No products match this filter
            </p>
            <p className="text-xs text-on-surface-variant">
              Clear your search query or add a new SKU to your store catalog.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                  <th className="py-3 px-4 whitespace-nowrap">Product</th>
                  <th className="py-3 px-4 whitespace-nowrap">SKU</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    Price
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">
                    Stock Availability
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">
                    Manage Stock
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">
                    Listing Status
                  </th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className="h-12 hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="py-2.5 px-4 max-w-[300px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl border border-outline-variant/50 bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center">
                          {prod.imageUrl && !brokenImageIds[prod.id] ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setBrokenImageIds((prev) => ({
                                  ...prev,
                                  [prod.id]: true,
                                }))
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-lg text-outline">
                              inventory_2
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-on-surface truncate">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-on-surface-variant truncate">
                            {prod.category} · {prod.sold30d} sold (30d)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-on-surface-variant whitespace-nowrap">
                      {prod.sku}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-on-surface whitespace-nowrap">
                      {formatPrice(prod.priceBDT)}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {renderStatusLabel(prod.status)}
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAdjustStock(prod.id, -1)}
                          aria-label={`Decrease stock for ${prod.name}`}
                          className="w-7 h-7 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-on-surface flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-9 text-center font-mono tabular-nums font-semibold text-on-surface">
                          {prod.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAdjustStock(prod.id, 1)}
                          aria-label={`Increase stock for ${prod.name}`}
                          className="w-7 h-7 rounded-lg border border-outline-variant/60 hover:bg-surface-container-low text-on-surface flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <select
                        aria-label={`Product status for ${prod.name}`}
                        value={(prod.listingStatus || "Active").toLowerCase()}
                        onChange={(e) =>
                          onToggleListingStatus(prod.id, e.target.value)
                        }
                        className="h-8 px-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onResetProductErrors();
                            setEditingProduct({ imageUrl: "", ...prod });
                            setEditImageError(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:border-primary text-xs font-medium text-on-surface hover:text-primary transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(prod)}
                          className="px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:border-error text-xs font-medium text-error transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={handleCloseEditModal}
        >
          <form
            noValidate
            onSubmit={handleSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Edit Product
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Update product details, pricing, stock, and media
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center cursor-pointer"
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-medium text-on-surface mb-1">
                Product Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={editingProduct.name}
                aria-invalid={Boolean(productErrors.name)}
                onChange={(e) => updateEditField("name", e.target.value)}
                className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 transition-colors border ${
                  productErrors.name
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {productErrors.name && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{productErrors.name}</span>
                </p>
              )}
            </div>

            {/* Product Image Link or Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-medium text-on-surface">
                  Product Image (Link or Upload)
                </label>
                {editingProduct.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      updateEditField("imageUrl", "");
                      setEditImageError(false);
                    }}
                    className="text-[11px] font-medium text-error hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-20 h-20 rounded-xl border bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center ${
                    productErrors.imageUrl || editImageError
                      ? "border-error/70"
                      : "border-outline-variant/60"
                  }`}
                >
                  {editingProduct.imageUrl && !editImageError ? (
                    <img
                      src={editingProduct.imageUrl}
                      alt={editingProduct.name || "Product preview"}
                      referrerPolicy="no-referrer"
                      onError={() => setEditImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        editImageError ? "text-error" : "text-outline"
                      }`}
                    >
                      {editImageError ? "broken_image" : "add_photo_alternate"}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    inputMode="url"
                    value={editingProduct.imageUrl || ""}
                    aria-invalid={Boolean(productErrors.imageUrl)}
                    onChange={(e) => {
                      updateEditField("imageUrl", e.target.value);
                      setEditImageError(false);
                    }}
                    placeholder="https://example.com/product.jpg"
                    className={`w-full h-10 px-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 transition-colors border ${
                      productErrors.imageUrl
                        ? "bg-error/[0.04] border-error focus:ring-error"
                        : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                    }`}
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
                        onChange={handleEditImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <span
                      className={`text-[11px] truncate ${
                        editImageError
                          ? "text-error font-medium"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {editImageError
                        ? "Image preview failed to load"
                        : "Paste image link or pick from device"}
                    </span>
                  </div>
                </div>
              </div>

              {productErrors.imageUrl && (
                <p
                  role="alert"
                  className="mt-1 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{productErrors.imageUrl}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 items-start">
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  SKU <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={editingProduct.sku}
                  aria-invalid={Boolean(productErrors.sku)}
                  onChange={(e) => updateEditField("sku", e.target.value)}
                  className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono focus:outline-none focus:ring-1 transition-colors border ${
                    productErrors.sku
                      ? "bg-error/[0.04] border-error focus:ring-error"
                      : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                  }`}
                />
                {productErrors.sku && (
                  <p
                    role="alert"
                    className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-error leading-snug"
                  >
                    <span className="material-symbols-outlined text-[14px] shrink-0 mt-px">
                      error
                    </span>
                    <span>{productErrors.sku}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Category
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => updateEditField("category", e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Audio Tech</option>
                  <option>Computing</option>
                  <option>Accessories</option>
                  <option>Protection</option>
                  <option>Smart Wear</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 items-start">
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Price (BDT) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={editingProduct.priceBDT}
                  aria-invalid={Boolean(productErrors.priceBDT)}
                  onChange={(e) => updateEditField("priceBDT", e.target.value)}
                  className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono tabular-nums focus:outline-none focus:ring-1 transition-colors border ${
                    productErrors.priceBDT
                      ? "bg-error/[0.04] border-error focus:ring-error"
                      : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                  }`}
                />
                {productErrors.priceBDT && (
                  <p
                    role="alert"
                    className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-error leading-snug"
                  >
                    <span className="material-symbols-outlined text-[14px] shrink-0 mt-px">
                      error
                    </span>
                    <span>{productErrors.priceBDT}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Stock <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  aria-invalid={Boolean(productErrors.stock)}
                  onChange={(e) => updateEditField("stock", e.target.value)}
                  className={`w-full h-10 px-3 rounded-xl text-on-surface font-mono tabular-nums focus:outline-none focus:ring-1 transition-colors border ${
                    productErrors.stock
                      ? "bg-error/[0.04] border-error focus:ring-error"
                      : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                  }`}
                />
                {productErrors.stock && (
                  <p
                    role="alert"
                    className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-error leading-snug"
                  >
                    <span className="material-symbols-outlined text-[14px] shrink-0 mt-px">
                      error
                    </span>
                    <span>{productErrors.stock}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium text-on-surface mb-1">
                  Status
                </label>
                <select
                  value={editingProduct.listingStatus || "Active"}
                  onChange={(e) =>
                    updateEditField("listingStatus", e.target.value)
                  }
                  className="w-full h-10 px-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-on-surface">
                  Description <span className="text-error">*</span>
                </label>
                <span className="text-[11px] font-mono tabular-nums text-outline">
                  {String(editingProduct.description || "").trim().length}/2000
                </span>
              </div>
              <textarea
                rows={3}
                value={editingProduct.description || ""}
                aria-invalid={Boolean(productErrors.description)}
                onChange={(e) => updateEditField("description", e.target.value)}
                className={`w-full p-3 rounded-xl text-on-surface focus:outline-none focus:ring-1 transition-colors border ${
                  productErrors.description
                    ? "bg-error/[0.04] border-error focus:ring-error"
                    : "bg-surface-container-low border-outline-variant/60 focus:ring-primary"
                }`}
              />
              {productErrors.description && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-error"
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    error
                  </span>
                  <span>{productErrors.description}</span>
                </p>
              )}
            </div>

            {productSubmitError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-error/35 bg-error/[0.08] text-error"
              >
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
                  error
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-xs">
                    Unable to update product
                  </p>
                  <p className="text-[11px] mt-0.5 leading-snug">
                    {productSubmitError}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="px-4 py-2 rounded-xl border border-outline-variant/70 font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-semibold cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                <span>{isSavingEdit ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeletingProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-center gap-2.5 text-error">
              <span className="material-symbols-outlined text-xl">
                delete_forever
              </span>
              <h3 className="text-base font-bold text-on-surface">
                Delete Product
              </h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Remove{" "}
              <span className="font-semibold text-on-surface">
                {deletingProduct.name}
              </span>{" "}
              ({deletingProduct.sku}) from your merchant catalog? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant/70 font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="px-4 py-2 rounded-xl bg-error text-on-error font-semibold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
