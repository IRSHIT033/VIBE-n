import * as client from 'prom-client';
import * as responseTime from 'response-time';
import {Express, Response} from 'express';

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'],
});

export function startMetricsServer(app: Express) {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  console.log('monitoring server available at http://localhost:9090/metrics');

  app.use(
    responseTime((req, res, time) => {
      restResponseTimeHistogram
        .labels({
          method: req.method,
          route: req.url,
          status_code: res.statusCode,
        })
        .observe(time);
    })
  );

  app.get('/metrics', async (_, res: Response) => {
    res.set('Content-Type', client.register.contentType);
    return res.send(await client.register.metrics());
  });
}
