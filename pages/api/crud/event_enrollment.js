import {
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../../../utils/crud";
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const method = req.method;
  const tableName = "EventEnrollment";
  switch (method) {
    case "POST":
      return createItem(tableName, req, res);
    case "GET":
      return getItem(tableName, req, res);
    case "PUT":
      return updateItem(tableName, req, res);
    case "DELETE":
      return deleteItem(tableName, req, res);
    default:
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
