const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const Signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required.' });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    // Compare password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: pw, ...userWithoutPassword } = user;

    res.json({
      message: 'Signin successful',
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error in signin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = Signin;
