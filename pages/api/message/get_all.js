import { PrismaClient } from '@prisma/client';
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();


export default async (req, res) => {
    // Enable CORS for the API
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });

    // Handle GET requests to fetch feedbacks
    if (req.method === 'POST') {
        try {

            const user1 = req.body["user1"]; // Extract submissionId from query parameters
            const user2 = req.body["user2"]; // Extract submissionId from query parameters


            const messages = await prisma.messages.findMany({
                where: {
                    OR: [
                        {
                            from_user: user1,
                            to_user: user2
                        },
                        {
                            from_user: user2,
                            to_user: user1
                        }
                    ]
                }
            });

            // Return the feedbacks as JSON
            return res.status(200).json({ messages });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching messages' });
        }
    } else {
        // Handle unsupported methods (only GET is allowed)
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
