import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import TrackingTimeline from "../components/TrackingTimeline";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user + orders
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth");
      return;
    }

    axios
      .get(`${API}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        router.push("/auth");
      });
  }, []);

  // Save profile changes
  async function saveChanges() {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${API}/user/update`,
        {
          name: user.name,
          phone: user.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  }

  function logout() {
    localStorage.clear();
    router.push("/auth");
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <Layout>
    <div className="max-w-3xl mx-auto p-6">

      {/* Profile Section */}
      <h1 className="font-serifLab text-3xl text-royal-green mb-6">Your Profile</h1>

      <div className="bg-white border border-royal-green/10 shadow p-6 rounded-xl">
        <h2 className="font-serifLab text-xl mb-4">Profile Info</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            onClick={saveChanges}
            className="px-5 py-2 bg-royal-green text-white rounded-full hover:bg-royal-green/90"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <h2 className="font-serifLab text-2xl mt-12 mb-4">Your Orders</h2>

      {orders.length === 0 && (
        <div className="text-gray-500">You have no orders yet.</div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl bg-white p-5 shadow-sm"
            >
              {/* Order Info */}
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Order #{order._id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="font-medium text-lg">₹{order.amount}</div>
              </div>

              {/* Timeline UI */}
              <TrackingTimeline status={order.status} />

              {/* Tracking Link */}
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  className="text-blue-600 underline mt-3 inline-block text-sm"
                >
                  Track Package →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={logout}
        className="mt-10 px-6 py-2 border border-royal-green text-royal-green rounded-full hover:bg-royal-green hover:text-white transition"
      >
        Logout
      </button>
    </div>
    </Layout>
  );
}
