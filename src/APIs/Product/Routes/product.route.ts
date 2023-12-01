import express, { Express } from "express";
import productController from "../Controller/product.controller";

const productRoute: Express = express();

productRoute.get("/findAll", productController.findAll);
productRoute.get("/findById/:_id", productController.findById);

export default productRoute;
