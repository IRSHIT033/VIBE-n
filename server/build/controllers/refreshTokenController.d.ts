/// <reference types="qs" />
/// <reference types="express" />
declare const handleRefreshToken: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default handleRefreshToken;
