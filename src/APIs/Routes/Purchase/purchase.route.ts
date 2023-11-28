import express, { Express } from "express";
import purchaseController from "../../Controllers/Purchase/purchase.controller";

const router: Express = express();

router.get("/findAll", purchaseController.findAll);
router.get("/findById/:_id", purchaseController.findById);
router.get("/summary", purchaseController.summary);

export { router };
