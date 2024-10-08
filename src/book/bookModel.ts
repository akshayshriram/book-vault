import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: true
    },
    author: {
        // type: String,
        // required: true
        type: mongoose.Schema.Types.ObjectId,
        // add ref
        ref: "User",
        required: true,
    },
    coverImage: {
        type: String,
        required: true
    },
    file: {
        type: String, // Update this to be a single String type
        required: true
    },
    genre: {
        type: String, // Update this to be a single String type
        required: true
    }
}, { timestamps: true })


export default mongoose.model<Book>("Book", bookSchema)