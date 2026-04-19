import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="max-w-6xl mx-auto flex items-center justify-between py-6 px-4">
      <div className="flex items-center gap-4">
        <Link href="/"><img src="/logo.jpg" alt="logo" className="w-16 h-16 object-contain rounded" /></Link>
        <Link href="/" className="font-serifLab text-2xl text-royal-green">Soak</Link>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/" className="hover:text-royal-green">Store</Link>
        <Link href="/about" className="hover:text-royal-green">About</Link>
        <Link href="/cart" className="hover:text-royal-green">Cart</Link>
        <a href="/profile" className="text-sm hover:text-royal-green">Profile</a>

      </div>
    </nav>
  )
}
