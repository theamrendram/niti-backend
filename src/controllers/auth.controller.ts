import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const signIn = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (email !== "amrendraex@gmail.com" || password !== "admin123") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: "1", role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Logged in successfully" });
};

const signUp = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  res.status(501).json({ error: "Sign up not implemented yet" });
};

export { signIn, signUp };
