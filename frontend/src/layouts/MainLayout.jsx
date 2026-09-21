import { Outlet } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/navbar/Navbar";
import Register from "../pages/auth/Register";

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};

export default MainLayout;
