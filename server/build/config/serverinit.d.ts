/// <reference types="express-serve-static-core" />
/// <reference types="cookie-parser" />
/// <reference types="compression" />
import * as express from 'express';
declare const serverInit: (app: express.Express) => void;
export default serverInit;
