import NextCors from 'nextjs-cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const method = req.method;
  const tableName = "submissionRecord";  // Corrected to the SubmissionRecord model

  if (req.method === "GET") {
    const userToken = req.headers.authorization?.split(" ")[1];  // Extract the token

    if (!userToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);  // Verify the token

      const email = decoded.email;
      console.log(decoded);

      // Fetch user from the database using email (make sure this corresponds to your schema)
      const user = await prisma.userProfile.findUnique({
        where: { emailAddress: email },
        include: { userExpertise: { select: { expertiseId: true } } },
      });


      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }


      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }
      const userExpertiseIds = user.userExpertise.map((ue) => ue.expertiseId);
      const userProfileId = user.userProfileId;
      console.log(userProfileId)
      const submission = await prisma.submissionRecord.findMany({
        where: {
          AND: [
            { userProfileId: { not: userProfileId } }, // Exclude submissions by the user
            {
              submissionExpertise: {
                some: {
                  expertiseId: {
                    in: userExpertiseIds, // Match expertise
                  },
                },
              },
            },
          ],
        },
        include: {
          submissionExpertise: { include: { expertise: true } }, // Include expertise details
          userProfile: true, // Include user details for context
        },
      });

      // Return the submissions for peer review
      return res.status(200).json({ submission });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
