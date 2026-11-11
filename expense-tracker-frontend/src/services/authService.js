
import api from "./api";


// Register new user
export const registerUser = async (userData) => {

    try {

        const response = await api.post(
            "/auth/register",
            userData
        );

        return response.data;

    } catch (error) {

        console.error("Registration failed:", error);

        throw error;

    }

};


// Login user
export const loginUser = async (loginData) => {

    try {

        const response = await api.post(
            "/auth/login",
            loginData
        );

        const token = response.data.access_token;

        localStorage.setItem("access_token", token);

        return response.data;

    } catch (error) {

        console.error("Login failed:", error);

        throw error;

    }

};


// Logout user
export const logoutUser = () => {

    localStorage.removeItem("access_token");

};
