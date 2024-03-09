"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_handler = exports.not_found = void 0;
var not_found = function (req, res, next) {
    var error = new Error("Not Found - ".concat(req.originalUrl));
    res.status(404);
    next(error);
};
exports.not_found = not_found;
var error_handler = function (err, req, res, next) {
    //logEvents(`${err.name}: ${err.message}`, "errorLog.txt");
    var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.error_handler = error_handler;
//# sourceMappingURL=errorMiddleware.js.map