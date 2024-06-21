import express from "express";
import OrderController from "./controllers/orders.controller.js";

const orderRouter = express.Router();

const orderController = new OrderController();

orderRouter.post("/", (req, res, next) => {
  orderController.placeOrder(req, res);
});

export default orderRouter;
