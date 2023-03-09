import { Response } from "express";
export const successHandler = (
  res: Response,
  statusCode: number,
  success: Boolean,
  data: object,
  message: string
) => {
  res.set("Cache-control", "public, max-age=30");
  return res.status(statusCode).json({
    success: success ? success : false,
    data: data ? data : {},
    message: message ? message : "",
  });
};

export const errorHandler = (
  res: Response,
  statusCode: number,
  success: boolean,
  error: object,
  message: string
) => {
  return res.status(statusCode).json({
    success: success ? success : false,
    error: error ? error : {},
    message: message ? message : "",
  });
};
