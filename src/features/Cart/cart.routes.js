

// Manage routes/paths to ProductController

// 1.Import Express.
import express from "express";
import CartController from "./controllers/cart.controller.js";

// 2.Initialize Express router
const cartRouter = express.Router();
 
const cartController = new CartController();
 
// All the paths to controller methods
cartRouter.delete('/:id', (req, res, next)=>{
    cartController.delete(req, res, next);
})
cartRouter.post('/', (req, res, next)=>{
    cartController.add(req, res, next);
})
cartRouter.get("/", (req, res, next)=>{
    cartController.get(req, res, next);
});



export default cartRouter;