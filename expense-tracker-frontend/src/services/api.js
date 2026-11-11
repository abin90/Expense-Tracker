
import axios from "axios";


// Create reusable Axios instance
const api = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }

});


// Request interceptor
// Automatically attach JWT token to requests
api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("access_token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        console.error("Request error:", error);

        return Promise.reject(error);

    }

);


// Response interceptor
// Handle expired or invalid tokens
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("access_token");

            window.dispatchEvent(
                new Event("auth-expired")
            );

        }

        return Promise.reject(error);

    }

);


export default api;
