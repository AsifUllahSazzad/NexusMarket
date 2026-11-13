import { Outlet } from "react-router";
import Footer from "../components/common/Footer";
import Navbar from "../components/navbar/Navbar";

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
