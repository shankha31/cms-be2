import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextCors from 'nextjs-cors';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  console.log(req.body);

  if (req.method === "POST") {
    

    try {
      const { firstName, lastName, email, password, userRole, expertise, description } = req.body;
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new userProfile
      const user = await prisma.userProfile.create({
        data: {
          firstName,
          lastName,
          emailAddress: email,
          hashedPassword,
          userRole,
          description,
        },
      });
      console.log(user);


      //Map user to expertise
      await prisma.userExpertise.createMany({
        data: expertise?.map((exp) => ({
          userProfileId: user.userProfileId,
          expertiseId: exp,
        })),
      });


      return res.status(201).json({ message: "Registration Successful", user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred during registration" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
