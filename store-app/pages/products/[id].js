import axios from "axios";
import { useState } from "react";
import Layout from "../../components/Layout";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductPage({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  // ----------------------------
  // ADD TO CART
  // ----------------------------
  async function addToCart() {
    if (!size) {
      alert("Please select a size");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const image =
      product.images?.[0] ||
      product.image ||
      product.imageUrl ||
      product.img ||
      null;

    const id = product._id;

    const existing = cart.findIndex(
      (item) => item.id === id && item.size === size
    );

    if (existing >= 0) {
      cart[existing].quantity =
        Number(cart[existing].quantity || 1) + Number(qty || 1);
    } else {
      cart.push({
        id,
        name: product.name,
        price: Number(product.price),
        size,
        quantity: qty,
        image,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdding(true);
    setTimeout(() => setAdding(false), 700);
  }

  // ----------------------------
  // UPLOAD REVIEW PHOTO
  // ----------------------------
  async function handleReviewPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await axios.post(`${API}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReviewPhotos((prev) => [...prev, res.data.url]);
    } catch (err) {
      console.error(err);
      alert("Photo upload failed");
    } finally {
      setUploading(false);
    }
  }

  // ----------------------------
  // SUBMIT REVIEW
  // ----------------------------
  async function submitReview(e) {
    e.preventDefault();

    try {
      await axios.post(`${API}/reviews`, {
        productId: product._id,
        name: name || "Anonymous",
        rating,
        comment: reviewText,
        photos: reviewPhotos,
      });

      // reload reviews
      const res = await axios.get(`${API}/products/${product._id}`);
      setProduct(res.data);

      setRating(0);
      setReviewText("");
      setReviewPhotos([]);
      setName("");
    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    }
  }

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT – IMAGE SLIDER */}
        <div className="space-y-3 w-full">

          {/* Main Swiper */}
          <Swiper
            onSwiper={setMainSwiper}
            modules={[Navigation, Pagination, Thumbs, FreeMode]}
            thumbs={{ swiper: thumbsSwiper }}
            pagination={{ clickable: true }}
            className="rounded-xl overflow-hidden bg-white shadow-sm w-full h-[420px] md:h-[520px]"
          >
            {(product.images?.length > 0 ? product.images : ["/logo.jpg"]).map(
              (img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>

          {/* Thumbnail Swiper */}
          {product.images?.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Thumbs]}
              watchSlidesProgress
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              className="w-full"
            >
              {product.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    className="w-full h-20 object-cover rounded-md border cursor-pointer"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* RIGHT – PRODUCT DETAILS */}
        <div>
          <h1 className="font-serifLab text-3xl">{product.name}</h1>
          <div className="mt-2 text-xl font-semibold">₹{product.price}</div>

          {product.stock < 5 && (
            <p className="text-red-500 text-sm mt-1">
              Only {product.stock} left — selling fast!
            </p>
          )}

          <p className="mt-4 text-gray-700">{product.description}</p>

          {/* Sizes */}
          <div className="mt-6">
            <div className="text-sm mb-2">Size</div>

            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((s) => {
                const left = product.stock?.[s] ?? 0;
                const lowStock = left > 0 && left < 5;

                return (
                  <div key={s}>
                    <button
                      type="button"
                      onClick={() => setSize(s)}
                      disabled={left === 0}
                      className={`
                        px-3 py-1 rounded-full text-sm transition border
                        ${left === 0 ? "opacity-40 cursor-not-allowed" : ""}
                        ${
                          size === s
                            ? "border-royal-green bg-royal-green/10 text-royal-green"
                            : "border-gray-300 hover:border-royal-green"
                        }
                      `}
                    >
                      {s.toUpperCase()}
                    </button>

                    {lowStock && (
                      <p className="text-xs text-red-500 mt-1">
                        Hurry! Only {left} left
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qty */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm">Quantity</span>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 border p-2 rounded"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={addToCart}
            className={`mt-6 px-6 py-3 rounded-full border border-royal-green text-royal-green font-medium w-full
              transition flex items-center justify-center
              ${
                adding
                  ? "bg-royal-green text-white scale-105"
                  : "hover:bg-royal-green hover:text-white"
              }
            `}
          >
            {adding ? "✔ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* ---------- REVIEWS SECTION ---------- */}
      <section className="mt-10 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-serifLab text-2xl mb-4">Reviews</h2>

        {/* Existing reviews */}
        <div className="space-y-3 mb-6">
          {product.reviews?.length === 0 && (
            <div className="text-sm text-gray-500">No reviews yet.</div>
          )}

          {product.reviews?.map((r, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm">{r.name}</div>

                <div className="flex gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx < r.rating ? "text-royal-green" : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-700">{r.comment}</p>

              {/* review images */}
              {r.photos?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {r.photos.map((img, j) => (
                    <img
                      key={j}
                      src={img}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ADD REVIEW FORM */}
        <form onSubmit={submitReview} className="space-y-3">
          <input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full text-sm"
          />

          {/* Rating */}
          <div>
            <div className="text-sm mb-1">Your rating</div>
            <div className="flex gap-1 text-xl">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <span
                    className={i < rating ? "text-royal-green" : "text-gray-300"}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            placeholder="Share your thoughts about the fit, fabric, and vibe..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />

          {/* Upload photo */}
          <label className="px-4 py-2 rounded-full border border-royal-green text-royal-green text-sm cursor-pointer hover:bg-royal-green hover:text-white transition">
            {uploading ? "Uploading..." : "Upload outfit photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleReviewPhoto}
            />
          </label>

          {/* Preview uploaded photos */}
          <div className="flex gap-2">
            {reviewPhotos.map((url) => (
              <img
                key={url}
                src={url}
                className="w-12 h-12 object-cover rounded-md"
              />
            ))}
          </div>

          <button
            type="submit"
            className="px-6 py-2 rounded-full border border-royal-green text-royal-green text-sm hover:bg-royal-green hover:text-white transition"
          >
            Submit review
          </button>
        </form>

      </section>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
    const API =
      process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : process.env.NEXT_PUBLIC_API_URL;
  
    try {
      const res = await fetch(`${API}/products/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
  
      const product = await res.json();
  
      return { props: { product } };
    } catch (err) {
      console.error("SSR fetch error:", err);
      return { notFound: true };
    }
  }
  