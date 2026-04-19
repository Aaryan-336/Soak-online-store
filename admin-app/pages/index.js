import { useState } from "react";

export default function LoginPage() {
  const [key, setKey] = useState("");

  function login(e) {
    e.preventDefault();
    sessionStorage.setItem("adminKey", key);
    window.location.href = "/dashboard";
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={login} className="bg-white p-8 rounded-xl shadow space-y-4 w-80">
        <h1 className="text-xl font-serifLab">Admin Login</h1>
        <input
          placeholder="Enter Admin Key"
          className="input"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button className="px-4 py-2 bg-royal-green text-white rounded w-full">Login</button>
      </form>
    </div>
  );
}
