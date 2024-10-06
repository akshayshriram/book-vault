import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from "bcrypt"

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    // Validation of the data
    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        const error = createHttpError(400, "All fields are required")

        return next(error);
    }
    // Database Call
    const user = await userModel.findOne({ email });

    if (user) {
        const error = createHttpError(400, "User already Exists with this email...");

        return next(error);
    }

    const hasdedPassword = await bcrypt.hash(password, 10);



    res.json({ message: "New user Registered..." });
};

export { createUser };