import { ObjectId } from "mongodb";
import ApplicationHandler from "../../Error-Handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class CartRepository {
  constructor() {
    this.collection = "Cart";
  }
  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // find the document
      // Either insert or update

      // Insertion.
      // await collection.insertOne({
      //   productID: new ObjectId(productID),
      //   userID: new ObjectId(userID),
      //   quantity,
      // });
      await collection.updateOne(
        {
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
        },
        {
          $inc: { quantity: quantity },
        },
        {
          upsert: true,
        }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }
  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }
  async delete(userID, cartID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        userID: new ObjectId(userID),
        _id: new ObjectId(cartID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }
}
