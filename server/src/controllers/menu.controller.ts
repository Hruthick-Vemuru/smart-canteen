import { Request, Response } from "express";
import Menu from "../models/menu.model";

export const getMenu = async (_req: Request, res: Response) => {
  const menu = await Menu.find().sort({
    category: 1,
    createdAt: -1,
  });
  res.json(menu);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const item = await Menu.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};

export const createMenuItem = async (
  req: Request,
  res: Response
) => {
  const {
    name,
    price,
    description,
    imageUrl,
    category,
    isVeg,
    isSpecial,
  } = req.body;

  const item = await Menu.create({
    name,
    price,
    description,
    imageUrl,
    category,
    isVeg,
    isSpecial,
    available: true,
  });

  res.status(201).json(item);
};

export const toggleAvailability = async (
  req: Request,
  res: Response
) => {
  const item = await Menu.findById(req.params.id);
  if (!item)
    return res.status(404).json({ message: "Not found" });

  item.available = !item.available;
  await item.save();

  res.json(item);
};
