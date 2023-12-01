import express, { Express } from "express";
import productController from "../Controller/product.controller";

const productProtectRoute: Express = express();

productProtectRoute.post("/insert", productController.insert);
productProtectRoute.put("/update", productController.update);

export default productProtectRoute;
