import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ initial = {}, onSubmit }) {
  const [name, setName] = useState(initial.name || "");
  const [price, setPrice] = useState(initial.price || "");
  const [description, setDescription] = useState(initial.description || "");
  const [category, setCategory] = useState(initial.category || "");

  const [images, setImages] = useState(initial.images || []);
  const [productOutOfStock, setProductOutOfStock] = useState(initial.outOfStock || false);


  // Sizes and Stock
  const [sizes, setSizes] = useState((initial.sizes || []).join(","));
  const [stock, setStock] = useState(initial.stock || {});

  useEffect(() => {
    const sizeList = sizes
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedStock = { ...stock };

    sizeList.forEach((s) => {
      if (updatedStock[s] === undefined) updatedStock[s] = 0;
    });

    Object.keys(updatedStock).forEach((s) => {
      if (!sizeList.includes(s)) delete updatedStock[s];
    });

    setStock(updatedStock);
  }, [sizes]);

  const handleStock = (size, value) => {
    setStock({
      ...stock,
      [size]: Math.max(0, Number(value)),
    });
  };

  // Upload image
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setImages((prev) => [...prev, res.data.url]);
    } catch {
      alert("Upload failed");
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function submit(e) {
    e.preventDefault();
  
    const payload = {
      name,
      price: Number(price),
      description,
      category,
      images,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock,
      outOfStock: productOutOfStock, // NEW
    };
  
    onSubmit(payload);
  }
  
  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-4">

      <input className="input" placeholder="Name"
        value={name} onChange={(e) => setName(e.target.value)} />

      <input className="input" type="number" placeholder="Price"
        value={price} onChange={(e) => setPrice(e.target.value)} />

      <textarea className="input" placeholder="Description"
        value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* ✨ Category returned */}
      <input className="input" placeholder="Category"
        value={category} onChange={(e) => setCategory(e.target.value)} />

      {/* Images */}
      <label className="text-sm mt-3 block">Upload Images</label>
      <input type="file" accept="image/*" onChange={handleFile} />

      <div className="flex gap-3 flex-wrap">
        {images.map((img) => (
          <div key={img} className="relative">
            <img src={img} className="w-24 h-24 rounded-md object-cover" />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-white shadow p-1 rounded-full"
              onClick={() => removeImage(img)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Sizes */}
      <input
        className="input"
        placeholder="Sizes (comma-separated)"
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
      />

      {/* Stock per size */}
      {Object.keys(stock).length > 0 && (
        <div className="space-y-2 mt-2">
          <p className="text-sm font-medium">Stock Available</p>
          {Object.keys(stock).map((s) => (
            <div key={s} className="flex justify-between gap-3">
              <span className="uppercase font-medium">{s}</span>
              <input
                type="number"
                min="0"
                className="border rounded p-1 w-20"
                value={stock[s]}
                onChange={(e) => handleStock(s, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

<div className="flex items-center gap-2 mt-3">
  <input
    type="checkbox"
    checked={productOutOfStock}
    onChange={() => setProductOutOfStock(!productOutOfStock)}
  />
  <label className="text-sm font-medium">Mark entire product Out of Stock</label>
</div>



      <button className="px-4 py-2 bg-royal-green text-white rounded">
        Save Product
      </button>
    </form>
  );
}
