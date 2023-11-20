import { Request, Response } from "express";
import moment from "moment";
import productModel, { IProduct } from "../../../Database/Model/Product/product.model";
import { responseHelper } from "../../../Helper/reponse.helper";

const mapProductData = (data: IProduct) => {
  return {
    id: data._id,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    quantityOrder: data.quantityOrder,
    quantityPurchase: data.quantityPurchase,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const productController = {
  findAll: (req: Request, res: Response) => {
    productModel
      .findAll()
      .then((result: any) => {
        result = result.map((dataResult: any) => {
          return mapProductData(dataResult);
        });

        return responseHelper(res, result, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    productModel
      .findById(req.params.id)
      .then((result) => {
        return responseHelper(res, result, "Found!").Success();
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
      .then((_) => {
        return responseHelper(res, newData, "Created!").Created();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.id) return responseHelper(res, undefined, "Data id can not be empty!").BadRequest();

    productModel
      .findById(req.body.id)
      .then((result: any) => {
        result.name = req.body.name;
        result.price = parseInt(req.body.price);
        result.updatedAt = moment().valueOf();

        productModel
          .update(result)
          .then(() => {
            return responseHelper(res, result, "Updated!").Success();
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
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    productModel
      .findById(req.params.id)
      .then(() => {
        productModel
          .delete(req.params.id)
          .then((_) => {
            return responseHelper(res, req.params.id, "Deleted!").Success();
          })
          .catch((error) => {
            return responseHelper(res, undefined, error.message).InternalServerError();
          });
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  updateProductQuantity: async (
    id: string,
    quantity: number | string,
    action: "increase" | "decrease",
    type: "quantity" | "quantityOrder" | "quantityPurchase"
  ) => {
    await productModel.findById(id).then(async (result: any) => {
      result.updatedAt = moment().valueOf();

      if (action === "increase") result[type] += parseInt(quantity as string);
      if (action === "decrease") result[type] -= parseInt(quantity as string);

      await productModel.update(result);
    });
  },
};

export default productController;
