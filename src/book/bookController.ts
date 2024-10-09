import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import fs from 'node:fs'
import createHttpError from 'http-errors';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';
import { UploadStream } from 'cloudinary';

const createBook = async (req: Request, res: Response, next: NextFunction) => {

    const { title, genre } = req.body;
    // console.log("files:", req.files);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fileName = files.coverImage[0].filename;

    let bookFileUploadResult, bookFilePath;
    try {
        const bookFileName = files.file[0].filename;
        bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName)
        const bookMimeType = files.file[0].mimetype.split("/").at(-1);

        bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'book-files',
            format: bookMimeType
        })
    } catch {
        return next(createHttpError(500, "PDF File upload failed!"))
    }

    let uploadResults, filePath;
    try {
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)
        uploadResults = await cloudinary.uploader.upload(filePath, {

            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMimeType

        })

    } catch {
        return next(createHttpError(500, "Cover Image upload failed!"))
    }




    console.log("file:", bookFileUploadResult);
    console.log("coverImage:", uploadResults);

    // console.log('userId:', req.userId);

    const _req = req as AuthRequest;

    let newBook;
    try {
        newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResults.secure_url,
            file: bookFileUploadResult.secure_url
        });
    } catch (error) {
        console.log(error);

        return next(createHttpError(500, "Error saving book to database!"));
    }



    // Deleting temperary server files
    try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
    } catch {
        return next(createHttpError(500, "Error while Deleting temporary files!"));
    }

    res.status(201).json({ id: newBook._id })
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {

    const { title, genre } = req.body;
    // console.log("files:", req.files);
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId })

    if (!book) {
        return next(createHttpError(404, "Book Not Found"))
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "You cannot others book!"))
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = ""

    // Update CoverImage
    if (files?.coverImage) {
        const fileName = files.coverImage[0].filename;
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)
        completeCoverImage = fileName

        const uploadResults = await cloudinary.uploader.upload(filePath, {

            filename_override: completeCoverImage,
            folder: 'book-covers',
            format: coverImageMimeType
        })

        completeCoverImage = uploadResults.secure_url;

        await fs.promises.unlink(filePath);
    }

    // Update Pdf 
    let completeFileName = ""
    if (files.file) {
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName)
        const bookMimeType = files.file[0].mimetype.split("/").at(-1);

        completeFileName = bookFileName;

        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: completeFileName,
            folder: 'book-files',
            format: bookMimeType
        })

        completeFileName = bookFileUploadResult.secure_url;

        await fs.promises.unlink(bookFilePath);

    }

    const updateBook = await bookModel.findByIdAndUpdate(
        {
            _id: bookId
        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: completeFileName ? completeFileName : book.file
        },
        { new: true }
    );

    res.json(updateBook);

}

const listBooks = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Add pagination for next advnace development
        const book = await bookModel.find()
        res.json({ book })
    } catch (err) {
        return next(createHttpError(500, "Error while getting a list of books"))
    }

}

const getBook = async (req: Request, res: Response, next: NextFunction) => {

    const bookId = req.params.bookId;
    try {
        // Add pagination for next advnace development
        const book = await bookModel.findOne({ _id: bookId })

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
        res.json({ book })
    } catch (err) {
        return next(createHttpError(500, "Error while getting a single book"))
    }

}

export { createBook, updateBook, listBooks, getBook }