import { useState } from "react";
import {
  INITIAL_MERCHANT_APPLICATION,
  PENDING_PROGRESS_STEPS,
  WHAT_HAPPENS_NEXT,
  REJECTION_DETAILS,
  INITIAL_VERIFICATION_REQUIREMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_HISTORY,
} from "../merchant/merchantData.js";
import MerchantPending from "../pages/merchant/MerchantPending.jsx";
import MerchantRejected from "../pages/merchant/MerchantRejected.jsx";
import MerchantDashboardScreen from "../merchant/MerchantDashboardScreen.jsx";

function formatCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}



const MerchantApplicationStatus = ({
  status,
  onStatusChange,
  onOpenSupport,
}) => {
  const [application, setApplication] = useState(INITIAL_MERCHANT_APPLICATION);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    documentAlerts: true,
  });
  const [lastChecked, setLastChecked] = useState(() => formatCurrentTime());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [buyerNoticeMessage, setBuyerNoticeMessage] = useState("");

  function handleRefreshStatus() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setLastChecked(formatCurrentTime());
      setIsRefreshing(false);
    }, 350);
  }

  function handleDownloadSummary() {
    const statusLabel =
      status === "rejected"
        ? "Rejected"
        : status === "approved"
          ? "Approved"
          : "Under Review";

    const content = [
      "NEXUSMARKET — MERCHANT APPLICATION SUMMARY",
      "==========================================",
      `Application ID:     ${application.applicationId}`,
      `Store Name:         ${application.storeName}`,
      `Applicant Name:     ${application.applicantName}`,
      `Verification Type:  ${application.verificationType}`,
      `Trade License No.:  ${application.tradeLicenseNumber}`,
      `Submitted Date:     ${application.submittedDate}`,
      `Last Updated:       ${application.lastUpdated}`,
      `Application Status: ${statusLabel}`,
      `Last Checked:       ${lastChecked}`,
      "",
      "Submitted Documents:",
      ...documents.map((d) => `- ${d.name} (${d.type}, ${d.size})`),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${application.applicationId}-application-summary.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function handleAddDocument(newDoc) {
    setDocuments((prev) => [newDoc, ...prev]);
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        timestamp: `14 Nov 2026 · ${formatCurrentTime().slice(0, 5)}`,
        event: "Supporting Document Uploaded",
        actor: application.applicantName,
        status: "Received",
        note: `Attached ${newDoc.name} to application ${application.applicationId}.`,
      },
      ...prev,
    ]);
  }

  function handleRemoveDocument(docId) {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  }

  function handleToggleNotification(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleViewApplication() {
    const el = document.getElementById("details");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleContinueAsBuyer() {
    setBuyerNoticeMessage(
      "Buyer session confirmed — your NexusMarket shopping cart, orders, and checkout access remain active.",
    );
  }

  return (
    <>
      {status === "pending" && (
        <MerchantPending
          application={application}
          progressSteps={PENDING_PROGRESS_STEPS}
          whatHappensNext={WHAT_HAPPENS_NEXT}
          requirements={INITIAL_VERIFICATION_REQUIREMENTS}
          documents={documents}
          history={history}
          notifications={notifications}
          lastChecked={lastChecked}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshStatus}
          onDownloadSummary={handleDownloadSummary}
          onAddDocument={handleAddDocument}
          onRemoveDocument={handleRemoveDocument}
          onToggleNotification={handleToggleNotification}
          onOpenSupport={onOpenSupport}
        />
      )}

      {status === "rejected" && (
        <MerchantRejected
          application={application}
          rejectionDetails={REJECTION_DETAILS}
          requirements={INITIAL_VERIFICATION_REQUIREMENTS}
          documents={documents}
          history={history}
          notifications={notifications}
          lastChecked={lastChecked}
          isRefreshing={isRefreshing}
          buyerNoticeMessage={buyerNoticeMessage}
          onRefresh={handleRefreshStatus}
          onDownloadSummary={handleDownloadSummary}
          onOpenReapply={() => setIsReapplyOpen(true)}
          onOpenSupport={onOpenSupport}
          onViewApplication={handleViewApplication}
          onAddDocument={handleAddDocument}
          onRemoveDocument={handleRemoveDocument}
          onToggleNotification={handleToggleNotification}
          onContinueAsBuyer={handleContinueAsBuyer}
        />
      )}

      {status === "approved" && (
        <MerchantDashboardScreen
          application={application}
          history={history}
          lastChecked={lastChecked}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshStatus}
          onDownloadSummary={handleDownloadSummary}
        />
      )}
    </>
  );
};

export default MerchantApplicationStatus;
