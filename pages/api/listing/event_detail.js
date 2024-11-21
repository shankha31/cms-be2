import NextCors from 'nextjs-cors';
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // For legacy browser support
  });

  const method = req.method;
  const tableName = "eventDetail"; // Assuming you've renamed it to eventDetails or similar

  if (method === "GET") {
    return listItem(tableName, req, res);
  }

  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
