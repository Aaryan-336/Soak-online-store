import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="font-serifLab text-3xl mb-4">Admin Dashboard</h1>
      <p className="text-gray-700">Welcome to the Soak Admin Panel.</p>
    </AdminLayout>
  );
}
