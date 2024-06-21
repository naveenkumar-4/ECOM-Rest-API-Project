import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { getClient } from "../../config/mongodb.js";
import OrderModel from "./orders.model.js";
import ApplicationHandler from "../../Error-Handler/applicationError.js";
import { cli } from "winston/lib/winston/config/index.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userID) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      // 1. Get cartItmes and calculate total Amount.
      const items = await this.getTotalAmount(userID);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log(finalTotalAmount);

      // 2. Create an order record
      const newOrder = new OrderModel(
        new ObjectId(userID),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }
      // throw new Error("Something is wrong in placeOrder");

      // 4. Clear the cart items.
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userID),
        },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  async getTotalAmount(userID, session) {
    const db = getDB();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // 1. Get cart items for the user
          {
            $match: { userID: new ObjectId(userID) },
          },
          //2. Get the products from products collection
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          //   3. unwinding the productInfo
          {
            $unwind: "$productInfo",
          },
          //   4. Calculate totalAmunt for r=each cartItmes
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  }
}
