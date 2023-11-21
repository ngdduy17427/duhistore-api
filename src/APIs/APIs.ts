import { Express, Request, Response } from "express";
// Auth
import authController from "./Controllers/Authentication/auth.controller";
// App init
import { router as appInitProtectRoute } from "./Routes/AppInit/app.init.protect.route";
import { router as appInitRoute } from "./Routes/AppInit/app.init.route";
// User
import { router as userAdminRoute } from "./Routes/User/user.admin.route";
import { router as userRoute } from "./Routes/User/user.route";
// Order
import { router as orderProtectRoute } from "./Routes/Order/order.protect.route";
import { router as orderRoute } from "./Routes/Order/order.route";
// Product
import { router as productProtectRoute } from "./Routes/Product/product.protect.route";
import { router as productRoute } from "./Routes/Product/product.route";
// Purchase
import { responseHelper } from "../Helper/reponse.helper";
import { router as purchaseProtectRoute } from "./Routes/Purchase/purchase.protect.route";
import { router as purchaseRoute } from "./Routes/Purchase/purchase.route";

export const initAPIs = (router: Express) => {
  // Welcome
  router.get("/", (_: Request, res: Response) => {
    return responseHelper(res, undefined, "Welcome to Duhi Store").Success();
  });

  // List Free APIs:
  router.use("/app", appInitRoute);
  router.use("/user", userRoute);
  router.use("/order", orderRoute);
  router.use("/product", productRoute);
  router.use("/purchase", purchaseRoute);

  // List Protect APIs:
  router.use(authController.isAuth);
  router.use("/app", appInitProtectRoute);
  router.use("/order", orderProtectRoute);
  router.use("/product", productProtectRoute);
  router.use("/purchase", purchaseProtectRoute);

  // List Admin APIs:
  router.use(authController.isAdmin);
  router.use("/user", userAdminRoute);
};
