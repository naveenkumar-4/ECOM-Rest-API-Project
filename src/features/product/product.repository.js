import { ObjectId } from "mongodb";
import ApplicationHandler from "../../Error-Handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import mongoose from "mongoose";
import { productSchemaa } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";

const ProductModel = mongoose.model("Product", productSchemaa);
const ReviewModel = mongoose.model("Review", reviewSchema);

export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async addProduct(newProduct) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  async getProduct(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  async getAllProducts() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return collection.find().toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  async filterProducts(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }

      // ['Cat1', 'Cat2']
      categories = JSON.parse(categories.replace(/'/g, '"'));
      if (categories) {
        filterExpression = {
          $or: [{ category: { $in: categories } }, filterExpression],
        };
        // filterExpression.category = category;
      }
      return collection
        .find(filterExpression)
        .project({ _id: 0, name: 1, price: 1, ratings: 1 })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  // async rateProducts(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     // 1. Find the product
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productID),
  //     });
  //     // 2. Find the rating
  //     const userRating = product?.ratings?.find(
  //       (rating) => rating.userID == userID
  //     );
  //     if (userRating) {
  //       // 3. Update the existing rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //           "ratings.userID": new ObjectId(userID),
  //         },
  //         {
  //           // the "$.rating" is a placeholder which is the first data i.e first rating
  //           // that was given based on the above condition
  //           $set:{
  //             "ratings.$.rating":rating
  //           }
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //         },
  //         {
  //           $push: { ratings: { userID: new ObjectId(userID), rating } },
  //         }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
  //   }
  // }

  async rateProducts(userID, productID, rating) {
    try {
      // const db = getDB();
      // const collection = db.collection(this.collection);
      // // 1.removes existing entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productID),
      //   },
      //   {
      //     $pull: { ratings: { userID: new ObjectId(userID) } },
      //   }
      // );
      // // 2. Add new entry
      // await collection.updateOne(
      //   {
      //     _id: new ObjectId(productID),
      //   },
      //   {
      //     $push: { ratings: { userID: new ObjectId(userID), rating } },
      //   }
      // );
      // 1. Check if poduct exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product Not found");
      }
      // 2.Get the existing review
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          // Stage1: Get Average price per category
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something Went Wrong with dataBase", 500);
    }
  }
}
