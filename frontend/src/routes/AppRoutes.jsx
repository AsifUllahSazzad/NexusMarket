import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/public/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import MerchantDashboardScreen from "../merchant/MerchantDashboardScreen";

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
        path: "/merchant-dashboard",
        element: <MerchantDashboardScreen/>
      }
    ],
  },
]);

export default router;
