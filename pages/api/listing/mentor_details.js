import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set up CORS
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "GET") {
    try {
      console.log("Fetching mentors from database...");

      // Fetch users with role 'mentor'
      const mentors = await prisma.userProfile.findMany({
        where: {
          userRole: "mentor", // Ensure this matches the `UserRole` enum in schema
        },
        include: {
          userExpertise: { 
            include: { 
              expertise: true, // Include expertise details if needed
            }
          },
        },
      });

      console.log("Mentors fetched:", mentors);

      // If no mentors found, return 404
      if (!mentors || mentors.length === 0) {
        console.log("No mentors found.");
        return res.status(404).json({ message: "No mentors found." });
      }

      // Return mentors data
      return res.status(200).json({ mentors });
    } catch (error) {
      console.error("Error fetching mentors:", error);

      // Return 500 with detailed error message
      return res.status(500).json({
        message: "An error occurred while fetching mentors.",
        error: error.message,
      });
    }
  } else {
    console.log(`Method ${req.method} not allowed.`);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
