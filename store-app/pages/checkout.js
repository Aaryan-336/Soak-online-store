import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [amount, setAmount] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  // Load Razorpay + Prefill from onboarding
  useEffect(() => {
    // Load Razorpay script
    const id = "razorpay-js";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }

    // Load cart
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
    let total = 0;

    c.forEach((item) => {
    const qty = Number(item.quantity || item.qty || 1);
    const price = Number(item.price || 0);
    total += price * qty;
    });

    setAmount(total);


    // Load onboarding profile
    const profileRaw = localStorage.getItem("soakProfile");
    if (profileRaw) {
      const profile = JSON.parse(profileRaw);
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
    }
  }, []);

  async function handlePayment() {
    if (!name || !email || !phone || !address) {
      alert("Please fill in all details.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create order on backend
      const res = await axios.post(`${API}/orders/create`, {
        items: cart,
        name,
        email,
        phone,
        address,
        amount,
      });

      const order = res.data;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: order.key, // Razorpay key ID from backend
        amount: order.amount,
        currency: "INR",
        name: "SOAK Clothing",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // 3️⃣ Verify payment
          await axios.post(`${API}/orders/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order.dbOrderId,
          });

          // Clear cart + redirect
          localStorage.removeItem("cart");
          alert("Payment successful! Thank you for shopping with SOAK.");
          window.location.href = "/orders/success";
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: "#0f3d13",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <h1 className="font-serifLab text-3xl mb-6">Checkout</h1>

       
        {/* CART SUMMARY */}
<div className="mb-6">
  <h2 className="font-serifLab text-xl mb-3">Order Summary</h2>

  {cart.length === 0 && (
    <div className="text-gray-500 text-sm">Your cart is empty.</div>
  )}

  <div className="space-y-4">
    {cart.map((item, i) => {
      const qty = Number(item.qty || item.quantity || 1);
      const price = Number(item.price || 0);
      const total = price * qty;

      return (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-3"
        >
          {/* LEFT: Image + info */}
          <div className="flex items-center gap-4">
            <img
              src={item.image || item.images?.[0] || "/logo.jpg"}
              className="w-16 h-16 rounded-lg object-cover border"
              alt={item.name}
            />

            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">
                Size: {item.size} • Qty: {qty}
              </div>
            </div>
          </div>

          {/* RIGHT: Price */}
          <div className="font-semibold">₹{total}</div>
        </div>
      );
    })}
  </div>

  {/* TOTAL */}
  <div className="mt-4 text-right text-xl font-semibold">
    Total: ₹{amount}
  </div>
</div>



        {/* USER DETAILS */}
        <h2 className="font-serifLab text-xl mb-2">Your Details</h2>
        <div className="space-y-3 mb-6">
          <input
            value={name}
            required
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            value={email}
            required
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            value={phone}
            required
            placeholder="Phone number"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ADDRESS */}
        <h2 className="font-serifLab text-xl mb-2">Delivery Address</h2>
        <textarea
          value={address}
          required
          placeholder="Enter complete address with pincode"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded h-24"
        />

        {/* PAY BUTTON */}
        <div className="mt-6">
          <button
            disabled={loading}
            onClick={handlePayment}
            className="px-6 py-3 rounded-full border border-royal-green text-royal-green
              hover:bg-royal-green hover:text-white transition w-full font-medium"
          >
            {loading ? "Processing..." : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </Layout>
  );
}
