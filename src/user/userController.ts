import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    // Validation of the data
    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        const error = createHttpError(400, "All fields are required")

        return next(error);
    }

    res.json({ message: "New user Registered..." });
};

export { createUser };