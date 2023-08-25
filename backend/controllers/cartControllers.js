import db from "../models/db.js";

export const getUserCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [row] = await db.execute(
      "SELECT * FROM cart_items WHERE cart_id = (?)",
      [userId]
    );
    res.send(row);
  } catch (error) {
    next(error);
  }
};
