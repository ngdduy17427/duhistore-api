import { Request, Response } from "express";
import moment from "moment";
import { OrderStatus } from "../../../Constants/Enum";
import orderModel, { IOrder, IOrderProduct } from "../../../Database/Model/Order/order.model";
import productModel, { IProduct } from "../../../Database/Model/Product/product.model";
import { responseHelper } from "../../../Helper/reponse.helper";
import productController from "../Product/product.controller";

const mapOrderData = async (data: IOrder) => {
  const productsMapped: IOrderProduct[] = [];

  for await (const product of data.products) {
    const productFulfilled = (await productModel.findById(product.id)) as IProduct;

    productsMapped.push({ ...product, name: productFulfilled?.name });
  }

  return {
    id: data._id,
    customer: data.customer,
    address: data.address,
    phone: data.phone,
    note: data.note,
    products: productsMapped,
    totalPrice: data.totalPrice,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const orderController = {
  findAll: (_: Request, res: Response) => {
    orderModel
      .findAll()
      .then(async (result: any) => {
        const orderList = [];

        for await (const order of result) {
          const orderMapped = await mapOrderData(order);

          orderList.push(orderMapped);
        }

        return responseHelper(res, orderList, "Found all!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  findById: (req: Request, res: Response) => {
    if (!req.params.id) return responseHelper(res, undefined, "Missing id!").BadRequest();

    orderModel
      .findById(req.params.id)
      .then((result) => {
        return responseHelper(res, result, "Found!").Success();
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
      const productFulfilled = (await productModel.findById(product.id)) as IProduct;

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
      createdAt: moment().valueOf(),
      updatedAt: moment().valueOf(),
    };

    orderModel
      .insert(newData)
      .then(async (_) => {
        for await (const product of req.body.products) {
          await productController.updateProductQuantity(product.id, product.quantity, "increase", "quantityOrder");
        }

        const orderMapped = await mapOrderData(newData);

        return responseHelper(res, orderMapped, "Created!").Created();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
  update: (req: Request, res: Response) => {
    if (Object.keys(req.body).length === 0)
      return responseHelper(res, undefined, "Body can not be empty!").BadRequest();
    if (!req.body.id) return responseHelper(res, undefined, "Data id can not be empty!").BadRequest();

    orderModel
      .findById(req.body.id)
      .then((result: any) => {
        result.customer = req.body.customer;
        result.address = req.body.address;
        result.phone = req.body.phone;
        result.note = req.body.note;
        result.status = req.body.status;
        result.updatedAt = moment().valueOf();

        orderModel
          .update(result)
          .then(async () => {
            if (req.body.status === OrderStatus.DELIVERED) {
              for await (const product of req.body.products) {
                await productController.updateProductQuantity(
                  product.id,
                  product.quantity,
                  "decrease",
                  "quantityOrder"
                );
              }
              for await (const product of req.body.products) {
                await productController.updateProductQuantity(product.id, product.quantity, "decrease", "quantity");
              }
            }

            const orderMapped = await mapOrderData(result);

            return responseHelper(res, orderMapped, "Updated!").Success();
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

    orderModel
      .findById(req.params.id)
      .then((result: any) => {
        orderModel
          .delete(req.params.id)
          .then(async (_) => {
            if (result.status === OrderStatus.PACKING) {
              for await (const product of result.products) {
                await productController.updateProductQuantity(
                  product.id,
                  product.quantity,
                  "decrease",
                  "quantityOrder"
                );
              }
            }

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
  summary: (_: Request, res: Response) => {
    orderModel
      .summary()
      .then((result: any) => {
        return responseHelper(res, result[0], "Summary!").Success();
      })
      .catch((error) => {
        return responseHelper(res, undefined, error.message).InternalServerError();
      });
  },
};

export default orderController;
