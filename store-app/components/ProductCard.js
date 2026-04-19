import Link from "next/link";

export default function ProductCard({ p }) {
  const isOut = p.isOutOfStock === true;
  const sizesWithStock = Object.values(p.stock || {});
  const lowStock =
    sizesWithStock.some(q => q > 0 && q < 5) && !isOut;

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-sm group cursor-pointer transition
      ${isOut ? "opacity-40 grayscale" : "hover:shadow-md"}`}
    >
      <Link href={`/products/${p._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={p.images?.[0] || "/logo.jpg"}
            alt={p.name}
            className="w-full h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Category Tag */}
          <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-semibold">
            {p.category || "Classic"}
          </div>

          {/* Low Stock Ribbon */}
          {lowStock && (
            <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 text-[10px] rounded">
              Low Stock
            </div>
          )}

          {/* Out Of Stock Banner */}
          {isOut && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-serifLab text-base mb-1 line-clamp-1">{p.name}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">
            {p.description || ""}
          </p>
          <div className="mt-2 font-semibold">₹{p.price}</div>
        </div>
      </Link>
    </div>
  );
}
