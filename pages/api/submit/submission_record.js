import NextCors from 'nextjs-cors';
import formidable from 'formidable';
import path from "path";
import fs from 'fs';
import { getUserProfileFromToken } from "../../../utils/services/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disables Next.js' default body parsing
  },
};

export default async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  if (req.method === 'POST') {
    try {

      const { userProfileId } = await getUserProfileFromToken(req);

      // Directory to store uploaded files
      const uploadDir = path.join(process.cwd(), '/uploads');
      let submissionId;

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Initialize the form parser
      const form = formidable({ uploadDir });

      // Parse form data (fields and files)
      const [fields, files] = await form.parse(req);
      console.log(fields);
      console.log(files);

      // Extract necessary fields from the form data
      const { paperTitle, abstract, eventId } = fields;
      const paperUpload = files.paperUpload;

      // Create new submission record in the database
      const newSubmission = await prisma.submissionRecord.create({
        data: {
          eventDetailId: parseInt(eventId[0]), // Assuming 'eventDetailId' based on your schema
          userProfileId: userProfileId, // 'userProfileId' based on your schema
          submissionTitle: paperTitle[0], // 'submissionTitle' field
          submissionAbstract: abstract[0], // 'submissionAbstract' field
          submissionDate: new Date().toISOString(), // 'submissionDate' field
        },
      });
      submissionId = newSubmission.submissionRecordId; // Use 'submissionRecordId' as per your schema

      // Handling the file renaming and saving
      let newFilename = paperUpload[0].newFilename;
      let originalFilename = paperUpload[0].originalFilename;
      const fileExtension = originalFilename.split('.').pop(); // Get file extension

      try {
        // Rename and move the file
        fs.renameSync(
          path.join(uploadDir, newFilename),
          path.join(uploadDir, `${submissionId}.${fileExtension}`)
        );
        console.log('File renamed successfully to:', `${submissionId}.${fileExtension}`);
      } catch (renameErr) {
        console.error('Error renaming file:', renameErr);
        return res.status(500).json({ error: 'Error renaming file' });
      }

      return res.status(200).json({ success: true, fields, files });
    } catch (error) {
      console.error('Error handling submission:', error);
      return res.status(500).json({ error: 'Error creating submission' });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};
