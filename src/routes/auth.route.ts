import { Router } from "express";
import { signIn, signUp, updatePassword } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/update-password", updatePassword);

export default router;
