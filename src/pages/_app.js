// import { AuthProvider } from "./lib/useAuth";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    // <AuthProvider>
      <Component {...pageProps} />
    // </AuthProvider>
  );
}

export default MyApp;
