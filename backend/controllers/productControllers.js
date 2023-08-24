import db from "../models/db.js";
import { getProductDataFromRows } from "../utilities/productUtils.js";
import {
  createProductSchema,
  deleteProductSchema,
} from "../validations/productSchema.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id AS product_id,
        p.title AS product_title,
        p.description AS product_description,
        v.id AS variation_id,
        v.color AS variation_color,
        v.size AS variation_size,
        v.price AS variation_price,
        v.stock AS variation_stock,
        i.id AS image_id,
        i.image_path
      FROM products AS p
      LEFT JOIN product_variations AS v ON p.id = v.product_id
      LEFT JOIN product_images AS i ON p.id = i.product_id
    `);

    const products = getProductDataFromRows(rows);

    res.json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      `
      SELECT 
        p.id AS product_id,
        p.title AS product_title,
        p.description AS product_description,
        v.id AS variation_id,
        v.color AS variation_color,
        v.size AS variation_size,
        v.price AS variation_price,
        v.stock AS variation_stock,
        i.id AS image_id,
        i.image_path
      FROM products AS p
      LEFT JOIN product_variations AS v ON p.id = v.product_id
      LEFT JOIN product_images AS i ON p.id = i.product_id 
      WHERE p.id = (?)
    `,
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }

    const products = getProductDataFromRows(rows);

    res.send({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    const {
      error,
      value: { title, description, color, size, price, stock, image_path },
    } = createProductSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }

    await connection.beginTransaction();

    const [rowProduct] = await connection.execute(
      "INSERT INTO products (title, description) VALUES (?, ?)",
      [title, description]
    );

    await connection.execute(
      "INSERT INTO product_variations (product_id, color, size, price, stock) VALUES(?, ?, ?, ?, ?)",
      [rowProduct.insertId, color, size, price, stock]
    );

    await connection.execute(
      "INSERT INTO product_images (product_id, image_path) VALUES (?, ?)",
      [rowProduct.insertId, image_path]
    );

    await connection.commit();

    res.send({
      message: "The product has been successfully created!",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const deleteOneProduct = async (req, res, next) => {
  try {
    const { error, value } = deleteProductSchema.validate({
      id: req.params.id,
    });

    if (error) throw new Error(error.details[0].message);

    await db.execute("DELETE FROM products WHERE id = (?)", [value.id]);

    res.json({
      message: "The product has been successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
