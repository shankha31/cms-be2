import NextCors from 'nextjs-cors';
import formidable from 'formidable';
import path from "path";
import fs from 'fs';
import { getUserProfileFromToken } from "../../../utils/services/auth";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../../../utils/services/sendmail"
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
      const { paperTitle, abstract, eventId, expertiseId } = fields;
      const paperUpload = files.paperUpload;

      // Create new submission record in the database
      const newSubmission = await prisma.submissionRecord.create({
        data: {
          eventDetailId: parseInt(eventId[0]),
          userProfileId: userProfileId,
          submissionTitle: paperTitle[0],
          submissionAbstract: abstract[0],
          submissionDate: new Date().toISOString(),
        },
      });
      submissionId = newSubmission.submissionRecordId;
      var expertise = expertiseId[0].split(",");
      submissionId = newSubmission.submissionRecordId;
      await prisma.submissionExpertise.createMany({
        data: expertise.map((exp) => ({
          submissionRecordId: submissionId,
          expertiseId: parseInt(exp),
        })),
      });

      // Handling the file renaming and saving
      let newFilename = paperUpload[0].newFilename;
      let originalFilename = paperUpload[0].originalFilename;
      const fileExtension = originalFilename.split('.').pop();

      try {
        // Rename and move the file
        fs.renameSync(
          path.join(uploadDir, newFilename),
          path.join(uploadDir, `${submissionId}.${fileExtension}`)
        );
        console.log('File renamed successfully to:', `${submissionId}.${fileExtension}`);
        var event_name = prisma.eventDetail.findUnique({
          where: { eventScheduleId: parseInt(eventId[0]) },
        }).eventName;
        const user = await prisma.userProfile.findUnique({
          where: {
            userProfileId: userProfileId, // Replace with the actual ID
          },
        });
        var user_name = user.firstName + user.lastName;
        var user_email = user.emailAddress;
        console.log(user_email, user_name, user);

        var msg = `Dear ${user_name},\nThank you for your submission! We are pleased to confirm that your submission has been successfully received.\nHere are the details of your submission:\n    Submission Title: ${paperTitle[0]}\n    Abstract:\n    ${abstract[0]}\n   Event: ${event_name}\nOur team will carefully review your submission and notify you regarding the next steps soon. \nThank you for contributing to ${event_name}!\nBest regards,\nTech Conference Management System`
        await sendMail(
          user_email,
          'Submission Confirmation',
          msg
        );
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
