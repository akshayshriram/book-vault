import { User } from "../user/userTypes";

export interface Book {
    _id: string;
    title: string;
    author: User;
    // author: string;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}