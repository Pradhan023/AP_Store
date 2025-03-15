import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

interface IProps {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface IUserStore {
  user: any;
  loading: boolean;
  checkingAuth: boolean;
  signup: (data: IProps) => Promise<boolean>;
  login: (data: IProps) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<any>;
}

const UserStore = create<IUserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: false,

  signup: async ({ name, email, password }) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ loading: false });
      toast.success(res.data.message);
      return res.data.success;
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response.data.message || "Something went wrong");
      return false;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signin", { email, password });
      set({ user: res.data, loading: false });
      toast.success(res.data.message);
      return res.data.success;
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data.message || "Something went wrong");
      return false;
    }
  },

  // here we are checking if user is logged in or not for accessing protected routes
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error: any) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success(res?.data?.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return;
    set({ checkingAuth: true });
    try {
      const res = await axiosInstance.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ checkingAuth: false, user: null });
      throw error;
    }
  },
}));

export default UserStore;

// axios interceptor for refreshing the token

let refreshPromise: any = null; // create a variable to store the refresh promise before retrying the original request

axiosInstance.interceptors.response.use(
  // intercept the response means if the request is successful then this function will be called
  (response) => response, // If the request is successful, return the response
  async (error) => {
    // If the request fails, check if the error response has a status code of 401 (Unauthorized)
    const originalRequest = error.config; // Get the original request object means the request that failed from the axios instance , error.config is a property of the error object that contains the original request object and it contains all the information about the request that failed like url, method, headers, data, etc ,
    if (error.response.status === 401 && !originalRequest._retry) {
      // If the error response has a status code of 401 (Unauthorized) and the original request has not already been retried
      originalRequest._retry = true; // Set the _retry property of the original request object to true to indicate that it has already been retried , this is used to prevent infinite loop of retrying the request
      try {
        if (refreshPromise) {
          await refreshPromise; // Wait for the refresh promise to resolve before retrying the original request
          return axiosInstance(originalRequest); // Retry the original request with the new access token from the refresh token
        }

        // start a new refresh promise
        refreshPromise = UserStore.getState().refreshToken(); // Call the refreshToken function to get a new access token

        // wait for the new access token to be resolved
        await refreshPromise;
        refreshPromise = null; // reset the refresh promise before retrying the original request because the new access token has been resolved

        // retry the original request with the new access token
        return axiosInstance(originalRequest); // Retry the original request with the new access token ,  originalRequest is a property of the error object that contains the original request object which is the request that failed and we are calling it because we want to retry the request with the new access token
        //originalRequest contain the access token from the previous request
      } catch (refreshError: any) {
        // if the refresh promise fails, reject the original request
        UserStore.getState().logout();
        return Promise.reject(refreshError); // Reject the original request with the refresh error
      }
    }

    return Promise.reject(error); // If the error response does not have a status code of 401 (Unauthorized), reject the original request
  }
);
