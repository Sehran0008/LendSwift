
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const TOKEN_LIFETIME = 8 * 60 * 60; // 8 hours

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// ---------------- ADMIN AUTHENTICATION ----------------

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "";

function safeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));

  if (first.length !== second.length) return false;

  return crypto.timingSafeEqual(first, second);
}

function createPasswordHash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function createToken() {
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const signature = crypto
    .createHmac("sha256", ADMIN_TOKEN_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token || !ADMIN_TOKEN_SECRET) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_TOKEN_SECRET)
    .update(data)
    .digest("base64url");

  if (!safeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    );

    return (
      payload.role === "admin" &&
      Number.isFinite(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  console.log("Authorization header received:", Boolean(match));
  console.log("Token verified:", match ? verifyToken(match[1]) : false);

  if (!match || !verifyToken(match[1])) {
    return res.status(401).json({
      message: "Please log in as admin to continue.",
    });
  }

  next();
}

// Admin login
app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !ADMIN_TOKEN_SECRET) {
    return res.status(503).json({
      message: "Admin login is not configured. Check backend .env.",
    });
  }

  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Please enter email and password.",
    });
  }

  const separator = ADMIN_PASSWORD_HASH.indexOf(":");

  if (separator < 1) {
    return res.status(500).json({
      message: "Admin password hash configuration is invalid.",
    });
  }

  const salt = ADMIN_PASSWORD_HASH.slice(0, separator);
  const storedHash = ADMIN_PASSWORD_HASH.slice(separator + 1);

  let enteredHash;

  try {
    enteredHash = createPasswordHash(password, salt);
  } catch {
    return res.status(500).json({
      message: "Could not verify admin password.",
    });
  }

  const validEmail = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL);
  const validPassword = safeEqual(enteredHash, storedHash);

  if (!validEmail || !validPassword) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  return res.json({
    message: "Login successful.",
    token: createToken(),
    expiresIn: TOKEN_LIFETIME,
  });
});

// ---------------- GENERAL ROUTES ----------------

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "LendSwift Backend is running successfully!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is working",
  });
});

// ---------------- APPLICATION MODEL ----------------

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

// 1. Submit loan application (public route)
app.post("/api/applications", async (req, res) => {
  try {
    const { name, email, type, amount, tenure } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof type !== "string" ||
      !type.trim() ||
      amount === "" ||
      amount === null ||
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 50000 ||
      tenure === "" ||
      tenure === null ||
      tenure === undefined ||
      !Number.isFinite(Number(tenure)) ||
      Number(tenure) <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid application details.",
      });
    }

    const application = await Application.create({
      name: name.trim(),
      email: email.trim(),
      type: type.trim(),
      amount: Number(amount),
      tenure: Number(tenure),
    });

    return res.status(201).json({
      message: "Application saved successfully!",
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        type: application.type,
        amount: application.amount,
        tenure: application.tenure,
        status: application.status,
        submittedAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Application save failed:", error.message);
    return res.status(500).json({
      message: "Could not save the application.",
    });
  }
});

// 2. Get all applications (admin only)
app.get("/api/applications", requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json(
      applications.map((a) => ({
        id: a._id,
        name: a.name,
        email: a.email,
        type: a.type,
        amount: a.amount,
        tenure: a.tenure,
        status: a.status,
        submittedAt: a.createdAt,
      }))
    );
  } catch (error) {
    console.error("Fetch applications failed:", error.message);
    return res.status(500).json({
      message: "Could not fetch applications.",
    });
  }
});

// 3. Update status (admin only)
app.patch(
  "/api/applications/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body || {};
      const allowedStatuses = ["Pending", "Approved", "Rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Use Pending, Approved, or Rejected.",
        });
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid application ID.",
        });
      }

      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      ).lean();

      if (!application) {
        return res.status(404).json({
          message: "Application not found.",
        });
      }

      return res.json({
        message: "Application status updated successfully.",
        application: {
          id: application._id,
          name: application.name,
          email: application.email,
          type: application.type,
          amount: application.amount,
          tenure: application.tenure,
          status: application.status,
          submittedAt: application.createdAt,
        },
      });
    } catch (error) {
      console.error("Status update failed:", error.message);
      return res.status(500).json({
        message: "Could not update application status.",
      });
    }
  }
);

// 4. Delete application (admin only)
app.delete(
  "/api/applications/:id",
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid application ID.",
        });
      }

      const application = await Application.findByIdAndDelete(
        req.params.id
      );

      if (!application) {
        return res.status(404).json({
          message: "Application not found.",
        });
      }

      return res.json({
        message: "Application deleted successfully.",
        id: application._id,
      });
    } catch (error) {
      console.error("Application delete failed:", error.message);
      return res.status(500).json({
        message: "Could not delete application.",
      });
    }
  }
);

// ---------------- START SERVER ----------------

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing from backend .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `LendSwift backend running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
