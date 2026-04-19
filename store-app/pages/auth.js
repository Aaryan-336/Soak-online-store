import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Auth() {
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  function handleGoogleLogin(response) {
    try {
      const credential = response.credential;
      if (!credential) {
        alert("Login failed. Try again.");
        return;
      }
  
      // Save login token
      localStorage.setItem("token", credential);
      localStorage.setItem("onboarded", "true");
  
      // Redirect
      window.location.href = "/profile";
    } catch (err) {
      console.error("Google login error:", err);
      alert("Could not log in.");
    }
  }
  
  // Load Google Button
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
  
    script.onload = () => {
      if (!window.google) return;
  
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
  
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: "100%",
        }
      );
    };
  
    document.body.appendChild(script);
  }, []);
  

  function initializeGoogle() {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }

  // Handle Google login
  async function handleGoogleResponse(resp) {
    try {
      const data = jwt_decode(resp.credential);

      const res = await axios.post(`${API}/auth/google`, {
        name: data.name,
        email: data.email,
      });

      saveUser(res.data);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed.");
    }
  }

  function saveUser(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("soakProfile", JSON.stringify(data.user));
    localStorage.setItem("onboarded", "yes");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "signup") {
        const res = await axios.post(`${API}/auth/signup`, {
          name,
          email,
          phone,
          password,
        });

        // After signup, auto-login:
        const login = await axios.post(`${API}/auth/login`, {
          email,
          password,
        });

        saveUser(login.data);
      } 
      else {
        const login = await axios.post(`${API}/auth/login`, {
          email,
          password,
        });

        saveUser(login.data);
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-soft-cream px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border border-royal-green/10">
        
        {/* Title */}
        <h1 className="font-serifLab text-3xl text-royal-green text-center mb-6">
          Welcome to Soak
        </h1>

        {/* Toggle */}
        <div className="flex justify-center gap-10 mb-6 text-lg font-medium">
          <button
            className={`${mode === "login" ? "text-royal-green underline" : "text-gray-500"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`${mode === "signup" ? "text-royal-green underline" : "text-gray-500"}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === "signup" && (
            <input
              className="w-full border p-3 rounded focus:border-royal-green outline-none"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full border p-3 rounded focus:border-royal-green outline-none"
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode === "signup" && (
            <input
              className="w-full border p-3 rounded focus:border-royal-green outline-none"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}

          <input
            className="w-full border p-3 rounded focus:border-royal-green outline-none"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-royal-green text-white py-3 rounded-full hover:bg-royal-green/90 transition font-medium"
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="mb-4 overflow-hidden rounded-full">
          <div id="googleBtn" className="w-full"></div>
        </div>

        {/* Guest Login */}
        <button
          className="w-full border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition"
          onClick={() => {
            localStorage.setItem("onboarded", "yes");
            router.push("/");
          }}
        >
          Continue as Guest
        </button>

      </div>
    </div>
  );
}
