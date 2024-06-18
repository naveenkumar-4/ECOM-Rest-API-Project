import ProductModel from "../product.model.js";
import ProductRepository from "../product.repository.js";
import ApplicationHandler from "../../../Error-Handler/applicationError.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAllProducts();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(500).send("Something wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, price, sizes } = req.body;
      const newProduct = new ProductModel(
        name,
        null,
        parseFloat(price),
        req.file.filename,
        null,
        sizes.split(",")
      );

      const createdRecord = await this.productRepository.addProduct(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(401).send("Something wrong");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const productFound = await this.productRepository.getProduct(id);
      if (!productFound) {
        res.status(404).send("Product Not Found");
      } else {
        return res.status(200).send(productFound);
      }
    } catch (err) {
      console.log(err);
      // next(err)
      return res.status(500).send("Something wrong");
    }
  }

  async rateProduct(req, res, next) {
    const query = req.query;
    console.log(query);
    try {
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = req.body.rating;
      // try{
      //   ProductModel.rateProduct(userID, productID, rating);
      // }catch(err){
      //   return res.status(400).send(err.message);
      // }
      // return res.status(200).send("Rating has been added");

      // Error will be handled by
      await this.productRepository.rateProducts(userID, productID, rating);
      return res.status(200).send("Rating has been added");
    } catch (err) {
      console.log(err);
      console.log("Passing Error to the middleware");
      next(err); //It will call that error middleware from the controller
    }
  }

  async filterProducts(req, res) {
    try {
      // fetching query Parameters
      const minPrice = req.query.minPrice;
      // const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      const result = await this.productRepository.filterProducts(
        minPrice,
        categories
      );
      console.log(result);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something Went Wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something Went Wrong");
    }
  }
}
