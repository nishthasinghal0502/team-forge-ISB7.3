import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", service: "Vercel Email Relay" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, html } = req.body || {};

    if (!to || !html) {
      return res.status(400).json({ error: "Missing required fields: to, html" });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        success: false,
        error: "SMTP credentials not configured in Vercel environment variables (SMTP_USER, SMTP_PASSWORD)",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Team Forge AI" <${smtpUser}>`,
      to,
      subject: subject || "[Team Forge] Validation Dossier",
      html,
    });

    console.log(`[Vercel Email Relay] Successfully sent email to ${to}: ${info.messageId}`);
    return res.status(200).json({
      success: true,
      message: `Email successfully delivered to ${to}`,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("[Vercel Email Relay] Delivery error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send email via Vercel relay",
    });
  }
}
