import express, { Express } from "express";
import productController from "../../Controllers/Product/product.controller";

const router: Express = express();

router.get("/findAll", productController.findAll);
router.get("/findById/:id", productController.findById);

export { router };
