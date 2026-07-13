import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
});

export const config = {
  api: { bodyParser: false },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function verifyToken(authHeader, secret) {
  if (!secret || !authHeader) return false;
  const receivedToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  return receivedToken === secret;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const authHeader = req.headers["authorization"];
    const secret = process.env.SALLA_WEBHOOK_SECRET;
    const isValid = verifyToken(authHeader, secret);

    if (!isValid) {
      console.warn("Webhook: invalid token, rejected.");
      return res.status(401).json({ error: "Invalid token" });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event !== "app.settings.updated") {
      return res.status(200).json({ received: true, ignored: true });
    }

    const merchantId = payload.merchant;
    const settings = payload.data?.settings || {};

    if (!merchantId) {
      return res.status(400).json({ error: "Missing merchant id" });
    }

    const record = {
      number: settings.whatsapp_number || "",
      message: settings.whatsapp_message || "",
    };

    await redis.set(`wa-settings:${merchantId}`, JSON.stringify(record));
    console.log(`✅ Settings saved for merchant ${merchantId}`, record);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
