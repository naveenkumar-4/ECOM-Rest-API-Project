import UserModel from "../user/user.model.js";
import ApplicationHandler from "../../Error-Handler/applicationError.js";

export default class ProductModel {
  constructor(name, description, price, imageUrl, category, sizes, id) {
    this._id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
  }

  static getAllProducts() {
    return products;
  }

  static addProduct(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static getProduct(id) {
    const product = products.find((product) => product.id == id);
    return product;
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });
    return result;
  }

  static rateProduct(userID, productID, rating) {
    // 1. Validate user and product
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      // return "User not Found";
      throw new ApplicationHandler("User not found", 404);
    }

    // 2.Validate Product
    const product = products.find((p) => p.id == productID);
    if (!product) {
      // return "Product not found";

      // user-defined error .
      throw new ApplicationHandler("Product not found", 404);
    }

    // 3.Check if there are any ratings and if not then add ratings array
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({ userID: userID, rating: rating });
    } else {
      // 4.Check if user rating is already avaliable
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );
      if (existingRatingIndex >= 0) {
        console.log(product.ratings[existingRatingIndex]);
        product.ratings[existingRatingIndex] = {
          userID: userID,
          rating: rating,
        };
      } else {
        // 5. If no existing rating, then add new rating
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }
    }
  }
}

let products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Category1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Category2",
    ["M", "XL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category2",
    ["M", "XL", "S"]
  ),
];
