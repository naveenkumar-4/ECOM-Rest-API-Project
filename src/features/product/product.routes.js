// Manage routes/paths to ProductController

// 1.Import Express.
import express from "express";
import ProductController from "./controllers/product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";
// 2.Initialize Express router
const productRouter = express.Router();

const productController = new ProductController();

// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.post("/rate", (req, res, next) => {
    productController.rateProduct(req, res, next);
});
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
// All the paths to controller methods
// If the request is coming here it means
// It already completed localhost/api/products
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
