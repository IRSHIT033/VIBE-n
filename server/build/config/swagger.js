"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUI = require("swagger-ui-express");
var options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Vibe-n API docs',
            version: '1.0.0',
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './healthcheckup/index.js'],
};
var swaggerSpec = swaggerJSDoc(options);
function swaggerDocs(app, port) {
    //swagger page
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    //docs in json format
    app.get('docs.json', function (_, res) {
        res.setHeader('Content-type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log("Docs available at http://localhost:".concat(port, "/docs"));
}
exports.default = swaggerDocs;
//# sourceMappingURL=swagger.js.map