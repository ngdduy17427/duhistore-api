import express, { Express } from "express";
import purchaseController from "../../Controllers/Purchase/purchase.controller";

const router: Express = express();

router.get("/findAll", purchaseController.findAll);
router.get("/findById/:id", purchaseController.findById);

export { router };
