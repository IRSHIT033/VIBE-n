"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var helmet_1 = require("helmet");
var user_route_js_1 = require("../routes/user.route.js");
var chat_route_js_1 = require("../routes/chat.route.js");
var message_route_js_1 = require("../routes/message.route.js");
var errorMiddleware_js_1 = require("../middlewares/errorMiddleware.js");
var cookieParser = require("cookie-parser");
var compression = require("compression");
var index_js_1 = require("../healthcheckup/index.js");
var swagger_js_1 = require("./swagger.js");
var metric_js_1 = require("./metric.js");
var ratelimit_js_1 = require("./ratelimit.js");
var cors_js_1 = require("./cors.js");
var socketinit_js_1 = require("./socketinit.js");
var serverInit = function (app) {
    var port = process.env.PORT || '5000';
    // Compress all routes
    app.use(compression());
    //security init
    app.use((0, helmet_1.default)());
    //cors config
    (0, cors_js_1.default)(app);
    // Set up rate limiter: maximum of twenty requests per minute
    (0, ratelimit_js_1.default)(app);
    app.use(express.json());
    //parsing cookies
    app.use(cookieParser());
    // monitor the server
    (0, metric_js_1.startMetricsServer)(app);
    //handle routes for user related api requests
    app.use('/api/v1/user', user_route_js_1.default);
    //handle routes for chat related api requests
    app.use('/api/v1/chat', chat_route_js_1.default);
    //handle routes for message related api requests
    app.use('/api/v1/message', message_route_js_1.default);
    //health checkup
    app.use('/healthcheckup', index_js_1.default);
    // swagger api docs
    (0, swagger_js_1.default)(app, port);
    // error handling middleware
    app.use(errorMiddleware_js_1.not_found);
    app.use(errorMiddleware_js_1.error_handler);
    var server = app.listen(port, function () {
        console.log('server is running on ' + port);
    });
    //socket.io config
    (0, socketinit_js_1.default)(server);
};
exports.default = serverInit;
//# sourceMappingURL=serverinit.js.map