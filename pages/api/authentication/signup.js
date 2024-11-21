import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  console.log(req.body);

  if (req.method === "POST") {
    const { firstName, lastName, email, password, userRole, description, expertise } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new userProfile
    const user = await prisma.userProfile.create({
      data: {
        firstName,
        lastName,
        emailAddress: email,  // Change to emailAddress
        hashedPassword,       // Change to hashedPassword
        userRole: userRole,       // Change to userRole
      },
    });

    return res.status(201).json({ message: "Registration Successful" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
