import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import cookie from "cookie"; // Correctly import the 'cookie' package
import axios from "axios";
export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // To prevent flickering

  useEffect(() => {
    // Check if the user is already authenticated using axios
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/admin/check-auth", {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
          // If authenticated, redirect to the dashboard
          toast.info("You are already logged in. Redirecting to the dashboard...", {
            autoClose: 2000,
          });
          router.push("/admin/dashboard");
        } else {
          setCheckingAuth(false); // Allow login form to render if not authenticated
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setCheckingAuth(false); // Allow login form to render if there's an error
      }
    };
    
    checkAuth(); // Call the function to check authentication status

  }, [router]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!", { autoClose: 1000 });
        console.log("Login successful:", data);
        router.push("/admin/dashboard").then(() => {
          router.reload();
        });
      } else {
        toast.error(data.message || "Invalid email or password.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (checkingAuth) {
    // Show a loader or blank screen while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070D19]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-white/90">Verifying credentials...</p>
          <p className="text-sm text-white/60">Please wait while we authenticate your session</p>
        </div>
      </div>    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070D19]">
      <motion.div
        className="mb-8 self-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <img
          src="https://scholarsbox.in/images/Scholars%20Box-Logo-03-footer.png"
          alt="ScholarsBox Logo"
          className="w-48 h-48 object-contain"
        />
      </motion.div>

      <motion.div
        className="w-full max-w-md p-5 -mt-20 bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-green-500"
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-black mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-black"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-black mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-black"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className={`w-full py-4 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 transform hover:-translate-y-1 hover:shadow-xl"
            }`}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </motion.button>
        </form>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
