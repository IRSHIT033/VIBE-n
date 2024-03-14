import {Request, Response, NextFunction} from 'express';

export const not_found = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const error_handler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //logEvents(`${err.name}: ${err.message}`, "errorLog.txt");
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(err.stack);
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
