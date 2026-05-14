import type { NextApiRequest, NextApiResponse } from "next";

type ExternalApiResponse = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

const DEFAULT_API_URL = "https://jsonplaceholder.typicode.com/posts/1";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExternalApiResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiUrl = process.env.EXTERNAL_API_URL || DEFAULT_API_URL;
  const apiKey = process.env.EXTERNAL_API_KEY;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: typeof data === "string" ? data : "External API request failed",
      });
    }

    return res.status(200).json({ ok: true, data });
  } catch {
    return res.status(500).json({ ok: false, error: "External API unavailable" });
  }
}
