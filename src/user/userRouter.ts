import express from "express";
import { createUser } from "./userController";

const userRotuer = express.Router();


// Routes
userRotuer.post('/register', createUser)

export default userRotuer;