"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var CORSconfig = function (app) {
    app.use(cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: 'GET, PUT, POST',
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'device-remember-token',
            'Access-Control-Allow-Origin',
            'Origin',
            'Accept',
        ],
    }));
};
exports.default = CORSconfig;
//# sourceMappingURL=cors.js.map