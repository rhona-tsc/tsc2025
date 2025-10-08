// backend/routes/v2.js
import express from "express";
import { getAvailableActIds } from "../controllers/actAvailabilityController.js";

const router = express.Router();

/**
 * GET /api/v2/availability/acts-by-date?date=YYYY-MM-DD
 * Reuses your existing controller; no legacy aliasing.
 */
router.get("/availability/acts-by-date", async (req, res) => {
  try {
    const date = String(req.query?.date || "").slice(0, 10);
    if (!date) return res.status(400).json({ success: false, message: "date required" });
    req.query.date = date;           // controller expects ?date
    return await getAvailableActIds(req, res);
  } catch (err) {
    console.error("v2 acts-by-date error:", err?.message || err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Optional single-act check:
 * GET /api/v2/availability/check?actId=...&date=YYYY-MM-DD
 */
router.get("/availability/check", async (req, res) => {
  try {
    const actId = String(req.query?.actId || "");
    const date  = String(req.query?.date || "").slice(0, 10);
    if (!actId || !date) return res.status(400).json({ success:false, message:"actId and date required" });

    req.query.date = date;
    const payload = await new Promise((resolve) => {
      const shadowRes = {
        status: (c) => ({ json: (j) => resolve({ code: c, json: j }) }),
        json: (j) => resolve({ code: 200, json: j }),
      };
      getAvailableActIds(req, shadowRes).catch((e) =>
        resolve({ code: 500, json: { success: false, message: e?.message || String(e) } })
      );
    });

    const list = payload?.json?.availableActIds || [];
    return res.json({ success:true, actId, date, isAvailable: list.includes(actId), raw: payload?.json });
  } catch (err) {
    console.error("v2 availability/check error:", err?.message || err);
    return res.status(500).json({ success:false, message:"Server error" });
  }
});

/**
 * GET /api/v2/travel?origin=SL6+8HN&destination=SW1A+1AA&date=YYYY-MM-DD
 * Thin wrapper that calls your existing travel handler, then normalizes.
 */
router.get("/travel-data", async (req, res) => {
  try {
    const origin = String(req.query?.origin || "").trim();
    const destination = String(req.query?.destination || "").trim();
    const date = (String(req.query?.date || "").slice(0,10)) || new Date().toISOString().slice(0,10);
    if (!origin || !destination) {
      return res.status(400).json({ success:false, message:"origin and destination required" });
    }

    const base =
      process.env.INTERNAL_BASE_URL ||
      process.env.BACKEND_PUBLIC_URL ||
      process.env.BACKEND_URL ||
      `http://localhost:${process.env.PORT || 4000}`;

    // ✅ call the new internal travel core endpoint
    const u = new URL("/api/v2/travel-core", base.replace(/\/+$/, ""));
    u.searchParams.set("origin", origin);
    u.searchParams.set("destination", destination);
    u.searchParams.set("date", date);

    const r = await fetch(u.toString(), { headers: { accept: "application/json" } });
    if (!r.ok) {
      console.warn(`⚠️ /v2/travel internal fetch ${r.status} — falling back`);
      return res.status(r.status).json({ success: false, message: `travel ${r.status}` });
    }

    const data = await r.json();
    const firstEl = data?.rows?.[0]?.elements?.[0];
    const outbound =
      data?.outbound ||
      (firstEl?.distance && firstEl?.duration
        ? { distance: firstEl.distance, duration: firstEl.duration, fare: firstEl.fare }
        : null);
    const returnTrip = data?.returnTrip || null;

    return res.json({
      success: true,
      date,
      outbound,
      returnTrip,
      sources: data?.sources || {},
    });
  } catch (err) {
    console.error("v2 travel error:", err?.message || err);
    return res.status(500).json({ success:false, message:"Server error" });
  }
});

export default router;