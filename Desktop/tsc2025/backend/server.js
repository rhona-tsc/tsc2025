import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/connectCloudinary.js';
import cloudinary from './config/cloudinary.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import upload from './middleware/multer.js';
import router from "./routes/debugRoutes.js";
import boardBackfillRoutes from "./routes/boardBackfillRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRouter from './routes/userRoute.js';
import musicianRouter from './routes/musicianRoute.js';
import actV2Routes from './routes/actV2Routes.js';
import travelRouter from './routes/travel.js';
import cartRouter from './routes/cartRoute.js';
import shortlistRoutes from './routes/shortlist.js';
import bookingRoutes from './routes/bookingRoutes.js';
import googleRoutes from './routes/google.js';
import calendarWebhook from './routes/calendarWebhook.js';
import aiRouter from './routes/aiRoute.js';
import authRoutes from './routes/authRoutes.js';
import moderationRoutes from "./routes/moderationRoutes.js";
import userRoute from './routes/userRoute.js';
import debugRoutes from "./routes/debug.js";
import { watchCalendar } from './controllers/googleController.js';
import musicianLoginRouter from './routes/musicianLoginRoute.js';
import allocationRoutes from "./routes/allocationRoutes.js";
import availabilityRoutes from './routes/availability.js';
import cartRoute from './routes/cartRoute.js';
import paymentsRouter from "./routes/payments.js";
import musicianRoutes from "./routes/musicianRoute.js";
import accountRouter from './routes/accountRoute.js';
import voiceIvr from "./routes/voiceIvr.js";
import bookingBoardRoutes from "./routes/bookingBoardRoutes.js";
import { startRemindersPoller } from "./services/remindersQueue.js";
import uploadRoutes from "./routes/upload.js";
import notificationsRoutes from "./routes/notifications.js";
import { WA_FALLBACK_CACHE, sendSMSMessage } from './utils/twilioClient.js';
import availabilityV2Routes from "./routes/availabilityV2.js";
import { twilioInboundV2, twilioStatusV2 } from './controllers/availabilityControllerV2.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

// ✅ NEW: acts-available endpoint (client fetches /api/availability/acts-available?date=YYYY-MM-DD)
import { getAvailableActIds } from './controllers/actAvailabilityController.js';

// ✅ NEW imports
import mongoose from "mongoose";
import musicianModel from "./models/musicianModel.js";
import { submitActSubmission } from './controllers/actSubmissionController.js';

const app = express();
const port = process.env.PORT || 4000;

// DB + Cloudinary Setup
connectDB();
connectCloudinary();
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_SECRET_KEY,
});

// -------------------- ✅ CORS CONFIG --------------------
const allowed = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://tsc2025.netlify.app',
  'https://www.thesupremecollective.co.uk',
  'https://tsc2025-admin-portal.netlify.app',
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`❌ CORS blocked origin: ${origin}`));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','token'],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Ensure every actual response also includes CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowed.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, token");
  }
  res.header("Vary", "Origin");
  next();
});

// ✅ Handle preflight
app.options('*', cors(corsOptions));
// ---------------------------------------------------------


// Ensure caches vary by Origin for CORS
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

// Make sure preflight doesn’t get blocked
app.options('*', cors(corsOptions));

// Twilio webhook test endpoint
app.post(
  "/api/shortlist/wh",
  express.urlencoded({ extended: false }),
  (req, res) => {
    console.log("✅ Twilio inbound webhook hit /wh", {
      keys: Object.keys(req.body || {}),
      from: req.body?.From,
      to: req.body?.To,
      bodyPreview: String(req.body?.Body || "").slice(0, 160),
    });
    res.sendStatus(200);
  }
);

// Twilio generic status (kept for backwards compat)
app.post("/api/shortlist/twilio/status", async (req, res) => {
  try {
    const sid    = req.body?.MessageSid || req.body?.SmsSid || req.body?.Sid;
    const status = (req.body?.MessageStatus || req.body?.Status || "").toLowerCase();
    const code   = String(req.body?.ErrorCode ?? "");
    const to     = String(req.body?.To || "");
    const from   = String(req.body?.From || "");
    console.log("📡 Twilio status:", { sid, status, to, from, err: code || null });

    const isBad = status === "undelivered" || status === "failed";
    if (sid && isBad && WA_FALLBACK_CACHE.has(sid)) {
      const cached = WA_FALLBACK_CACHE.get(sid);
      if (cached?.to && cached?.smsBody) {
        try {
          await sendSMSMessage(cached.to, cached.smsBody);
          console.log("📨 Fallback SMS sent from status webhook", { to: cached.to, forSid: sid, code });
          WA_FALLBACK_CACHE.delete(sid);
        } catch (e) {
          console.warn("❌ SMS fallback failed", { to: cached.to, err: e?.message || e });
        }
      }
    }
  } catch (e) {
    console.warn("⚠️ status webhook error:", e?.message || e);
  } finally {
    res.sendStatus(200);
  }
});

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Request logging
app.use((req, res, next) => {
  req._rid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const hasBearer = typeof req.headers.authorization === 'string' && req.headers.authorization.toLowerCase().startsWith('bearer ');
  console.log(`🔍 [${req._rid}] ${req.method} ${req.url}`);
  console.log(`   ↳ auth: ${hasBearer ? 'Bearer present' : (req.headers.token ? 'legacy token header present' : 'no token header')}, origin: ${req.headers.origin || 'n/a'}`);
  next();
});
startRemindersPoller({ intervalMs: 30000 }); // every 30s

