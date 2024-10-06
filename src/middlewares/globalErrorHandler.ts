import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler: ErrorRequestHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : '',
    });

    // Explicitly returning `void` to satisfy TypeScript's expectations
    return;
};

export default globalErrorHandler;