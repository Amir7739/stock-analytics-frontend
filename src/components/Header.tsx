"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg border-b border-blue-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm"></div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Stock Analytics
            </h1>
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-6">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/90 text-sm font-medium max-w-32 truncate">
                  {user.email}
                </span>
              </div>

              {/* Mobile User Initial */}
              <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              {/* Login Link */}
              <a
                href="/login"
                className="text-white/90 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
              >
                Login
              </a>

              {/* Sign Up Button */}
              <a
                href="/signup"
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 hover:shadow-lg"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
