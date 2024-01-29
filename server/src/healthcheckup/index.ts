import { Router } from "express";
import asyncHandler from "express-async-handler";

const health_checkup_route = Router();

/**
 * @swagger
 * /healthcheckup:
 *  get:
 *     tags:
 *     - Health Checkup
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
health_checkup_route.get(
  "/",
  asyncHandler(async (_, res) => {
    const healthCheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: "OK",
      timestamp: Date.now(),
    };
    try {
      res.send(healthCheck);
    } catch (error) {
      healthCheck.message = error;
      res.status(503).send();
    }
  })
);

export default health_checkup_route;
