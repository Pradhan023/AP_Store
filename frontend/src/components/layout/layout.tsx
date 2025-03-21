import { FC, ReactNode } from "react";
import Navbar from "../Navbar";
// import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import Footer from "../Footer";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-700 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,255,150,0.4)_0%,rgba(64,224,208,0.3)_45%,rgba(255,255,255,0.1)_100%)]" />

        </div>
      </div>  

      <div className="relative z-50">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
