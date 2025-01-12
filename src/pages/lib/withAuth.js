import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const withAuth = (Component) => {
  return (props) => {
    const { user, loading, error } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div>Loading...</div>; // Show loading while waiting for auth state
    }

    if (error) {
      return <div className="text-red-500">{error}</div>; // Show error message if authentication fails
    }

    return <Component {...props} />;
  };
};
