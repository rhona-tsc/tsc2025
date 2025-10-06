import express from "express";
import { getTravelData } from "../controllers/travelController.js";
import DistanceCache from "../models/distanceCacheModel.js";

// ✅ ADD THIS LINE:
const router = express.Router();

// ✅ Use controller here
router.get("/get-travel-data", getTravelData);

// Travel cache view (optional admin route)
router.get("/travel-cache", async (req, res) => {
  try {
    const cache = await DistanceCache.find().limit(100).sort({ lastUpdated: -1 });
    res.json(cache);
  } catch (err) {
    console.error("❌ Error fetching travel cache:", err);
    res.status(500).json({ error: "Error fetching travel cache" });
  }
});

export default router;