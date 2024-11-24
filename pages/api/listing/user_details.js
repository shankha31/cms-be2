import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "GET") {
    try {
      console.log("Fetching users from database...");

      const users = await prisma.userProfile.findMany({
        where: {
          userRole: "user",
        },
        include: {
          userExpertise: { 
            include: { 
              expertise: true, 
            }
          },
        },
      });

      console.log("users fetched:", users);

      // If no users found, return 404
      if (!users || users.length === 0) {
        console.log("No users found.");
        return res.status(404).json({ message: "No users found." });
      }

      // Return users data
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);

      // Return 500 with detailed error message
      return res.status(500).json({
        message: "An error occurred while fetching users.",
        error: error.message,
      });
    }
  } else {
    console.log(`Method ${req.method} not allowed.`);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
