import client from "prom-client";
import responseTime from "response-time";

export const restResponseTimeHistogram = new client.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "db_response_time_duration_seconds",
  help: "Database response time in seconds",
  labelNames: ["operation", "success"],
});

export function startMetricsServer(app) {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  console.log(`monitoring server available at http://localhost:9090/metrics`);

  app.use(
    responseTime((req, res, time) => {
      restResponseTimeHistogram
        .labels({
          method: req.method,
          route: req.originalUrl,
          status_code: res.statusCode,
        })
        .observe(time);
    })
  );

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  });
}
