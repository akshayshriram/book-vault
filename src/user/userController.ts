import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from "bcrypt"
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { access } from 'fs';

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword
    })

    // JWT token generation
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: "7d" })

    res.json({ accessToken: token });
};

export { createUser };