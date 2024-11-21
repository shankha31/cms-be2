import NextCors from 'nextjs-cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const tableName = "eventEnrollment"; // Ensure this matches your updated model if changed
  const method = req.method;

  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // for legacy browser support
  });

  if (method === 'POST') {
    const { eventDetailId } = req.body;
    const userToken = req.headers.authorization?.split(" ")[1];

    if (!eventDetailId || !userToken) {
      return res.status(400).json({ error: 'Event ID and Participant Token are required' });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      const user = await prisma.userProfile.findUnique({
        where: { emailAddress: email },  // Adjusted for the new model name
      });

      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const userId = user.userProfileId;  // Adjusted to match new field name

      const enrollments = await prisma.eventEnrollment.findMany({
        where: { userProfileId: userId },  // Adjusted to match new field name
      });

      const isAlreadyEnrolled = enrollments.some((enrollment) => enrollment.eventDetailId === eventDetailId);

      if (isAlreadyEnrolled) {
        return res.status(400).json({ error: 'Participant already enrolled in this event' });
      }

      const newEnrollment = await prisma.eventEnrollment.create({
        data: {
          userProfileId: userId,  // Adjusted field name
          eventDetailId,
          registrationDate: new Date(),
          ticketType: 'regular', // Default ticket type or pass as needed
        },
      });

      return res.status(201).json({ message: 'Registration successful', enrollment: newEnrollment });

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }

  if (req.method === "GET") {
    const userToken = req.headers.authorization?.split(" ")[1];

    if (!userToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
      const email = decoded.email;

      const user = await prisma.userProfile.findUnique({
        where: { emailAddress: email },  // Adjusted for the new model name
      });

      if (!user) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const userId = user.userProfileId;  // Adjusted to match new field name

      const enrollments = await prisma.eventEnrollment.findMany({
        where: { userProfileId: userId },  // Adjusted to match new field name
      });

      return res.status(200).json(enrollments);

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Invalid user token or authentication failed' });
    }
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
