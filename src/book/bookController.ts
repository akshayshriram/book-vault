import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import fs from 'node:fs'
import createHttpError from 'http-errors';
import bookModel from './bookModel';

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

    let newBook;
    try {
        newBook = await bookModel.create({
            title,
            genre,
            author: "6702728066ebe3e77008e6f0",
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

export { createBook }