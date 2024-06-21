import OrderRepository from "../orders.repository.js";

export default class OrderController {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async placeOrder(req, res, next) {
    try {
      const userId = req.userID;
      await this.orderRepository.placeOrder(userId);
      res.status(201).send("Order is placed");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
