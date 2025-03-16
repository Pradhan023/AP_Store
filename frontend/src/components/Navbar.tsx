import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Menu,
  Home,
  SidebarClose,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserStore from "../stores/userStore";
import useCart from "../stores/useCart";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = UserStore();
  const { cartItem } = useCart();
  const isAdmin = user?.user?.role === "admin";
  const Navigate = useNavigate();
  const Logout = async () => {
    await logout();
    Navigate("/");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap">
          <Link
            to="/"
            className="text-2xl font-bold space-x-2 flex items-center text-emerald-300"
          >
            AP Store
          </Link>

          <nav className="flex-wrap items-center gap-4 hidden md:flex sm:flex lg:flex">
            {user && user?.user?.role !== "admin" && (
              <Link
                to="/"
                className="text-gray-300 hover:text-emerald-300 transition duration-300 ease-in-out"
              >
                Home
              </Link>
            )}

            {user && user?.user?.role !== "admin" && (
              <Link
                to="/cart"
                className="relative group text-gray-300 hover:text-emerald-300 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-300"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2 bg-emerald-400 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-300 transition duration-300 ease-in-out">
                  {cartItem?.length || 0}
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                to={"/admin-dashboard"}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={Logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="sm:mr-2 lg:mr-2" size={18} />
                  <span className="hidden sm:inline lg:inline">Sign Up</span>
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="sm:mr-2 lg:mr-2" size={18} />
                  <span className="hidden sm:inline lg:inline">Login</span>
                </Link>
              </>
            )}
          </nav>

          {/*side nav  */}
          <SideNav
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            user={user}
            isAdmin={isAdmin}
            Logout={Logout}
            cartItem={cartItem}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const SideNav = ({ isMenuOpen, toggleMenu, user, isAdmin, Logout, cartItem }: any) => {
  return (
    <>
      <div className="md:hidden lg:hidden flex justify-center items-center">
      {user && user?.user?.role !== "admin" && (
              <Link
                to="/cart"
                className="relative group bottom-1 text-gray-300 hover:text-emerald-300 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-2 group-hover:text-emerald-300"
                  size={20}
                />
                <span className="absolute -top-1 -left-2 bg-emerald-400 text-white rounded-full px-1.5 py-0.2 text-xs group-hover:bg-emerald-300 transition duration-300 ease-in-out">
                  {cartItem?.length || 0}
                </span>
              </Link>
            )}
        <button
          className="  text-gray-300 hover:text-emerald-300 transition duration-300 ease-in-out"
          onClick={toggleMenu}
        >
          <Menu className="sm:mr-2 lg:mr-2" size={20} />
        </button>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100vw" }} // Start fully outside on the right
          animate={{ opacity: 1, x: 0 }} // Move to its normal position
          exit={{ opacity: 0, x: "100vw" }} // Slide back out when closing
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.1 }} // Smooth easing
          className="fixed inset-0 bg-gray-900 bg-opacity-65 z-50 h-screen w-screen "
        >
          <div className="flex flex-col h-full items-end ">
            <div className="flex flex-col relative items-center py-24 h-full w-60 bg-slate-900">
              <SidebarClose className="absolute top-4 right-4 text-gray-400 hover:text-emerald-300 transition duration-300 ease-in-out"
                onClick={toggleMenu} />
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-white flex items-center gap-2 hover:text-emerald-300 transition duration-300 ease-in-out"
                >
                  <Home size={16} />
                  Home
                </Link>
                {isAdmin && (
                  <Link
                    to={"/admin-dashboard"}
                    className="flex items-center gap-2 hover:text-emerald-300 transition duration-300 ease-in-out"
                  >
                    <Lock size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}
                {user ? (
                  <button
                    className="flex items-center gap-2 hover:text-emerald-300 transition duration-300 ease-in-out "
                    onClick={Logout}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to={"/signup"}
                      className="flex items-center gap-2 hover:text-emerald-300 transition duration-300 ease-in-out"
                    >
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </Link>
                    <Link
                      to={"/login"}
                      className="flex items-center gap-2 hover:text-emerald-300 transition duration-300 ease-in-out"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
