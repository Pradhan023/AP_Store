import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/layout/layout";
import UserStore from "./stores/userStore";
import { lazy, Suspense, useEffect } from "react";
import useCart from "./stores/useCart";
import LoadingSpinner from "./components/Spinner";
const App = () => {
  const { user, checkAuth, checkingAuth } = UserStore();
  const { getCartProduct } = useCart();

  const Home = lazy(() => import("./pages/Home"));
  const CatrgoryPage = lazy(() => import("./pages/CatrgoryPage"));
  const CartPage = lazy(() => import("./pages/CartPage"));
  const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
  const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
  const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
  const Notfound = lazy(() => import("./pages/Notfound"));

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    getCartProduct();
  }, [getCartProduct, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Suspense fallback={checkingAuth ? <LoadingSpinner /> : <LoadingSpinner />}>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              user?.user?.role !== "admin" ? <Home /> : <AdminDashboard />
            }
          />
          <Route
            path="/login"
            element={
              user?.success ? (
                user?.user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/signup"
            element={user?.success ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/admin-dashboard"
            element={
              user?.user?.role === "admin" ? <AdminDashboard /> : <Login />
            }
          />
          <Route path="/category/:category" element={<CatrgoryPage />} />
          <Route
            path="/cart"
            element={user?.success ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
          <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Layout>
    </Suspense>
  );
};

export default App;
