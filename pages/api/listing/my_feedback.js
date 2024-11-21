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

    // Handle POST requests to fetch feedbacks
    if (req.method === 'POST') {
        try {
            const { submissionRecordId } = req.body; // Extract submissionRecordId from the request body
            console.log(submissionRecordId);

            if (!submissionRecordId) {
                return res.status(400).json({ error: 'Submission ID is required' });
            }

            // Fetch feedbacks for the given submissionRecordId and include evaluator (User) data
            const feedbacks = await prisma.feedback.findMany({
                where: {
                    submissionRecordId: parseInt(submissionRecordId), // Use submissionRecordId from schema
                },
                include: {
                    evaluator: true, // Include the evaluator (User) details
                },
            });

            // Return the feedbacks as JSON
            return res.status(200).json({ feedbacks });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching feedbacks' });
        }
    } else {
        // Handle unsupported methods (only POST is allowed)
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
