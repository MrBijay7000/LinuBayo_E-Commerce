import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./shared/RootLayout/RootLayout";
import HomePage from "./Products/Pages/HomePage";
import TopsPage from "./Products/Pages/TopsPage";
import LimitedEditionPage from "./Products/Pages/LimitedEditionPage";
import AboutUs from "./shared/FormElements/AboutPage";
import PantsPage from "./Products/Pages/PantsPage";
import AdminAddProduct from "./Users/pages/AdminAddProduct";
import AuthPage from "./Users/pages/AuthPage";
import { AuthContext } from "./shared/Context/auth-context";
import { useCallback, useState } from "react";
import AdminUpdateProduct from "./Users/pages/AdminUpdateProduct";
import { useAuth } from "./shared/hooks/auth-hook";
import AdminHomePage from "./Users/pages/AdminHomePage";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/tops", element: <TopsPage /> },
      { path: "/limited-edition", element: <LimitedEditionPage /> },
      { path: "/pants", element: <PantsPage /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/admin/addProduct", element: <AdminAddProduct /> },
      { path: "/admin/homepage", element: <AdminHomePage /> },
      { path: "/admin/updateProduct/:pid", element: <AdminUpdateProduct /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  const { token, login, logout, userId, role } = useAuth();

  // const [userId, setUserId] = useState(false);

  // const login = useCallback(() => {
  //   setIsLoggedIn(true);
  //   setUserId(userId);
  // }, []);

  // const logout = useCallback(() => {
  //   setIsLoggedIn(false);
  //   setUserId(null);
  // }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />
      <AuthContext.Provider
        value={{ isLoggedIn: !!token, userId, login, logout, role }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}
