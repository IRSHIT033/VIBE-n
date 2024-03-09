import * as express from 'express';

import helmet from 'helmet';
import router from '../routes/user.route';
import chatRouter from '../routes/chat.route';
import messageRouter from '../routes/message.route';
import {not_found, error_handler} from '../middlewares/errorMiddleware';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import health_checkup_route from '../healthcheckup/index';
import swaggerDocs from './swagger';
import {startMetricsServer} from './metric';
import rateLimitConfig from './ratelimit';
import CORSconfig from './cors';
import socketInit from './socketinit';

const serverInit = (app: express.Express) => {
  const port = process.env.PORT || '5000';

  // Compress all routes
  app.use(compression());

  //security init
  app.use(helmet());

  //cors config
  CORSconfig(app);

  // Set up rate limiter: maximum of twenty requests per minute
  rateLimitConfig(app);

  app.use(express.json());

  //parsing cookies
  app.use(cookieParser());

  // monitor the server
  startMetricsServer(app);

  //handle routes for user related api requests
  app.use('/api/v1/user', router);
  //handle routes for chat related api requests
  app.use('/api/v1/chat', chatRouter);
  //handle routes for message related api requests
  app.use('/api/v1/message', messageRouter);

  //health checkup
  app.use('/healthcheckup', health_checkup_route);
  // swagger api docs
  swaggerDocs(app, port);

  // error handling middleware
  app.use(not_found);
  app.use(error_handler);

  const server = app.listen(port, () => {
    console.log('server is running on ' + port);
  });

  //socket.io config
  socketInit(server);
};

export default serverInit;
