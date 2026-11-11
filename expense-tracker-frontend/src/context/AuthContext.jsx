
import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import { logoutUser } from "../services/authService";


// Create authentication context
const AuthContext = createContext();


// Authentication provider
export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem("access_token"))
    );


    // Listen for expired JWT responses
    useEffect(() => {

        const handleAuthExpired = () => {
            setIsAuthenticated(false);
        };

        window.addEventListener(
            "auth-expired",
            handleAuthExpired
        );

        return () => {
            window.removeEventListener(
                "auth-expired",
                handleAuthExpired
            );
        };

    }, []);


    // Update authentication after login
    const login = () => {

        setIsAuthenticated(true);

    };


    // Logout
    const logout = () => {

        try {

            logoutUser();

            setIsAuthenticated(false);

        } catch (error) {

            console.error("Logout failed:", error);

        }

    };


    return (

        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


// Custom hook
export const useAuth = () => {

    return useContext(AuthContext);

};
