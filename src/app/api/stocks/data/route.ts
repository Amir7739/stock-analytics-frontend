import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Parse JSON from the incoming request body
    const { tickers, period, start_date, end_date } = await request.json();

    // Extract the Authorization header (expecting Bearer token)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    // Call your FastAPI backend with the token in the Authorization header
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/data`,
      { tickers, period, start_date, end_date },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return data from FastAPI
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Return error message and 500 status if something fails
    return NextResponse.json(
      { error: error.response?.data?.detail || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
