import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../Constants/Enum";
import userModel from "../../../Database/Model/User/user.model";
import { jwtHelper } from "../../../Helper/jwt.helper";
import { responseHelper } from "../../../Helper/reponse.helper";

const authController = {
  isAuth: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return responseHelper(res, undefined, "No token provided!").Unauthorized();

    const [_, tokenFromClient] = req.headers.authorization?.split(" ");

    if (tokenFromClient) {
      try {
        const tokenDecoded: any = await jwtHelper.verifyToken(tokenFromClient, process.env.NODE_JWT_SECRET!);

        /**
         * Nếu token hợp lệ
         * => Lưu thông tin đc giải mãi vào request
         * => Dùng cho các xử lý phía sau
         */
        req.jwtDecoded = tokenDecoded!;

        next();
      } catch (error) {
        return responseHelper(res, undefined, "Token malformed!").BadRequest();
      }
    } else {
      return responseHelper(res, undefined, "No token provided!").Unauthorized();
    }
  },
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
    userModel
      .findById(req.jwtDecoded.data.user._id)
      .then((result: any) => {
        if (result.role === UserRole.ADMIN) return next();

        return responseHelper(res, undefined, "You don't have permission!").BadRequest();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default authController;
