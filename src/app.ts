import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import errorHandler from "./middleware/error.middleware";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.get("/", (req, res) => {
  res.send("this is homepage");
});

app.use(errorHandler);

export { app };
