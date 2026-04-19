import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/tailwind.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onboarded = localStorage.getItem("onboarded");

    if (!onboarded && router.pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [mounted, router.pathname]);

  if (!mounted) {
    // IMPORTANT: render skeleton instead of null
    return <div className="min-h-screen bg-white" />;
  }

  return <Component {...pageProps} />;
}
