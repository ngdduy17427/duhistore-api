import express, { Express } from "express";
import userController from "../../Controllers/User/user.controller";

const router: Express = express();

router.get("/findAll", userController.findAll);
router.get("/findById/:id", userController.findById);
router.get("/findByUsername/:username", userController.findByUsername);

export { router };
