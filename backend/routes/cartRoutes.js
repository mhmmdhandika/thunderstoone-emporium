import express from "express";
import { getUserCart } from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/:userId", getUserCart);

export default router;
