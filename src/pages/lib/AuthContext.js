import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to track errors
  const router = useRouter();

  // Check authentication on page load
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      fetchUser(token); // Fetch user data if token exists
    } else {
      setLoading(false); // If no token, finish loading
    }
  }, []);

  // Fetch user details using the token
  const fetchUser = async (token) => {
    try {
      const response = await fetch("/api/auth/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data); // Set user data if token is valid
      } else {
        Cookies.remove("authToken");
        setUser(null); // Remove token and user if unauthorized
        router.push("/login"); // Redirect to login if token is invalid
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      router.push("/login"); // Redirect to login on error
    } finally {
      setLoading(false); // End loading after fetch
    }
  };

  // Login handler
  const login = async (credentials) => {
    setError(null); // Reset error before attempting login
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        Cookies.set("authToken", data.token, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        fetchUser(data.token); // Fetch user info after successful login
        router.push("/dashboard"); // Redirect to dashboard after login
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message); // Set error message to show on the UI
    }
  };

  // Logout handler
  const logout = () => {
    Cookies.remove("authToken"); // Remove auth token
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {/* Show loading or error message if necessary */}
      {!loading ? (
        error ? (
          <div className="text-red-500">{error}</div> // Display error message if there's an error
        ) : (
          children
        )
      ) : (
        <div>Loading...</div>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
