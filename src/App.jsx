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
import AdminUpdateProduct from "./Users/pages/AdminUpdateProduct";
import { useAuth } from "./shared/hooks/auth-hook";
import AdminHomePage from "./Users/pages/AdminHomePage";
import AdminCategoryPage from "./Users/pages/AdminCategoryPage";
import UsersHomePage from "./Users/pages/UsersHomePage";
import { CartContextProvider } from "./shared/Context/CartContext";
import UsersCartPage from "./Users/pages/UsersCartPage";
import UsersCheckoutPage from "./Users/pages/UsersCheckoutPage";

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
      { path: "/cart", element: <UsersCartPage /> },
      { path: "/checkout", element: <UsersCheckoutPage /> },
      { path: "/users/home", element: <UsersHomePage /> },
      { path: "/admin/addProduct", element: <AdminAddProduct /> },
      { path: "/admin/homepage", element: <AdminHomePage /> },
      { path: "/admin/updateProduct/:pid", element: <AdminUpdateProduct /> },
      { path: "/admin/products/:category", element: <AdminCategoryPage /> },
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
      <CartContextProvider>
        <AuthContext.Provider
          value={{ isLoggedIn: !!token, userId, login, logout, role }}
        >
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </CartContextProvider>
    </>
  );
}
