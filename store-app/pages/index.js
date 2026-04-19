import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import OfferSlider from "../components/OfferSlider";
import ProductCard from "../components/ProductCard"; // if you want to use it

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters & search
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("");

  // Fetch products from backend /products/search
  async function fetchProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (size) params.append("size", size);
      if (sort) params.append("sort", sort);

      const url =
        params.toString().length > 0
          ? `${API}/products/search?${params.toString()}`
          : `${API}/products`; // fallback to all products if no filters

      const res = await axios.get(url);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Refetch whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, size, sort]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Slider */}
        <div className="mb-10">
          <OfferSlider />
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-lg hero-texture p-8 shadow-sm">
          <h1 className="font-serifLab text-5xl text-royal-green leading-tight">
            Old-money classics — reimagined for campus.
          </h1>
          <p className="mt-4 max-w-xl text-gray-700">
            Curated timeless outfits for Gen Z. Elegant, premium, and
            affordable.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#featured"
              className="px-5 py-3 rounded border hover:bg-royal-green/5"
            >
              Shop featured
            </a>
            <a
              href="/about"
              className="px-5 py-3 rounded border hover:bg-rust/5"
            >
              Our story
            </a>
          </div>
        </section>

        {/* SEARCH BAR */}
        <div className="w-full max-w-xl mx-auto mt-8 mb-6">
          <input
            type="text"
            placeholder="Search shirts, trousers, old money fits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:border-royal-green"
          />
        </div>

        {/* FILTERS ROW */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6 text-sm">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-full"
          >
            <option value="">All Categories</option>
            <option value="shirt">Shirts</option>
            <option value="tshirt">T-Shirts</option>
            <option value="trouser">Trousers</option>
            <option value="hoodie">Hoodies</option>
            <option value="old money">Old Money</option>
          </select>

          {/* Size */}
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="px-4 py-2 border rounded-full"
          >
            <option value="">All Sizes</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 border rounded-full px-3 py-2"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 border rounded-full px-3 py-2"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded-full"
          >
            <option value="">Sort</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="latest">Latest</option>
          </select>
        </div>

        {/* Pinterest Masonry Section */}
        <section id="featured" className="mt-8">
          <h2 className="font-serifLab text-2xl mb-4">Featured picks</h2>

          {loading && <div>Loading...</div>}

          {!loading && products.length === 0 && (
            <div className="text-gray-500 text-sm mt-4">
              No products found. Try changing filters.
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="columns-1 md:columns-4 gap-4 space-y-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="break-inside-avoid rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:ring-2 hover:ring-royal-green transition cursor-pointer"
                >
                  <a href={`/products/${p._id}`}>
                    <img
                      src={p.images?.[0] || "/logo.jpg"}
                      className="w-full object-cover rounded-xl"
                    />
                    <div className="p-4">
                      <h3 className="font-serifLab text-lg">{p.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">₹{p.price}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
