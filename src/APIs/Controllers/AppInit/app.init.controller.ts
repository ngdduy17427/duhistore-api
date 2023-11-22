import { Request, Response } from "express";
import md5 from "md5";
import { OrderStatus, PurchaseStatus, UserRole } from "../../../Constants/Enum";
import userModel from "../../../Database/Model/User/user.model";
import { jwtHelper } from "../../../Helper/jwt.helper";
import { responseHelper } from "../../../Helper/reponse.helper";
import { mapUserData } from "../User/user.controller";

const appInitController = {
  init: (_: Request, res: Response) => {
    const init = {
      options: {
        userRole: [
          { value: UserRole.USER, label: "User" },
          { value: UserRole.ADMIN, label: "Admin" },
        ],
        orderStatus: [
          { value: OrderStatus.PACKING, label: "Packing", bgColor: "#f0e68c", textColor: "black" },
          { value: OrderStatus.DELIVERED, label: "Delivered", bgColor: "#03bb3f", textColor: "white" },
        ],
        purchaseStatus: [
          { value: PurchaseStatus.PACKING, label: "Packing", bgColor: "#f0e68c", textColor: "black" },
          { value: PurchaseStatus.RECEIVED, label: "Received", bgColor: "#03bb3f", textColor: "white" },
        ],
      },
    };

    return responseHelper(res, init, "App initial!").Success();
  },
  login: async (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();

    userModel
      .findByUsername(req.body.username)
      .then(async (result) => {
        const [user]: any = result;

        if (!user.username) return responseHelper(res, undefined, "The username is incorrect").BadRequest();
        if (user.password !== md5(req.body.password + process.env.NODE_JWT_SECRET!))
          return responseHelper(res, undefined, "The password is incorrect").BadRequest();

        const accessToken = await jwtHelper.generateToken(
          {
            user: mapUserData(user),
          },
          process.env.NODE_JWT_SECRET!,
          process.env.NODE_JWT_LIFETIME!
        );
        const tokenExp = Date.now() + 365;

        return responseHelper(
          res,
          {
            accessToken,
            tokenExp,
          },
          "Login success!"
        ).Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).BadRequest();
      });
  },
  logout: async (req: Request, res: Response) => {
    userModel
      .findById(req.jwtDecoded.data.user.id)
      .then((result) => {
        if (!result) responseHelper(res, undefined, "Logout failed!").BadRequest();

        return responseHelper(res, undefined, "Logout successfully!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default appInitController;
