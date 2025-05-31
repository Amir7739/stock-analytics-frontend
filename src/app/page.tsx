"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StockChart from "@/components/StockChart";
import StockForm from "@/components/StockForm";
import { auth, db } from "@/lib/firebase";
import { StockData } from "@/lib/types";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stockData, setStockData] = useState<StockData>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await setDoc(
          doc(db, "users", user.uid),
          { email: user.email, lastLogin: new Date() },
          { merge: true }
        );
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Stock Analytics Dashboard
      </h1>
      <StockForm setStockData={setStockData} />
      <StockChart stockData={stockData} />
    </div>
  );
}
