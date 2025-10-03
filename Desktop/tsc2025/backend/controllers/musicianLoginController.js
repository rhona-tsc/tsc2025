import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import musicianModel from "../models/musicianModel.js";

const createToken = (user) => {
  // ⚠️ Do NOT include password (or other sensitive data) in JWT
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const loginMusician = async (req, res) => {
  try {
    const rawEmail = (req.body?.email || "").trim();
    const password = req.body?.password || "";

    console.log("🔐 Incoming login request:", { email: rawEmail });

    if (!rawEmail || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const email = rawEmail.toLowerCase();

    // If your schema has password with select:false, this makes sure it's included:
    const user = await musicianModel.findOne({ email }).select("+password");

    if (!user || !user.password) {
      // No user or no stored hash → treat as invalid creds
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // If you really need the special-case agent override, don't mutate the doc:
    const effectiveRole =
      user.email === "hello@thesupremecollective.co.uk" ? "agent" : user.role;

    const token = createToken({
      _id: user._id,
      email: user.email,
      role: effectiveRole,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });

    return res.json({
      success: true,
      token,
      email: user.email,
      role: effectiveRole,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      userId: user._id,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

// Musician registration
const registerMusician = async (req, res) => {
  try {
    const firstName = (req.body?.firstName || "").trim();
    const lastName = (req.body?.lastName || "").trim();
    const phone = (req.body?.phone || "").trim();
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }
    if (phone.length < 11) {
      return res.json({
        success: false,
        message: "Phone number must be at least 11 characters",
      });
    }

    const exists = await musicianModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMusician = new musicianModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      // role: "musician", // uncomment if you want to force default role here
    });

    const user = await newMusician.save();

    const token = createToken(user);
    return res.json({
      success: true,
      token,
      email: user.email,
      role: user.role,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      userId: user._id,
      message: "Registration successful",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export { loginMusician, registerMusician };