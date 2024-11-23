import NextCors from 'nextjs-cors';
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const method = req.method;
  const tableName = "expertise"; // Ensure it's consistent with Prisma model name
  if (req.method === "GET") {
    return await listItem(tableName, req, res); // Assumes this argument is valid for loading related event data
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
