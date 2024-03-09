import * as cors from 'cors';
import {Express} from 'express';

const CORSconfig = (app: Express) => {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN!,
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
    } as cors.CorsOptions)
  );
};
export default CORSconfig;
