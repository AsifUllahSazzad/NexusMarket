import { useState, useMemo } from "react";

export const MerchantReviewsView = ({ reviews, onSaveReply }) => {
  const [filterRating, setFilterRating] = useState("all"); // 'all' | 'unreplied' | '5' | '4' | '3'
  const [draftReplies, setDraftReplies] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterRating === "unreplied") return !r.reply;
      if (filterRating === "all") return true;
      return r.rating === Number(filterRating);
    });
  }, [reviews, filterRating]);

  const unrepliedCount = reviews.filter((r) => !r.reply).length;

  const handleOpenReply = (rev) => {
    setActiveReplyId(rev.id);
    setDraftReplies((prev) => ({
      ...prev,
      [rev.id]: rev.reply || "",
    }));
  };

  const handleSubmitReply = (e, reviewId) => {
    e.preventDefault();
    const text = (draftReplies[reviewId] || "").trim();
    if (!text) return;
    onSaveReply(reviewId, text);
    setActiveReplyId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Ratings Breakdown & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">
              Overall Store Rating
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-on-surface font-mono tabular-nums">
                {avgRating}
              </span>
              <span className="text-xs text-on-surface-variant">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined text-base fill-1"
                >
                  star
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant tabular-nums">
            <span>{reviews.length} verified reviews</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {unrepliedCount} awaiting reply
            </span>
          </div>
        </section>

        <section className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-center gap-2.5">
          <h2 className="text-sm font-bold text-on-surface mb-1">
            Product Rating Distribution
          </h2>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = reviews.length
              ? Math.round((count / reviews.length) * 100)
              : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono tabular-nums text-on-surface-variant shrink-0">
                  {star} star
                </span>
                <div className="flex-1 h-2 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full rounded-full bg-amber-500"
                  />
                </div>
                <span className="w-14 text-right font-mono tabular-nums text-on-surface-variant shrink-0">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </section>
      </div>

      {/* Customer Reviews Feed */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Customer Reviews & Feedback
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Respond directly to verified buyers on your product pages
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Reviews" },
              { id: "unreplied", label: `Needs Reply (${unrepliedCount})` },
              { id: "5", label: "5 ★" },
              { id: "4", label: "4 ★" },
              { id: "3", label: "3 ★" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterRating(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterRating === tab.id
                    ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="py-12 px-6 text-center text-xs text-on-surface-variant">
            No reviews match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/40">
            {filteredReviews.map((rev) => {
              const isReplying = activeReplyId === rev.id;
              return (
                <article key={rev.id} className="p-5 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">
                        {rev.customer}
                      </span>
                      <span aria-hidden="true" className="text-outline">
                        ·
                      </span>
                      <span className="text-on-surface-variant">
                        {rev.product}
                      </span>
                      <span aria-hidden="true" className="text-outline">
                        ·
                      </span>
                      <span className="font-mono text-outline">{rev.sku}</span>
                      {rev.verified && (
                        <>
                          <span aria-hidden="true" className="text-outline">
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="material-symbols-outlined text-sm">
                              verified
                            </span>
                            Verified Buyer
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`material-symbols-outlined text-sm ${
                              idx < rev.rating ? "fill-1" : "opacity-25"
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="font-mono tabular-nums text-outline">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <p className="text-on-surface leading-relaxed max-w-3xl">
                    {rev.comment}
                  </p>

                  {rev.reply && !isReplying && (
                    <div className="mt-2 pt-3 border-t border-outline-variant/30 pl-4 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-primary">
                          Store Response · SonicHub Official
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenReply(rev)}
                          className="text-on-surface-variant hover:text-primary font-medium cursor-pointer"
                        >
                          Edit Reply
                        </button>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed">
                        {rev.reply}
                      </p>
                    </div>
                  )}

                  {!rev.reply && !isReplying && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenReply(rev)}
                        className="px-3.5 py-1.5 rounded-xl border border-outline-variant/70 hover:border-primary text-xs font-medium text-on-surface hover:text-primary transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">
                          reply
                        </span>
                        <span>Respond to Review</span>
                      </button>
                    </div>
                  )}

                  {isReplying && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, rev.id)}
                      className="pt-2 space-y-2.5 max-w-2xl"
                    >
                      <textarea
                        rows={3}
                        required
                        value={draftReplies[rev.id] || ""}
                        onChange={(e) =>
                          setDraftReplies((prev) => ({
                            ...prev,
                            [rev.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a helpful public response to this buyer..."
                        className="w-full p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold cursor-pointer"
                        >
                          Publish Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="px-4 py-1.5 rounded-xl border border-outline-variant/70 text-on-surface hover:bg-surface-container-low cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
