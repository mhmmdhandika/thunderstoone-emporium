import express from "express";
import {
  getAllProducts,
  getOneProduct,
  createProduct,
  deleteOneProduct,
} from "../controllers/productControllers.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getOneProduct);

router.post("/", createProduct);

router.delete("/:id", deleteOneProduct);

export default router;
