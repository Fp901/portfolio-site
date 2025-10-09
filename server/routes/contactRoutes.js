// server/routes/contactRoutes.js
import express from "express";
import sgMail from "@sendgrid/mail";
import validator from "validator";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// ===================================================
// 🧩 Ensure dotenv is loaded (independent safety check)
// ===================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ===================================================
// 📧 Configure SendGrid (with safety checks)
// ===================================================
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey || !apiKey.startsWith("SG.")) {
  console.error(
    "❌ Invalid or missing SendGrid API key. Check your .env file!"
  );
} else {
  sgMail.setApiKey(apiKey);
  console.log(
    "✅ SendGrid API key loaded successfully (prefix):",
    apiKey.substring(0, 5)
  );
}

// Emails pulled from environment variables
const TO_EMAIL = process.env.TO_EMAIL || "pretoriusf60@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "pretoriusf60@gmail.com"; // must match verified sender

// ===================================================
// 📬 POST /api/contact — Send contact form email
// ===================================================
router.post("/contact", async (req, res) => {
  console.log("📨 Incoming contact request:", req.body);

  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // ✅ Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !message ||
      !validator.isEmail(email) ||
      !validator.isLength(message, { min: 10 }) ||
      !validator.isLength(firstName, { min: 2 }) ||
      !validator.isLength(lastName, { min: 2 })
    ) {
      console.warn("⚠️ Validation failed:", req.body);
      return res.status(400).json({
        success: false,
        message: "Invalid or missing required fields.",
      });
    }

    // ✅ Sanitization
    const cleanFirst = validator.escape(firstName);
    const cleanLast = validator.escape(lastName);
    const cleanEmail = validator.normalizeEmail(email);
    const cleanPhone = phone ? validator.escape(phone) : "N/A";
    const cleanMessage = validator.escape(message);
    const fullName = `${cleanFirst} ${cleanLast}`;

    // ✅ Email Payload
    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New Contact Form Submission from ${fullName}`,
      text: `Name: ${fullName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
Message: ${cleanMessage}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Phone:</strong> ${cleanPhone}</p>
        <p><strong>Message:</strong><br>${cleanMessage}</p>
      `,
    };

    // ✅ Send email
    if (!apiKey || !apiKey.startsWith("SG.")) {
      return res.status(500).json({
        success: false,
        message: "❌ Missing or invalid SendGrid credentials.",
      });
    }

    const [response] = await sgMail.send(msg);
    console.log(
      "✅ SendGrid response:",
      response.statusCode,
      response.headers?.["x-message-id"]
    );

    return res.status(200).json({
      success: true,
      message: "✅ Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error);
    return res.status(500).json({
      success: false,
      message: "❌ Failed to send email. Please try again later.",
    });
  }
});

export default router;
