import { NextResponse } from "next/server";

function getStrapiUrl() {
  return (process.env.STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const safePath = path.map(encodeURIComponent).join("/");
  const response = await fetch(`${getStrapiUrl()}/uploads/${safePath}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: "Media introuvable" }, { status: response.status });
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
