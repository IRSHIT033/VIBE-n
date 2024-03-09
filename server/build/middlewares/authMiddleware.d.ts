/// <reference types="qs" />
import { Request } from 'express';
export interface CustomRequest extends Request {
    user: any;
}
export declare const Auth: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
