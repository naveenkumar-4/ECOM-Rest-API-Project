import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import bodyParser from "body-parser";
import ProductRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import basicAuthorizer from "./src/middlewares/basic-auth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import cartRouter from "./src/features/Cart/cart.routes.js";
import { logger } from "./src/middlewares/logger.middleware.js";
import ApplicationHandler from "./src/Error-Handler/applicationError.js";
import orderRouter from "./src/features/Order/order.routes.js";

// import { log } from "./src/middlewares/logger.middleware.js";

import apiDocs from "./swagger.json" assert { type: "json" };
import mongoose from "mongoose";

// Create Server
export const app = express();

// CORS Policy Configuration
var corsOptions = {
  origin: "http://127.0.0.1:5500",
  allowedHeaders: "*",
};
app.use(cors(corsOptions));

// app.use((req, res, next)=>{
//     // res.header('Access-Control-Allow-Origin', '*') which gives access to all web browsers clients
//     res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//     // res.header("Access-Control-Allow-Headers", 'Authorization')  //or we can specify "*" to allow all headers
//     res.header("Access-Control-Allow-Headers", '*');

//     // return ok for preflight request.
//     if(req.method == "OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

app.use(bodyParser.json());
app.use(express.json());
// Bearer <token>
// For all requests related to product, redirect to product routes.
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
app.use(loggerMiddleware);
app.use("/api/orders", jwtAuth, orderRouter);
app.use("/api/products", jwtAuth, ProductRouter);
app.use("/api/users", userRouter);
app.use("/api/cartItems", jwtAuth, cartRouter);

//Default handler
app.get("/", (req, res) => {
  res.send("Welcome to REST API E-Com");
});

// Error Handler middleware
app.use((err, req, res, next) => {
  // if (res.headersSent) {
  //   return next(err);
  // }
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(401).send(err.message);
  }
  if (err instanceof ApplicationHandler) {
    res.status(err.code).send(err.message);
  }

  // For server Errors
  console.log(err);
  logger.info(err.message);
  // log(err.message)
  res.status(500).send("Something went wrong, please try later");
});

// Middleware to handle 404 requests.
app.use((req, res) => {
  res.status(404).send("API is not found");
});
