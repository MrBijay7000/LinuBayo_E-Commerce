import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/NavBar";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* This renders the nested route content dynamically */}
      </main>
    </>
  );
};

export default RootLayout;
