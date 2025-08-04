const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const Signup = async (req, res) => {
  try {
    const { yourname, username, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get User role ID
    const userRole = await prisma.role.findUnique({ where: { roleName: "User" } });
    if (!userRole) {
      return res.status(500).json({ message: "User role not found. Seed roles first." });
    }
    const user = await prisma.user.create({
      data: {
        yourname: yourname, 
        username: username,
        email: email,
        password: hashedPassword,
        agreedToPolicy: true,
        agreedAt: new Date(),
        role_id: userRole.id,
      },
      include: {
        Role: true,
      },
    });

    // Create token
    const accessToken = jwt.sign(
      {
        id: user.id,
        yourname: user.yourname,
        username: user.username,
        email: user.email,
        role: user.Role.roleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Error in sign up:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

module.exports = Signup;
