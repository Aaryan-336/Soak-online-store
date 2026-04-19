import { useState, useEffect } from "react";

export default function OfferSlider() {
  const slides = [
    {
      id: 1,
      title: "Winter Old-Money Collection",
      subtitle: "Exclusive cable-knit sweaters & royal green jackets.",
      buttonText: "Shop Collection",
      buttonLink: "/",
      bg: "bg-[url('/slider/slide1.jpg')]"
    },
    {
      id: 2,
      title: "Flat 20% OFF on Campus Classics",
      subtitle: "Handpicked essentials for everyday luxury.",
      buttonText: "Grab Offer",
      buttonLink: "/",
      bg: "bg-[url('/slider/slide2.jpg')]"
    },
    {
      id: 3,
      title: "Royal Green Varsity Drop",
      subtitle: "Quiet luxury reimagined for Gen Z.",
      buttonText: "Shop Now",
      buttonLink: "/products",
      bg: "bg-[url('/slider/slide3.jpg')]"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(id);
  }, [current]);

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  return (
    <div className="relative w-full h-[300px] md:h-[380px] overflow-hidden rounded-xl shadow-lg">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out transform 
            ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"} 
            bg-cover bg-center ${slide.bg}`}
        >
          <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center text-center px-6">
            <h2 className="font-serifLab text-3xl md:text-4xl text-white drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="mt-3 text-white/90 max-w-xl font-light">
              {slide.subtitle}
            </p>
            <a
              href={slide.buttonLink}
              className="mt-6 inline-block px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition"
            >
              {slide.buttonText}
            </a>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-md"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-md"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full cursor-pointer transition ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
