import mongoose, { Document, Schema } from "mongoose";

interface IContact extends Document {
  name: string;
  email: string;
  message: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
