export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Call backend directly (server-to-server, no CORS issues)
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.json(
      { detail: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
