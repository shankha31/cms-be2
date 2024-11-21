import NextCors from 'nextjs-cors';
import { getUserProfileFromToken } from "../../../utils/services/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (req, res) => {
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200,
    });
    const { feedbackComments, feedbackRating, submissionRecordId } = req.body;

    if (req.method === 'POST') {
        try {
            // Extract userId from the token
            const { userProfileId } = await getUserProfileFromToken(req);

            // Create a new feedback entry in the database
            const newFeedback = await prisma.feedback.create({
                data: {
                    submissionRecordId: submissionRecordId, // Use new field names
                    evaluatorId: userProfileId,
                    feedbackComments: feedbackComments, // Updated to match new field
                    feedbackRating: feedbackRating, // Updated to match new field
                },
            });

            return res.status(200).json({ success: true, data: newFeedback });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating feedback' });
        }
    } else {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};


