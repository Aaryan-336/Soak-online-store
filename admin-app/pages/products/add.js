import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import ProductForm from "../../components/ProductForm";

const API = process.env.NEXT_PUBLIC_API_URL;
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY;

export default function AddProduct() {
  async function submit(data) {
    await axios.post(`${API}/products`, data, {
      headers: { "x-admin-key": KEY }
    });
    alert("Product added!");
    window.location.href = "/products";
  }

  return (
    <AdminLayout>
      <h1 className="font-serifLab text-3xl mb-6">Add Product</h1>
      <ProductForm onSubmit={submit} />
    </AdminLayout>
  );
}
