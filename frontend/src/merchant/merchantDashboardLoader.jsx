import axios from "axios";
import { redirect } from "react-router";

export const merchantDashboardLoader = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return redirect("/login");
    }

    const response = await axios.get(
      "http://localhost:3000/api/merchant/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("-->",response.data)

    const { storeProfile } = response.data;

    // Merchant has no store profile
    if (!storeProfile) {
      return redirect("/merchant/no-store");
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return redirect("/login");
    }

    if (error.response?.status === 403) {
      return redirect("/merchant/application-status");
    }

    throw error;
  }
};
