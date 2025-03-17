import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import notfound from "/notfound.png"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white relative overflow-hidden bg-[#0f0f0f]">
      {/* Shiny Dark Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_50%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

      {/* Animated 404 Image */}
      <motion.img
        src={notfound}
        alt="404 Illustration"
        className="w-80 sm:w-96 md:w-[450px] lg:w-[500px] mb-4 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Animated 404 Text */}
      <motion.h1
        className="text-7xl font-bold text-gray-200 drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg mt-4 text-gray-400 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      {/* Go Back Button */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-gray-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
