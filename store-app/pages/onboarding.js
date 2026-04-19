import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import Layout from "../components/Layout";

export default function Onboarding() {
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Load Google Script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google?.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    };
  }, []);

  function handleGoogleResponse(response) {
    try {
      const user = jwt_decode(response.credential);

      const profile = {
        name: user.name,
        email: user.email,
        phone: "",
        provider: "google",
      };

      localStorage.setItem("soakProfile", JSON.stringify(profile));
      localStorage.setItem("onboarded", "yes");

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) return alert("Email is required");

    const profile = {
      name: name || email.split("@")[0],
      email,
      phone,
      provider: "email",
    };

    localStorage.setItem("soakProfile", JSON.stringify(profile));
    localStorage.setItem("onboarded", "yes");

    router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-soft-cream px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 border border-royal-green/10">
        
        <h1 className="font-serifLab text-3xl text-royal-green text-center mb-6">
          Welcome to Soak
        </h1>

        {/* MODE SWITCH */}
        <div className="flex justify-center gap-6 mb-6 text-sm font-medium">
          <button
            className={`${mode === "login" ? "text-royal-green underline" : "text-gray-600"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`${mode === "signup" ? "text-royal-green underline" : "text-gray-600"}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

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
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode === "signup" && (
            <input
              className="w-full border p-3 rounded focus:border-royal-green outline-none"
              type="phone"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="w-full bg-royal-green text-white py-3 rounded-full hover:bg-royal-green/90 transition font-medium"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE SIGN-IN */}
        <div className="mb-4">
        <div
            id="googleBtn"
            className="overflow-hidden rounded-full"
            style={{ width: "100%" }}
        ></div>
        </div>


        {/* GUEST */}
        <button
          onClick={() => {
            localStorage.setItem("onboarded", "yes");
            router.push("/");
          }}
          className="w-full border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
