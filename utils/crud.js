import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const createItem = async (modelName, req, res) => {
  try {
    const data = req.body;
    // If the model is EventDetail (previously Event)
    if (modelName === 'eventDetail') {
      let myuuid = uuidv4();
      data.meetingLink = `https://streaming.nextintech.in/${myuuid}`;
    }
    console.log(data);
    const newItem = await prisma[modelName].create({ data });
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getItem = async (modelName, req, res) => {
  try {
    const item = await prisma[modelName].findUnique({
      where: { id: req.params.id }, // Assumes `id` is a common identifier, update if necessary
    });

    if (!item)
      return res.status(404).json({ success: false, error: "Item not found" });

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateItem = async (modelName, req, res) => {
  try {
    const data = req.body.data;

    const updatedItem = await prisma[modelName].update({
      where: { id: req.body.id }, // Assumes `id` is a common identifier, update if necessary
      data,
    });

    return res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteItem = async (modelName, req, res) => {
  try {
    const { id } = req.query;
    console.log(id);

    if (!id) {
      return res.status(400).json({ success: false, error: "ID is required" });
    }

    // Assuming the `userProfileId` or similar as the primary key for deletion
    const key = `${modelName}Id`
    const deletedItem = await prisma[modelName].delete({
      where: { [key]: parseInt(id) }, // Update field name as per model (e.g., `userProfileId`, `eventDetailId`)
    });

    return res.status(200).json({ success: true, data: deletedItem });
  } catch (error) {
    console.error("Delete Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const listItem = async (modelName, req, res, includeRelations = {}) => {
  // console.log(req);
  try {
    if (modelName === "eventSchedule") {
      const items = await prisma.eventSchedule.findMany({
        include: includeRelations,
      });
      return res.status(201).json({ success: true, data: items });
    }
    const items = await prisma[modelName].findMany({
      include: includeRelations,
    });

    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("List Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  createItem,
  getItem,
  updateItem,
  deleteItem,
  listItem,
};
