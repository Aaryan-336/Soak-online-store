import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  function logout() {
    sessionStorage.removeItem("adminKey");
    window.location.href = "/";
  }

  return (
    <>
      <AdminNavbar onLogout={logout} />
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </>
  );
}
