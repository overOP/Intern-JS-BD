const crypto = require("crypto");
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

// Generate and hash token
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return { rawToken, hashedToken };
};

// POST /api/user/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const { rawToken, hashedToken } = generateResetToken();

    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      },
    });

    const resetURL = `http://localhost:5173/reset-password/${rawToken}`;

    const message = `
<div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #333;">🔐 Password Reset Request</h2>
    <p style="font-size: 16px; color: #555;">
      We received a request to reset your password. Click the button below to proceed:
    </p>

    <a href="${resetURL}" target="_blank" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
      Reset Password
    </a>

    <p style="font-size: 14px; color: #888;">
      If the button above doesn't work, you can also use the link below:
    </p>

    <p style="word-break: break-all; font-size: 14px; color: #444;">
      <a href="${resetURL}" target="_blank" style="color: #4CAF50;">${resetURL}</a>
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

    <p style="font-size: 12px; color: #aaa;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>
</div>

    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/user/reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password successfully reset." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
