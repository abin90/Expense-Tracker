
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

import Sidebar from "./components/Sidebar";


import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Expenses from "./pages/Expenses";

import NotFound from "./pages/NotFound";


function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar whenever the user changes pages
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-layout">

      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={sidebarOpen}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Dark overlay on mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="app-main">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </main>

    </div>
  );
}


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/* Public routes */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* Protected routes */}

                    <Route
                        path="/dashboard"
                        element={

                            <ProtectedRoute>

                                <AppLayout>

                                    <Dashboard />

                                </AppLayout>

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/expenses"
                        element={

                            <ProtectedRoute>

                                <AppLayout>

                                    <Expenses />

                                </AppLayout>

                            </ProtectedRoute>

                        }
                    />


                    {/* Default route */}

                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />


                    {/* 404 route */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />


                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );

}


export default App;
