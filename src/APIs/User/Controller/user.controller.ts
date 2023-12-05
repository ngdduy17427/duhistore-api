import { Request, Response } from "express";
import md5 from "md5";
import moment from "moment";
import userModel from "../Model/user.model";
import { jwtHelper } from "../../../Helper/jwt.helper";
import { responseHelper } from "../../../Helper/reponse.helper";

const userController = {
  findAll: (_: Request, res: Response) => {
    userModel
      .findAll()
      .then((resultData) => {
        return responseHelper(res, resultData, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    userModel
      .findById(req.params._id)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findByUsername: (req: Request, res: Response) => {
    if (!req.params.username) return responseHelper(res, undefined, "Missing username!").BadRequest();

    userModel
      .findByUsername(req.params.username)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  insert: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.username) return responseHelper(res, undefined, "Username can not be empty!").BadRequest();
    if (!req.body.password) return responseHelper(res, undefined, "Password can not be empty!").BadRequest();

    userModel
      .findByUsername(req.body.username)
      .then((result) => {
        const [userSelected]: any = result;

        if (!userSelected) {
          const newData = {
            username: req.body.username,
            password: md5(req.body.password + process.env.NODE_JWT_SECRET),
            name: req.body.name,
            role: req.body.role,
            created: moment().valueOf(),
            updated: moment().valueOf(),
          };

          userModel
            .insert(newData)
            .then((_) => {
              return responseHelper(res, newData, "Created!").Created();
            })
            .catch((error) => {
              return responseHelper(res, undefined, error.message).InternalServerError();
            });
        } else {
          return responseHelper(res, undefined, "Username already exists!").BadRequest();
        }
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.password) return responseHelper(res, undefined, "Password can not be empty!").BadRequest();

    userModel
      .findById(req.body._id)
      .then((result: any) => {
        // Change user password if client request
        if (result.password !== req.body.password) {
          result.password = md5(req.body.password + process.env.NODE_JWT_SECRET!);
        }

        result.name = req.body.name;
        result.role = req.body.role;
        result.updated = moment().valueOf();

        userModel
          .update(result)
          .then(() => {
            return responseHelper(res, result, "Updated!").Created();
          })
          .catch((error) => {
            return responseHelper(res, undefined, error.message).InternalServerError();
          });
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  delete: (req: Request, res: Response) => {
    // Catching bad request params
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();
    if (req.params._id === req.jwtDecoded.data.user._id)
      return responseHelper(res, undefined, "You cannot delete your account!").BadRequest();

    userModel
      .delete(req.params._id)
      .then((_) => {
        return responseHelper(res, req.params._id, "Deleted!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  register: async (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.username) return responseHelper(res, undefined, "Username can not be emtpy!").BadRequest();
    if (!req.body.password) return responseHelper(res, undefined, "Password can not be emtpy!").BadRequest();

    userModel
      .findByUsername(req.body.username)
      .then((result) => {
        const [userSelected]: any = result;

        if (!userSelected) {
          const newData = {
            username: req.body.username,
            password: md5(req.body.password + process.env.NODE_JWT_SECRET!),
            name: req.body.name,
            created: moment().valueOf(),
            updated: moment().valueOf(),
          };

          userModel
            .insert(newData)
            .then(async (result: any) => {
              // Tạo accessToken mới cho user
              const accessToken = await jwtHelper.generateToken(
                {
                  id: result._id,
                  username: result.username,
                  role: result.role,
                },
                process.env.NODE_JWT_SECRET!,
                process.env.NODE_JWT_LIFETIME!
              );

              return responseHelper(
                res,
                {
                  accessToken: accessToken,
                },
                "Register success!"
              ).Success();
            })
            .catch((error) => {
              return responseHelper(res, undefined, error.message).InternalServerError();
            });
        } else {
          return responseHelper(res, undefined, "Username already exists!").BadRequest();
        }
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).BadRequest();
      });
  },
};

export default userController;
