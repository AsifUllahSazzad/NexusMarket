import { useEffect, useState } from "react";
import { MerchantPending } from "../pages/merchant/MerchantPending";
import { MerchantRejected } from "../pages/merchant/MerchantRejected";
import { useNavigate } from "react-router";

const MerchantApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch merchant data
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required. Please log in again.");
        }

        const response = await fetch(
          "http://localhost:3000/api/merchant/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        // console.log(data);

        if (!response.ok) {
          throw new Error(
            data.message || `Request failed (${response.status})`,
          );
        }

        if (!data.application) {
          throw new Error("Merchant application information not found.");
        }

        setApplication(data.application);
      } catch (error) {
        console.error("Merchant application error:", error);
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  // Merchant Status Approved
  useEffect(() => {
    if (application?.status === "approved") {
      navigate("/merchant/dashboard", { replace: true });
    }
  }, [application, navigate]);

  // Resubmit application
  const handleResubmit = async (payload) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }

    const response = await fetch(
      `http://localhost:3000/api/merchant/applications/${application.application_id}/resubmit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => ({}));
    // console.log(response);

    if (!response.ok) {
      throw new Error(data.message || "Application resubmission failed.");
    }

    if (!data.application) {
      throw new Error("Updated application data was not returned.");
    }

    setApplication(data.application);

    // if (data.application.status === "pending") {
    //   return <MerchantPending application={application} />;
    // }

    return data.application;
  };

  // 1. Loading state
  if (loading) {
    return <p>Loading merchant application...</p>;
  }

  // 2. Error state
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
        <h2 className="text-lg font-bold text-red-600">
          Unable to Load Application
        </h2>

        <p className="text-sm mt-2 text-on-surface-variant">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. Application not found
  if (!application) {
    return <p>Merchant application information not found.</p>;
  }

  // 4. Pending application
  if (application?.status === "pending") {
    return <MerchantPending application={application} />;
  }

  // 5. Rejected application
  if (application?.status === "rejected") {
    return (
      <MerchantRejected application={application} onResubmit={handleResubmit} />
    );
  }

  return <p>Unknown application status.</p>;
};

export default MerchantApplicationStatus;
