import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

const createProject = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("error while creating project");
    res.status(200).json(error);
  }
};

export { createProject };
