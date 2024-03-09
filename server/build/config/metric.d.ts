import * as client from 'prom-client';
import { Express } from 'express';
export declare const restResponseTimeHistogram: client.Histogram<"route" | "method" | "status_code">;
export declare const databaseResponseTimeHistogram: client.Histogram<"operation" | "success">;
export declare function startMetricsServer(app: Express): void;
