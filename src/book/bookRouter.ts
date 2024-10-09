import express from "express";
import { createBook, getBook, listBooks, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})


// Routes
bookRouter.post('/',
    authenticate,
    upload.fields([
        {
            name: 'coverImage', maxCount: 1
        },
        {
            name: 'file', maxCount: 1
        }
    ]), createBook);

bookRouter.patch('/:bookId',
    authenticate,
    upload.fields([
        {
            name: 'coverImage', maxCount: 1
        },
        {
            name: 'file', maxCount: 1
        }
    ]), updateBook);


bookRouter.get('/', listBooks);

bookRouter.get('/:bookId', getBook)



export default bookRouter;