import express from "express";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

const { PORT } = process.env;

// control headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// body parser
app.use(express.json());

app.use("/products", productRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
