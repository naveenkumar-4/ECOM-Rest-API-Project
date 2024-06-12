import CartModel from "../cart.model.js";
import CartRepository from "../cart.repository.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }
  async add(req, res) {
    try {
      // const {productID, quantity} = req.query;
      const { productID, quantity } = req.body;
      const userID = req.userID;
      await this.cartRepository.add(productID, userID, quantity);
      res.status(201).send("Cart is Updated");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartRepository.get(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async delete(req, res) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;
      const isDeleted = await this.cartRepository.delete(userID, cartItemID);
      if (!isDeleted) {
        return res.status(404).send("Item not found");
      }
      return res.status(200).send("Cart Item is removed");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
