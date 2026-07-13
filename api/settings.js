import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const storeId = req.query.store;
  if (!storeId) {
    return res.status(400).json({ error: "Missing store parameter" });
  }

  try {
    const raw = await redis.get(`wa-settings:${storeId}`);
    if (!raw) {
      return res.status(200).json({ number: "", message: "" });
    }
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return res.status(200).json(data);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
