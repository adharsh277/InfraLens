export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // Call backend directly (server-to-server, no CORS issues)
    const res = await fetch(`http://localhost:8000/status/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return Response.json(
      { detail: "Failed to fetch job status" },
      { status: 500 }
    );
  }
}
