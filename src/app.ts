import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Example Route
app.get("/", (req, res, next) => {
    const error = createHttpError(400, "Something went wrong");
    next(error); // pass error to the global error handler
});


// Use the error handler middleware
app.use(globalErrorHandler);

export default app;
