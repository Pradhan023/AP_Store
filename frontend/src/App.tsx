import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/layout/layout";
import UserStore from "./stores/userStore";
import { useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import CatrgoryPage from "./pages/CatrgoryPage";
import CartPage from "./pages/CartPage";
import useCart from "./stores/useCart";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import LoadingSpinner from "./components/Spinner";
const App = () => {
  const { user, checkAuth, checkingAuth } = UserStore();
  const { getCartProduct } = useCart();

  useEffect(() => {
    checkAuth();
  }, []);


  useEffect(() => {
		if (!user) return;
		getCartProduct();
	}, [getCartProduct, user]);

  if(checkingAuth) return <LoadingSpinner />
  console.log(import.meta.env.VITE_ENV!)
  return (
    <Layout>
      <Routes>
        <Route path="/" element={user?.user?.role !== "admin" ? <Home /> : <AdminDashboard/>} />
        <Route
          path="/login"
          element={user?.success ? user?.user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={ user?.success ? <Navigate to="/" /> : <Signup /> }
        />
        <Route
          path="/admin-dashboard"
          element={user?.user?.role === "admin" ? <AdminDashboard /> : <Login /> }
        />
        <Route path="/category/:category" element={<CatrgoryPage/>} />
        <Route path="/cart" element={user?.success ? <CartPage/> : <Navigate to="/login" />} />
        <Route path="/purchase-success" element={<PurchaseSuccessPage/> } />
        <Route path="/purchase-cancel" element={<PurchaseCancelPage/> } />
        <Route path="*" element={""} />
      </Routes>
    </Layout>
  );
};

export default App;
