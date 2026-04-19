import useSWR from "swr";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductList() {
  const fetcher = (url) => axios.get(url).then((r) => r.data);
  const { data: products, mutate } = useSWR(`${API}/products`, fetcher);

  // Store local stock edits
  const [localStock, setLocalStock] = useState({});

  function handleStockChange(id, val) {
    setLocalStock((prev) => ({
      ...prev,
      [id]: val
    }));
  }

  // -------------------------
  // UPDATE STOCK (Manual button)
  // -------------------------
  async function updateStock(id) {
    const stockValue = Number(localStock[id]);

    if (isNaN(stockValue) || stockValue < 0) {
      alert("Enter a valid stock number.");
      return;
    }

    try {
      await axios.put(`${API}/products/${id}`, { stock: stockValue });
      alert("Stock updated successfully!");
      mutate(); // Refresh product list
    } catch (err) {
      console.error(err);
      alert("Stock update failed!");
    }
  }

  // -------------------------
  // DELETE PRODUCT
  // -------------------------
  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API}/products/${id}`);
      mutate(); // Refresh
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-serifLab text-3xl mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={p.images?.[0] || "/placeholder.png"}
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Name & Price */}
            <div className="mt-3">
              <h2 className="font-serifLab text-xl">{p.name}</h2>
              <p className="text-gray-600 text-sm">₹{p.price}</p>

              {p.stock < 5 && (
                <p className="text-red-500 text-xs mt-1">
                  Only {p.stock} left!
                </p>
              )}
            </div>

            {/* STOCK INPUT */}
            <div className="mt-3">
              <label className="text-sm text-gray-700">Stock:</label>

              <input
                type="number"
                className="border p-2 rounded w-24 ml-2"
                value={localStock[p._id] ?? p.stock}
                onChange={(e) => handleStockChange(p._id, e.target.value)}
              />
            </div>

            {/* UPDATE STOCK BUTTON */}
            <button
              onClick={() => updateStock(p._id)}
              className="mt-3 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Update Stock
            </button>

            {/* EDIT + DELETE */}
            <div className="flex justify-between items-center mt-4">
              <a
                href={`/products/${p._id}`}
                className="px-3 py-2 bg-royal-green text-white rounded text-sm"
              >
                Edit
              </a>

              <button
                onClick={() => deleteProduct(p._id)}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
