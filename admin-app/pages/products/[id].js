import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import AdminLayout from "../../components/AdminLayout";
import ProductForm from "../../components/ProductForm";

const API = process.env.NEXT_PUBLIC_API_URL;
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY;

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url) => axios.get(url).then((r) => r.data);
  const { data: product } = useSWR(id ? `${API}/products/${id}` : null, fetcher);

  async function submit(data) {
    await axios.put(`${API}/products/${id}`, data, {
      headers: { "x-admin-key": KEY }
    });
    alert("Updated!");
    window.location.href = "/products";
  }

  return (
    <AdminLayout>
      <h1 className="font-serifLab text-3xl mb-6">Edit Product</h1>
      {product && <ProductForm initial={product} onSubmit={submit} />}
    </AdminLayout>
  );
}
