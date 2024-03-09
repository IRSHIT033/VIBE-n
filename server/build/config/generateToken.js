"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var generateToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map