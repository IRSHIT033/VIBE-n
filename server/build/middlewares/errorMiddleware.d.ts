import { Request, Response, NextFunction } from 'express';
export declare const not_found: (req: Request, res: Response, next: NextFunction) => void;
export declare const error_handler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
