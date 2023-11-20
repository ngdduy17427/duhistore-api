import { Request, Response } from "express";
import md5 from "md5";
import moment from "moment";
import userModel from "../../../Database/Model/User/user.model";
import { jwtHelper } from "../../../Helper/jwt.helper";
import { responseHelper } from "../../../Helper/reponse.helper";

export const mapUserData = (userData: any) => {
  return {
    id: userData._id,
    username: userData.username,
    password: userData.password,
    name: userData.name,
    role: userData.role,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
};

const userController = {
  findAll: (_: Request, res: Response) => {
    userModel
      .findAll()
      .then((result: any) => {
        result = result.map((dataResult: any) => {
          return mapUserData(dataResult);
        });

        return responseHelper(res, result, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    userModel
      .findById(req.params.id)
      .then((result) => {
        return responseHelper(res, mapUserData(result), "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findByUsername: (req: Request, res: Response) => {
    if (!req.params.username) return responseHelper(res, undefined, "Missing username!").BadRequest();

    userModel
      .findByUsername(req.params.username)
      .then((result: any) => {
        result = result.map((dataResult: any) => {
          return mapUserData(dataResult);
        });

        return responseHelper(res, result, "Found!").Success();
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
            password: md5(req.body.password + process.env.JWT_SECRET),
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
      .findById(req.body.id)
      .then((result: any) => {
        // Change user password if client request
        if (result.password !== req.body.password) {
          result.password = md5(req.body.password + process.env.JWT_SECRET!);
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
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();
    if (req.params.id === req.jwtDecoded.data.user.id)
      return responseHelper(res, undefined, "You cannot delete your account!").BadRequest();

    userModel
      .delete(req.params.id)
      .then((_) => {
        return responseHelper(res, req.params.id, "Deleted!").Success();
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
            password: md5(req.body.password + process.env.JWT_SECRET!),
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
                  id: result.id,
                  username: result.username,
                  role: result.role,
                },
                process.env.JWT_SECRET!,
                process.env.JWT_LIFETIME!
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
