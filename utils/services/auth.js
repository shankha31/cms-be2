import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserProfileFromToken = async (req) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('Authorization header is missing');

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) throw new Error('Token is missing');

  try {
    // 2. Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Extract email from the token payload
    const email = decodedToken.email; // Adjust based on your token payload structure
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        emailAddress: email, // Use the new 'emailAddress' field for UserProfile model
      },
    });
    if (!userProfile) throw new Error('User not found in token');

    return userProfile; // return the full userProfile object instead of just userId
  } catch (error) {
    throw new Error(`Token validation failed: ${error.message}`);
  }
};

function generateToken(email) {
  const payload = { email };

  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(payload, secretKey);

  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

module.exports = { verifyToken, generateToken, getUserProfileFromToken };
