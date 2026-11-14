import { useEffect, useState } from "react";
import MerchantPending from "../pages/merchant/MerchantPending";
// import MerchantRejected from "../pages/merchant/MerchantRejected";

const MerchantApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/merchant/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setApplication(data.application);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) {
    return <p>Loading merchant application...</p>;
  }

  if (!application) {
    return <p>Unable to load merchant application.</p>;
  }

  if (application.status === "pending") {
    return (
      <MerchantPending
        application={{
          applicationId: application.application_id,
          ownerName: application.owner_name,
          storeName: application.store_name,
          tradeLicense: application.trade_license,
          category: application.category,
          email: application.email,
          phone: application.phone,
          submittedAt: application.submitted_at,
        }}
      />
    );
  }

  return null;
};

export default MerchantApplicationStatus;
