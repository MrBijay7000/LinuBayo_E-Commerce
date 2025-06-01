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
      { path: "/admin/addproduct", element: <AdminAddProduct /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}
