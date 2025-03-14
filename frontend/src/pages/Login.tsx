import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Fieldinput from "../components/form/Fieldinput";
import { Namefield } from "../types/form.types";
import { UserPlus, Mail, Lock,ArrowRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import UserStore from "../stores/userStore";

const Login: React.FC = () => {
  const{login,loading} = UserStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Namefield>();

  const onSubmit: SubmitHandler<Namefield> = async(data):Promise<void> => {
    const success = await login(data)
    if(success){
      reset(); // reset the form after submit
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Login
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-[18px] left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <Fieldinput
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  register={register}
                  name="email"
                  errors={errors.email}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-4 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <Fieldinput
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  register={register}
                  name="password"
                  errors={errors.password}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                   hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Signing Up...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Login
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Sign up now <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
