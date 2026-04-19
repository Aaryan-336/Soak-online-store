import Link from "next/link";

export default function AdminNavbar({ onLogout }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" className="w-10 h-10 object-contain rounded" />
          <h1 className="font-serifLab text-xl text-royal-green">SOAK Admin</h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-royal-green">Dashboard</Link>
          <Link href="/products" className="hover:text-royal-green">Products</Link>
          <Link href="/products/add" className="hover:text-royal-green">Add Product</Link>
          <Link href="/orders" className="hover:text-royal-green">Orders</Link>
          <button 
            onClick={onLogout} 
            className="px-3 py-1 rounded-md border hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>

      </div>
    </header>
  );
}
