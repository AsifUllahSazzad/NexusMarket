import { useState } from "react";

export const MerchantEarningsView = ({
  earnings,
  onRequestWithdrawal,
  formatPrice,
  renderStatusLabel
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("50000");
  const [payoutMethod, setPayoutMethod] = useState("BRAC Bank Corporate (****4410)");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [txFilter, setTxFilter] = useState("All");

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(withdrawAmount);
    if (!numericAmount || numericAmount < 500) {
      setErrorMsg("Minimum withdrawal amount is 500 BDT.");
      return;
    }
    if (numericAmount > earnings.availableBalanceBDT) {
      setErrorMsg("Requested amount exceeds available balance.");
      return;
    }
    setErrorMsg("");
    onRequestWithdrawal({
      amountBDT: numericAmount,
      method: payoutMethod,
      note
    });
    setWithdrawAmount("");
    setNote("");
  };

  const filteredTransactions = earnings.transactions.filter((tx) => {
    if (txFilter === "All") return true;
    return tx.type === txFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="font-medium">Total Earnings (All-Time)</span>
            <span className="material-symbols-outlined text-lg text-primary">account_balance</span>
          </div>
          <p className="text-2xl font-bold text-on-surface font-mono tabular-nums">
            {formatPrice(earnings.totalEarningsBDT)}
          </p>
          <p className="text-xs text-on-surface-variant">
            Net settled after 5% marketplace fee
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="font-medium">Available Balance</span>
            <span className="material-symbols-outlined text-lg text-secondary">wallet</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {formatPrice(earnings.availableBalanceBDT)}
          </p>
          <p className="text-xs text-on-surface-variant">
            Ready for instant bank or bKash payout
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="font-medium">Pending Escrow Payments</span>
            <span className="material-symbols-outlined text-lg text-amber-600 dark:text-amber-400">
              lock_clock
            </span>
          </div>
          <p className="text-2xl font-bold text-on-surface font-mono tabular-nums">
            {formatPrice(earnings.pendingPaymentsBDT)}
          </p>
          <p className="text-xs text-on-surface-variant">
            Releases upon buyer doorstep OTP confirmation
          </p>
        </div>
      </div>

      {/* Withdrawal Form + Withdrawal Requests History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleWithdrawSubmit}
          className="xl:col-span-5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 space-y-4 text-xs"
        >
          <div className="pb-3 border-b border-outline-variant/40">
            <h2 className="text-base font-bold text-on-surface">Request Withdrawal</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Transfer funds from your available balance to verified payout accounts
            </p>
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Destination Account
            </label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option>BRAC Bank Corporate (****4410)</option>
              <option>City Bank Business Checking (****8902)</option>
              <option>bKash Merchant Wallet (01711-XXXX88)</option>
              <option>Nagad Commercial Wallet (01819-XXXX12)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-on-surface">Amount (BDT)</label>
              <button
                type="button"
                onClick={() => setWithdrawAmount(String(earnings.availableBalanceBDT))}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Use Max ({formatPrice(earnings.availableBalanceBDT)})
              </button>
            </div>
            <input
              type="number"
              min="500"
              required
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-on-surface mb-1">
              Reference Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. November Week 2 Settlement"
              className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {errorMsg && (
            <p className="text-error font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={earnings.availableBalanceBDT < 500}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-semibold transition-colors cursor-pointer"
          >
            Submit Withdrawal Request
          </button>
        </form>

        {/* Withdrawal Requests History */}
        <section className="xl:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant/50">
            <h2 className="text-base font-bold text-on-surface">Withdrawal Requests</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Recent payout transfers and settlement statuses
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Payout Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40 text-xs">
                {earnings.withdrawalRequests.map((req) => (
                  <tr key={req.id} className="h-11 hover:bg-surface-container-low/60">
                    <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-on-surface">
                      {req.id}
                    </td>
                    <td className="py-2.5 px-4 text-on-surface">{req.method}</td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-on-surface-variant whitespace-nowrap">
                      {req.date}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-on-surface whitespace-nowrap">
                      {formatPrice(req.amountBDT)}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {renderStatusLabel(req.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Transaction Ledger */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-on-surface">Transaction History</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Escrow releases, pending order holds, and completed payouts
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl self-start sm:self-auto">
            {["All", "Credit", "Pending", "Withdrawal"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTxFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  txFilter === f
                    ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/50 bg-surface-container-low/50 text-[11px] font-semibold text-on-surface-variant">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 text-xs">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="h-11 hover:bg-surface-container-low/60">
                  <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-on-surface">
                    {tx.id}
                  </td>
                  <td className="py-2.5 px-4 text-on-surface">{tx.description}</td>
                  <td className="py-2.5 px-4 text-on-surface-variant">{tx.type}</td>
                  <td className="py-2.5 px-4 font-mono tabular-nums text-on-surface-variant whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td
                    className={`py-2.5 px-4 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                      tx.amountBDT >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-on-surface"
                    }`}
                  >
                    {tx.amountBDT >= 0 ? "+" : "-"}
                    {formatPrice(Math.abs(tx.amountBDT))}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    {renderStatusLabel(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
