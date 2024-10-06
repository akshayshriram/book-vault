import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import createHttpError from 'http-errors';

const createBook = async (req: Request, res: Response, next: NextFunction) => {

    // const { } = req.body;
    // console.log("files:", req.files);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fileName = files.coverImage[0].filename;
    let bookFileUploadResult
    try {
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName)
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

    let uploadResults
    try {
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)
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


    res.json({ message: "create New Book" })
}

export { createBook }