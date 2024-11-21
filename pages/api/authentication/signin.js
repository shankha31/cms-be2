import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/services/auth";
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "POST") {
    const { email, password } = req.body;

    // Hash the password (if you want to store a new password)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find user profile by emailAddress
    const item = await prisma.userProfile.findUnique({
      where: { emailAddress: email },  // Update to emailAddress
    });

    if (!item) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare the password with the stored hashed password
    const passwordMatches = await bcrypt.compare(password, item.hashedPassword);  // Update to hashedPassword

    if (passwordMatches) {
      const token = generateToken(email);  // You might still use email for token generation
      return res.status(200).json({
        status: "Success",
        message: "Login successful",
        role: item.userRole,  // Update to userRole
        userProfileId: item.userProfileId,  // Update to userProfileId
        token: token,
      });
    } else {
      return res.status(404).json({ message: "Invalid credentials" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
