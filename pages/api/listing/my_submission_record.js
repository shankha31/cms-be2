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
    const tableName = "submissionRecord";

    if (req.method === "GET") {
        // Extract the token from the Authorization header
        const userToken = req.headers.authorization?.split(" ")[1];

        if (!userToken) {
            return res.status(400).json({ error: 'Participant token is required in authorization header' });
        }

        try {
            // Decode the JWT token to verify and extract user information
            const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

            const email = decoded.email;
            console.log(decoded);

            // Fetch the user from the database using email
            const user = await prisma.userProfile.findUnique({
                where: { emailAddress: email }, // Assuming 'emailAddress' is used in the UserProfile model
            });

            if (!user) {
                return res.status(404).json({ error: "Participant not found" });
            }

            // Get the user's ID
            const userId = user.userProfileId; // Assuming 'userProfileId' is the field name

            console.log(userId);

            // Fetch the submissions related to the user
            const submissions = await prisma.submissionRecord.findMany({
                where: {
                    userProfileId: userId, // Query submissions by userProfileId
                },
            });

            // Return the submissions
            return res.status(200).json(submissions);

        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Invalid user token or authentication failed' });
        }
    }

    // Handle unsupported methods (only GET is allowed here)
    return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
