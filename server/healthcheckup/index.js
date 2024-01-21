import { Router } from "express";

const health_checkup_route = Router();

health_checkup_route.get("/", async (_, res) => {
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
});

export default health_checkup_route;
