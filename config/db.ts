// const mongoose = require("mongoose");
import mongoose from "mongoose";

const DBConnection = () => {
  mongoose
    .connect(process.env.MONGOURIUSERS!, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((error: any) => {
      console.log(error.message);
    });
};

export default DBConnection;
