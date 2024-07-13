// const mongoose = require("mongoose");
import mongoose from "mongoose";

const DBConnection = () => {
  mongoose
    .connect(process.env.MONGOURIUSERS!)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((error: any) => {
      console.log(error.message);
    });
};

export default DBConnection;
