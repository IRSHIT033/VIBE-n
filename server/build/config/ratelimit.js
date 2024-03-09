"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_rate_limit_1 = require("express-rate-limit");
var rateLimitConfig = function (app) {
    var limiter = (0, express_rate_limit_1.default)({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
    });
    // Apply rate limiter to all requests
    app.use(limiter);
};
exports.default = rateLimitConfig;
//# sourceMappingURL=ratelimit.js.map