import { Request, Response } from "express";
import moment from "moment";
import productModel, { EActionProductQuantity, EProductQuantity, IProduct } from "../Model/product.model";
import { responseHelper } from "../../../Helper/reponse.helper";

const productController = {
  findAll: (req: Request, res: Response) => {
    productModel
      .findAll(req.query)
      .then((resultData: any) => {
        return responseHelper(res, resultData, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    productModel
      .findById(req.params._id)
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

    const newData: IProduct = {
      name: req.body.name,
      price: parseInt(req.body.price),
      quantity: 0,
      quantityOrder: 0,
      quantityPurchase: 0,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };

    productModel
      .insert(newData)
      .then((resultData) => {
        return responseHelper(res, resultData, "Created!").Created();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body._id) return responseHelper(res, undefined, "Data id can not be empty!").BadRequest();

    const dataToUpdate: any = {
      name: req.body.name,
      price: parseInt(req.body.price),
      updatedAt: moment().valueOf(),
    };

    productModel
      .update(req.body._id, dataToUpdate)
      .then((resultData) => {
        return responseHelper(res, resultData, "Updated!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  updateProductQuantity: async (
    id: string,
    quantity: number | string,
    action: EActionProductQuantity,
    type: EProductQuantity
  ) => {
    await productModel.findById(id).then(async (result: any) => {
      result.updatedAt = moment().valueOf();

      if (action === EActionProductQuantity.INCREMENT) result[type] += parseInt(quantity as string);
      if (action === EActionProductQuantity.DECREMENT) result[type] -= parseInt(quantity as string);

      await productModel.update(result._id, result);
    });
  },
};

export default productController;
