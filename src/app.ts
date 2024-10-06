import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

app.use(express.json());

// Example Route
app.get("/", (req, res, next) => {
    res.json({ message: "Welcome to BookVault" });
});


app.use('/api/users', userRouter)


// Use the error handler middleware
app.use(globalErrorHandler);

export default app;
