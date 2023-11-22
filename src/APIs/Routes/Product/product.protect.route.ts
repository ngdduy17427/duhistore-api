import express, { Express } from "express";
import productController from "../../Controllers/Product/product.controller";

const router: Express = express();

router.post("/insert", productController.insert);
router.put("/update", productController.update);

export { router };
