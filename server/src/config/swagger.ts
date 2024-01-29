import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUI from "swagger-ui-express";
import {Express,Response} from "express"

const options:swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Vibe-n API docs",
      version: "1.0.0",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./healthcheckup/index.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app:Express, port:string) {
  //swagger page
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  //docs in json format
  app.get("docs.json", (_, res:Response) => {
    res.setHeader("Content-type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
