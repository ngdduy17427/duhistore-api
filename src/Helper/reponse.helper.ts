import { Response, response } from "express";
import HttpStatusCode from "./HttpStatusCode";

export const responseHelper = (res: Response, dataRes: any = undefined, messageRes: string = "") => {
  const ResponseSuccess = (statusCode: HttpStatusCode) => {
    const initRes = {
      success: {
        data: dataRes,
        message: messageRes,
        statusCode: statusCode,
      },
      timestamps: new Date(),
    };

    return res.status(statusCode).json({ ...initRes });
  };
  const ResponseError = (statusCode: HttpStatusCode) => {
    const initRes = {
      error: {
        data: dataRes,
        message: messageRes,
        statusCode: statusCode,
      },
      timestamps: new Date(),
    };

    return res.status(statusCode).json({ ...initRes });
  };

  // Response Success
  const Success = () => ResponseSuccess(HttpStatusCode.OK);
  const Created = () => ResponseSuccess(HttpStatusCode.CREATED);
  const NoContent = () => ResponseSuccess(HttpStatusCode.NO_CONTENT);

  // Response Error
  const BadRequest = () => ResponseError(HttpStatusCode.BAD_REQUEST);
  const Unauthorized = () => ResponseError(HttpStatusCode.UNAUTHORIZED);
  const NotFound = () => ResponseError(HttpStatusCode.NOT_FOUND);
  const InternalServerError = () => ResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR);

  // Reponse File
  const ResponseFile = (file: any) => {
    res.header("Content-type", file.type);

    return res.status(200).sendFile(file.path, { root: "." });
  };

  return {
    Success,
    Created,
    NoContent,
    BadRequest,
    Unauthorized,
    NotFound,
    InternalServerError,
    ResponseFile,
  };
};
