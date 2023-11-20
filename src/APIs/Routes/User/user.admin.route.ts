import express, { Express } from "express";
import userController from "../../Controllers/User/user.controller";

const router: Express = express();

router.post("/insert", userController.insert);
router.put("/update", userController.update);
router.delete("/delete/:id", userController.delete);

export { router };
