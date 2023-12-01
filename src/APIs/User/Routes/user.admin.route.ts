import express, { Express } from "express";
import userController from "../Controller/user.controller";

const userAdminRoute: Express = express();

userAdminRoute.post("/insert", userController.insert);
userAdminRoute.put("/update", userController.update);
userAdminRoute.delete("/delete/:id", userController.delete);

export default userAdminRoute;
