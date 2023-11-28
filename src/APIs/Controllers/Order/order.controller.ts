import { Request, Response } from "express";
import moment from "moment";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../../Constants/Enum";
import orderModel, { IOrder } from "../../../Database/Model/Order/order.model";
import productModel, {
  EActionProductQuantity,
  EProductQuantity,
  IProduct,
} from "../../../Database/Model/Product/product.model";
import { responseHelper } from "../../../Helper/reponse.helper";
import productController from "../Product/product.controller";

const orderController = {
  findAll: (req: Request, res: Response) => {
    orderModel
      .findAll(req.query)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    orderModel
      .findById(req.params._id)
      .then((resultData) => {
        return responseHelper(res, resultData, "Found!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  insert: async (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();

    let totalPrice = 0;

    for await (const [index, product] of req.body.products.entries()) {
      const productFulfilled = (await productModel.findById(product._id)) as IProduct;

      req.body.products[index]._id = new ObjectId(productFulfilled._id);
      req.body.products[index].totalPrice = product.quantity * productFulfilled.price;

      totalPrice += product.quantity * productFulfilled.price;
    }

    const newData: IOrder = {
      customer: req.body.customer,
      address: req.body.address,
      phone: req.body.phone,
      note: req.body.note,
      products: req.body.products,
      totalPrice: totalPrice,
      status: OrderStatus.PACKING,
      isDelivered: false,
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };

    orderModel
      .insert(newData)
      .then(async (resultData: any) => {
        for await (const product of resultData.products) {
          await productController.updateProductQuantity(
            product._id,
            product.quantity,
            EActionProductQuantity.INCREMENT,
            EProductQuantity.QUANTITY_ORDER
          );
        }

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

    orderModel
      .findById(req.body._id)
      .then((resultDataFound: any) => {
        const isDeliveredTemp = resultDataFound.isDelivered;

        resultDataFound.customer = req.body.customer;
        resultDataFound.address = req.body.address;
        resultDataFound.phone = req.body.phone;
        resultDataFound.note = req.body.note;
        resultDataFound.status = req.body.status;
        resultDataFound.updatedAt = moment().valueOf();

        if (req.body.status === OrderStatus.DELIVERED) resultDataFound.isDelivered = true;

        orderModel
          .update(resultDataFound._id, resultDataFound)
          .then(async (resultData: any) => {
            // Update Product quantity
            if (!isDeliveredTemp && resultData.status === OrderStatus.DELIVERED) {
              for await (const product of resultData.products) {
                await productController.updateProductQuantity(
                  product._id,
                  product.quantity,
                  EActionProductQuantity.DECREMENT,
                  EProductQuantity.QUANTITY_ORDER
                );
                await productController.updateProductQuantity(
                  product._id,
                  product.quantity,
                  EActionProductQuantity.DECREMENT,
                  EProductQuantity.QUANTITY
                );
              }
            }

            return responseHelper(res, resultData, "Updated!").Success();
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
    if (!req.params._id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    orderModel
      .delete(req.params._id)
      .then(async (resultData: any) => {
        if (!resultData.isDelivered) {
          for await (const product of resultData.products) {
            await productController.updateProductQuantity(
              product._id,
              product.quantity,
              EActionProductQuantity.DECREMENT,
              EProductQuantity.QUANTITY_ORDER
            );
          }
        }

        return responseHelper(res, resultData, "Deleted!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  summary: (_: Request, res: Response) => {
    orderModel
      .summary()
      .then((resultData: any) => {
        return responseHelper(res, resultData, "Summary!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default orderController;
