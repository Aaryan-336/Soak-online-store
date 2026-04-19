import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");

    // Aggregate repeated products into one line item
    const aggregated = [];

    raw.forEach((item) => {
      const key = `${item.id}-${item.size}`;
      const existingIndex = aggregated.findIndex((x) => x._key === key);

      if (existingIndex !== -1) {
        aggregated[existingIndex].quantity += Number(item.quantity || 1);
      } else {
        aggregated.push({
          ...item,
          quantity: Number(item.quantity) || 1,
          _key: key,
        });
      }
    });

    setCart(aggregated);
  }, []);

  // Sync updated cart to localStorage (remove _key)
  useEffect(() => {
    const cleaned = cart.map(({ _key, ...rest }) => rest);
    localStorage.setItem("cart", JSON.stringify(cleaned));
  }, [cart]);

  function removeItem(index) {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  }

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price);
    const qty = Number(item.quantity);
    return sum + price * qty;
  }, 0);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="font-serifLab text-3xl text-royal-green mb-6">Your Cart</h1>

        {cart.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            Your cart is empty.
          </div>
        )}

        <div className="space-y-5">
          {cart.map((item, index) => {
            const img =
              item.image ||
              item.imageUrl ||
              item.img ||
              item.photo ||
              (item.images && item.images[0]?.url) ||
              (item.images && item.images[0]) ||
              null;

            const total = item.price * item.quantity;

            return (
              <div
                key={item._key}
                className="bg-white shadow-md border border-gray-200 rounded-xl p-5"
              >
                <div className="flex gap-5">
                  {img ? (
                    <img
                      src={img}
                      className="w-28 h-28 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="text-gray-500 text-sm">Size: {item.size}</div>
                    <div className="text-gray-700 font-medium mt-1">
                      ₹{item.price}
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="mt-3 text-red-600 border border-red-400 px-4 py-1 rounded-full hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="px-3 py-1 border border-royal-green text-royal-green rounded-full">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="font-semibold text-lg text-royal-green">
                    ₹{total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mt-8">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-royal-green text-white py-3 rounded-full text-lg hover:bg-royal-green/90"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
