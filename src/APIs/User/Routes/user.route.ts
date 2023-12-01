import express, { Express } from "express";
import userController from "../Controller/user.controller";

const userRoute: Express = express();

userRoute.get("/findAll", userController.findAll);
userRoute.get("/findById/:id", userController.findById);
userRoute.get("/findByUsername/:username", userController.findByUsername);

export default userRoute;
