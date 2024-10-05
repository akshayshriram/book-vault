import { config } from "./config";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => { // we can listen what the mongoose returns us by mongoose.connection.on
            console.log('Connected to Database Successfully'); // with the help of keyword connected you get the status that we are connected to db

        })

        mongoose.connection.on('error', (err) => {
            console.log("Error in connecting to Database", err); // same as connected there is error keyword which tells there is error. 

        })

        await mongoose.connect(config.dbUrl as string); //use await to connect with mongo

    }
    catch (err) {
        console.error("Failed to connect to Databse", err); //this helps only at the initial state when there is error in connection 
        process.exit(1); // when there is error in the connection then stop the server
    }
}

export default connectDB;