import { Express } from "express";
// Auth
import authController from "./Auth/Controller/auth.controller";
// App init
import appProtectRoute from "./App/Routes/app.protect.route";
import appRoute from "./App/Routes/app.route";
// User
import userAdminRoute from "./User/Routes/user.admin.route";
import userRoute from "./User/Routes/user.route";
// Order
import orderProtectRoute from "./Order/Routes/order.protect.route";
import orderRoute from "./Order/Routes/order.route";
// Product
import productProtectRoute from "./Product/Routes/product.protect.route";
import productRoute from "./Product/Routes/product.route";
// Purchase
import purchaseProtectRoute from "./Purchase/Routes/purchase.protect.route";
import purchaseRoute from "./Purchase/Routes/purchase.route";

export const initAPIs = (router: Express) => {
  // Welcome
  router.use("/", appRoute);

  // List Free APIs:
  router.use("/app", appRoute);
  router.use("/user", userRoute);
  router.use("/order", orderRoute);
  router.use("/product", productRoute);
  router.use("/purchase", purchaseRoute);

  // List Protect APIs:
  router.use(authController.isAuth);
  router.use("/app", appProtectRoute);
  router.use("/order", orderProtectRoute);
  router.use("/product", productProtectRoute);
  router.use("/purchase", purchaseProtectRoute);

  // List Admin APIs:
  router.use(authController.isAdmin);
  router.use("/user", userAdminRoute);
};
