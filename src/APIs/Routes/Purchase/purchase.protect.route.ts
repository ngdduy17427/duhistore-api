import express, { Express } from "express";
import purchaseController from "../../Controllers/Purchase/purchase.controller";

const router: Express = express();

router.post("/insert", purchaseController.insert);
router.put("/update", purchaseController.update);
router.delete("/delete/:id", purchaseController.delete);

export { router };
