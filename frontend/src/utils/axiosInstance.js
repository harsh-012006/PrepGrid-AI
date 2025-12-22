import axios from "axios";
import { BASE_URL } from "./apiPaths";


const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            // Only redirect to landing page if it's a JWT/user auth error (401 from auth endpoints)
            if(error.response.status === 401 && error.config.url.includes('/auth')) {
                window.location.href = "/";
            }
            // For other errors, just log and let the component handle it
            else if(error.response.status === 401){
                console.log("API authentication error. Please check configuration.");
            }
            else if(error.response.status === 500){
                console.log("server error. please try again later.");
            }
        }else if(error.code === "ECONNABORTED"){
            console.log("request timed out. please try again later.");
        }else{
            console.log("network error. please check your internet connection.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
