import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import MerchantDashboardScreen from "../merchant/MerchantDashboardScreen";
import MerchantApplicationStatus from "../merchant/MerchantApplicationStatus";
import { merchantDashboardLoader } from "../merchant/merchantDashboardLoader";
import { MerchantNoStoreView } from "../pages/merchant/MerchantNoStoreView";
import { MerchantCreateStoreProfile } from "../pages/merchant/MerchantCreateStoreProfile";

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
        path: "/merchant/no-store",
        element: <MerchantNoStoreView />,
      },
      {
        path: "/merchant/create-store",
        element: <MerchantCreateStoreProfile />,
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
