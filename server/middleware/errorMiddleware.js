import { logEvents } from "./logEvents.js";

export const not_found = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const error_handler = (err, req, res, next) => {
  //logEvents(`${err.name}: ${err.message}`, "errorLog.txt");
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
