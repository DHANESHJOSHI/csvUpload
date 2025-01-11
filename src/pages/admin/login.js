import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; // Import the js-cookie package

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check if the user is already logged in (check for JWT token in cookies)
  useEffect(() => {
    const token = Cookies.get('token'); // Check if token exists in cookies
    console.log("Token:", token); // Log the token value
    if (token) {
      router.push('/admin/dashboard'); // If logged in, redirect to dashboard
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send the form data to the API for authentication
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log("Login response:", data); // Log the response
      if (response.ok) {
        toast.success('Login successful!');
        
        // Set the token in cookies with an expiration time (e.g., 1 day)
        console.log("token:", data.token);
        Cookies.set('authToken', data.token, { expires: 1, secure: true, sameSite: 'Strict' });
        
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
}
