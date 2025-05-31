"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { StockData } from "@/lib/types";

interface StockChartProps {
  stockData: StockData;
}

export default function StockChart({ stockData }: StockChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !Object.keys(stockData).length) return;

    const chart = echarts.init(chartRef.current);
    const series = Object.keys(stockData).map((ticker) => ({
      name: ticker,
      type: "line",
      data: stockData[ticker].map((d: any) => [d.Date, d.Close]),
      smooth: true,
    }));

    const option = {
      title: { text: "Stock Prices" },
      tooltip: { trigger: "axis" },
      legend: { data: Object.keys(stockData) },
      xAxis: { type: "time", boundaryGap: false },
      yAxis: { type: "value", scale: true },
      series,
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [stockData]);

  return <div ref={chartRef} style={{ height: "500px", width: "100%" }} />;
}
