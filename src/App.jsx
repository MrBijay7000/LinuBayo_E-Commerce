import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./shared/RootLayout/RootLayout";
import HomePage from "./Products/Pages/HomePage";
import TopsPage from "./Products/Pages/TopsPage";
import LimitedEditionPage from "./Products/Pages/LimitedEditionPage";
import AboutUs from "./shared/FormElements/AboutPage";
import PantsPage from "./Products/Pages/PantsPage";
import AdminAddProduct from "./Users/admin/pages/AdminAddProduct";
import AuthPage from "./Users/pages/AuthPage";
import { AuthContext } from "./shared/Context/auth-context";
import AdminUpdateProduct from "./Users/admin/pages/AdminUpdateProduct";
import { useAuth } from "./shared/hooks/auth-hook";
import AdminHomePage from "./Users/admin/pages/AdminHomePage";
import AdminCategoryPage from "./Users/admin/pages/AdminCategoryPage";
import UsersHomePage from "./Users/pages/UsersHomePage";
import { CartContextProvider } from "./shared/Context/CartContext";
import UsersCartPage from "./Users/pages/UsersCartPage";
import UsersCheckoutPage from "./Users/pages/UsersCheckoutPage";
import UsersPaymentPage from "./Users/pages/UsersPaymentPage";
import OrderSuccessPage from "./Users/pages/OrderSuccessPage";
import OrderDetailsPage from "./Users/pages/OrderDetailsPage";
import OrdersListPage from "./Users/pages/OrdersListPage";
import BestSellerPage from "./Products/Pages/BestSeller";
import CustomersPage from "./Users/admin/pages/CustomersPage";
import ProductDetailsPage from "./Products/Pages/ProductDetailsPage";
import AdminOrdersPage from "./Users/admin/pages/AdminOrdersPage";
import ProtectedAdminRoute from "./Users/admin/pages/ProtectedAdminRoute";
import DressesPage from "./Products/Pages/DressesPage";
import SkirtsPage from "./Products/Pages/SkirtsPage";
import CoordsPage from "./Products/Pages/CoordsPage";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/tops", element: <TopsPage /> },
      { path: "/limited-edition", element: <LimitedEditionPage /> },
      { path: "/best-seller", element: <BestSellerPage /> },
      { path: "/pants", element: <PantsPage /> },
      { path: "/dresses", element: <DressesPage /> },
      { path: "/skirts", element: <SkirtsPage /> },
      { path: "/coord", element: <CoordsPage /> },
      { path: "/product/:pid", element: <ProductDetailsPage /> },

      { path: "/aboutus", element: <AboutUs /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/cart", element: <UsersCartPage /> },
      { path: "/checkout", element: <UsersCheckoutPage /> },
      { path: "/payment", element: <UsersPaymentPage /> },
      { path: "/order-success", element: <OrderSuccessPage /> },
      { path: "/orders", element: <OrdersListPage /> },
      { path: "/orders/:orderId", element: <OrderDetailsPage /> },
      { path: "/users/home", element: <UsersHomePage /> },
      {
        element: <ProtectedAdminRoute />,
        children: [
          { path: "/admin/addProduct", element: <AdminAddProduct /> },
          { path: "/admin/homepage", element: <AdminHomePage /> },
          {
            path: "/admin/updateProduct/:pid",
            element: <AdminUpdateProduct />,
          },
          { path: "/admin/products/:category", element: <AdminCategoryPage /> },
          { path: "/admin/customersDetails", element: <CustomersPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
        ],
      },
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
        value={{ isLoggedIn: !!token, token, userId, login, logout, role }}
      >
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </AuthContext.Provider>
    </>
  );
}
