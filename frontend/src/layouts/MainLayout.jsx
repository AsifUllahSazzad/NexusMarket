import { Outlet } from "react-router";
import Footer from "../components/common/Footer";
import Header from "../components/navbar/Header";
import SecondaryNav from "../components/navbar/SecondaryNav";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <SecondaryNav />

    <Outlet/>

      <Footer />
    </div>
  );
};

export default MainLayout;
