import mongoose, { Schema } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  contact_number: Number;
  isAdmin: any;
}

//Defining user schema
const user: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact_number: { type: Number },
  isAdmin: { type: Boolean, default: false },
});

// Export model
export default mongoose.model<User>("New_Users", user);
