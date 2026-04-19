import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TrackingTimeline from "../../components/TrackingTimeline";
import Layout from "../../components/Layout";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");

    axios
      .get(`${API}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        router.push("/profile");
      });
  }, [id]);

  if (loading) return <Layout>Loading order details...</Layout>;
  if (!order) return <Layout>Order not found.</Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">

        <h1 className="font-serifLab text-3xl text-royal-green mb-6">
          Order Details
        </h1>

        {/* Order Info */}
        <div className="bg-white border border-royal-green/10 shadow p-6 rounded-xl mb-6">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold text-lg">Order #{order._id}</div>
              <div className="text-sm text-gray-500">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="font-semibold text-xl">₹{order.amount}</div>
          </div>

          {/* Timeline */}
          <TrackingTimeline status={order.status} />

          {/* Tracking link */}
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              className="text-blue-600 underline text-sm inline-block mt-4"
            >
              Track this order →
            </a>
          )}
        </div>

        {/* Items */}
        <div className="bg-white border border-royal-green/10 shadow p-6 rounded-xl mb-6">
          <h2 className="font-serifLab text-xl mb-4">Items</h2>

          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    Size: {item.size}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>

                <div className="font-semibold">₹{item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white border border-royal-green/10 shadow p-6 rounded-xl mb-6">
          <h2 className="font-serifLab text-xl mb-4">Shipping Address</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {order.address}
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Phone: {order.phone}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-royal-green/10 shadow p-6 rounded-xl mb-6">
          <h2 className="font-serifLab text-xl mb-4">Payment</h2>
          <div className="text-gray-700">Payment Method: Online (Razorpay)</div>
          <div className="text-gray-700 mt-1">
            Amount Paid: ₹{order.amount}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push("/profile")}
            className="px-5 py-2 border border-gray-400 rounded-full"
          >
            Back to Profile
          </button>

          {/* Reorder */}
          <button
            onClick={() => {
              localStorage.setItem("cart", JSON.stringify(order.items));
              router.push("/cart");
            }}
            className="px-5 py-2 bg-royal-green text-white rounded-full"
          >
            Reorder
          </button>

          {/* Cancel (optional) */}
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <button
              onClick={() => alert("Cancel functionality not added yet")}
              className="px-5 py-2 border border-red-500 text-red-600 rounded-full"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
