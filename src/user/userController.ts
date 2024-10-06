import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from "bcrypt"
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from './userTypes';

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    // Validation of the data
    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        const error = createHttpError(400, "All fields are required")

        return next(error);
    }

    // Database Call
    try {
        const user = await userModel.findOne({ email });

        if (user) {
            const error = createHttpError(400, "User already Exists with this email...");

            return next(error);
        }

    } catch (err) {
        return next(createHttpError(500, "Error while fetching user"))
    }

    // Create has for the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    let newUser: User;

    try {
        newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })
    } catch (err) {
        return next(createHttpError(500, "Error while creating user"))
    }

    // JWT token generation
    try {
        const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: "7d" })

        res.json({ accessToken: token });

    } catch (err) {
        return next(createHttpError(500, "Error while signing JWT token"))
    }


};

export { createUser };