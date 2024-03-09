"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var db_1 = require("./config/db");
var serverinit_1 = require("./config/serverinit");
dotenv.config();
(0, db_1.default)()
    .then(function () {
    var app = express();
    (0, serverinit_1.default)(app);
})
    .catch(function (error) {
    throw new Error("Error has been occured while configuring Database ".concat(error));
});
//# sourceMappingURL=index.js.map