// --------- ROUTES ---------
app.use('/api/user', userRouter);
app.use("/api", userRoute);
app.use('/api/acts', userRouter);

app.use('/api/musician-login', musicianLoginRouter);
app.use('/api/musician', musicianRouter);
app.use('/api/musician/act-v2', actV2Routes);

app.use('/api/travel', travelRouter);
app.use('/api/cart', cartRouter);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/booking', bookingRoutes);

app.use('/api/google', googleRoutes);
app.use('/api/calendar', calendarWebhook);

app.use('/api/ai', aiRouter);
app.use('/api/auth', authRoutes);
app.use("/api/moderation", moderationRoutes);

app.use('/api/act', userRoute);
app.use('/api/musician/trash-act', actV2Routes);
app.use('/api', actV2Routes);
app.use('/api/shortlist', shortlistRoutes);

app.use('/api/musician/account', accountRouter);
app.use('/api/account', accountRouter);

app.use("/voice", voiceIvr);
app.use("/api/board/bookings", bookingBoardRoutes);
app.use('/api', newsletterRoutes);
app.use("/debug", debugRoutes);
app.use("/api", boardBackfillRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use('/api/act-submission', submitActSubmission)
// ✅ V2 availability queue endpoints
app.use("/api/availability-v2", availabilityV2Routes);

// ✅ Mount legacy availability routes
app.use('/api/availability', availabilityRoutes);

// ✅ Direct mount
app.get("/api/availability/acts-available", async (req, res) => {
  const date = String(req.query?.date || "").slice(0, 10);
  console.log("🗓️  GET /api/availability/acts-available", { date });
  try {
    const result = await getAvailableActIds(req, res);
    return result;
  } catch (err) {
    console.error("❌ acts-available failed:", err?.message || err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Alias for legacy/alternate client: /api/availability/acts-by-date?date=YYYY-MM-DD
app.get("/api/availability/acts-by-date", async (req, res) => {
  const date = String(req.query?.date || "").slice(0, 10);
  console.log("🗓️  GET /api/availability/acts-by-date (alias to acts-available)", { date });
  try {
    return await getAvailableActIds(req, res);
  } catch (err) {
    console.error("❌ acts-by-date failed:", err?.message || err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Temporary aliases so existing Twilio config /api/shortlist/twilio/inboundV2 works
app.post(
  "/api/shortlist/twilio/inboundV2",
  express.urlencoded({ extended: false }),
  (req, res) => {
    console.log("✅ Twilio inbound alias hit /api/shortlist/twilio/inboundV2", {
      from: req.body?.From,
      waId: req.body?.WaId,
      body: String(req.body?.Body || "").slice(0, 140)
    });
    return twilioInboundV2(req, res);
  }
);

app.post(
  "/api/shortlist/twilio/status",
  express.urlencoded({ extended: false }),
  (req, res) => {
    console.log("✅ Twilio status alias hit /api/shortlist/twilio/status");
    return twilioStatusV2(req, res);
  }
);

// Health check
app.get('/', (req, res) => {
  res.send("✅ API Working");
});
app.use("/api/debug", debugRoutes);

// Google calendar webhook setup
app.get('/api/google/watch', async (req, res) => {
  try {
    await watchCalendar();
    res.send('📡 Calendar webhook registered');
  } catch (err) {
    console.error('❌ Failed to register calendar watch:', err);
    res.status(500).send('Watch registration failed');
  }
});

app.use("/api/allocations", allocationRoutes);
app.use("/api/payments", paymentsRouter);
app.get("/debug/musician-id?email=shamyra@thesupremecollective.co.uk", router);

// Upload & musician routes (dup kept for compat)
app.use("/api/musician", musicianRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));