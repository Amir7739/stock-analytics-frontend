"use client";

import { useState } from "react";
import { getIdToken } from "firebase/auth";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { StockData } from "@/lib/types";

interface StockFormProps {
  setStockData: (data: StockData) => void;
}

export default function StockForm({ setStockData }: StockFormProps) {
  const [tickers, setTickers] = useState("");
  const [period, setPeriod] = useState("1M");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const idToken = await getIdToken(user);
      const payload: any = {
        tickers: tickers.split(",").map((t) => t.trim()),
        period,
      };
      if (period === "CUSTOM") {
        payload.start_date = startDate;
        payload.end_date = endDate;
      }

      const response = await axios.post("/api/stocks/data", payload, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setStockData(response.data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 text-white">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Stock Data Query
              </h2>
              <p className="text-gray-600">
                Analyze stock performance and trends
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Stock Tickers Input */}
          <div className="space-y-2">
            <label
              htmlFor="tickers"
              className="block text-sm font-semibold text-gray-700"
            >
              Stock Tickers (comma-separated)
            </label>
            <div className="relative">
              <input
                type="text"
                id="tickers"
                value={tickers}
                onChange={(e) => setTickers(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                placeholder="e.g., AAPL, MSFT, GOOGL, TSLA"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h3a1 1 0 011 1v2h4a1 1 0 011 1v3a1 1 0 01-1 1h-4v4a1 1 0 01-1 1H8a1 1 0 01-1-1V9H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter stock symbols separated by commas (e.g., AAPL, MSFT, GOOGL)
            </p>
          </div>

          {/* Time Period Selection */}
          <div className="space-y-2">
            <label
              htmlFor="period"
              className="block text-sm font-semibold text-gray-700"
            >
              Time Period
            </label>
            <div className="relative">
              <select
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="1D">📊 1 Day</option>
                <option value="1W">📈 1 Week</option>
                <option value="1M">📉 1 Month</option>
                <option value="3M">📋 3 Months</option>
                <option value="1Y">📊 1 Year</option>
                <option value="YTD">🗓️ Year to Date</option>
                <option value="MTD">📅 Month to Date</option>
                <option value="CUSTOM">⚙️ Custom Range</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-5 h-5 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          {period === "CUSTOM" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-blue-800">
                  Custom Date Range
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 cursor-pointer flex items-center justify-center space-x-2"
            >
              <div className="w-5 h-5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span>Fetch Stock Data</span>
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-4 h-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>Real-time stock data powered by secure API</span>
          </div>
        </div>
      </form>
    </div>
  );
}
