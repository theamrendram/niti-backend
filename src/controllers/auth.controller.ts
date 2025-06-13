import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prismaClient from "../services/prisma.service";

async function hashPassword(password: string) {
  const saltRounds = parseInt(process.env.SALT_ROUNDS!);
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function verifyPassword(
  inputPassword: string,
  hashedPasswordFromDB: string
) {
  return await bcrypt.compare(inputPassword, hashedPasswordFromDB);
}

const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (!verifyPassword(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Logged in successfully" });
};

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({
      message: "firstName, lastName, email and password are required",
    });
    return;
  }

  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);
  try {
    const user = await prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ user: user });
    return;
  } catch (error: any) {
    console.log("error while signup", error);
    res
      .status(400)
      .json({ message: "Some error occurred", error: error.message });
    return;
  }
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(currentPassword, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    await prismaClient.user.update({
      where: { email },
      update: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signIn, signUp, updatePassword };
