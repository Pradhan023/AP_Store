import axios from "axios";

const axiosInstance = axios.create({ // create axios instance , create is a function of axios which is used to create axios instance and return axios instance
    baseURL: import.meta.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "/api", // import.meta is a special object provided by Vite that allows you to access metadata about the current environment, such as the mode in which the application is running (development or production). 
    // , in case of false it will be /api of whatever environment it is running on i.e development or production
    withCredentials: true, // send cookies with requests 
});

export default axiosInstance