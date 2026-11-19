import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import MerchantDashboardScreen from "../merchant/MerchantDashboardScreen";
import MerchantApplicationStatus from "../merchant/MerchantApplicationStatus";
import { merchantDashboardLoader } from "../merchant/merchantDashboardLoader";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/merchant/application-status",
        element: <MerchantApplicationStatus />,
      },
      {
        path: "/merchant/dashboard",
        element: <MerchantDashboardScreen />,
        loader: merchantDashboardLoader,
      },
    ],
  },
]);

export default router;
