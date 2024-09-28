import mongoose, { Document, Schema } from "mongoose";

interface IAddress {
  name: string;
  mobile: string;
  email: string;
  flat: string;
  locality: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  createdAt?: string;
  estimatedTime?: string;
}

interface IOrder extends Document {
  image: string; // store image as a base64 string
  addFrame: boolean;
  address: IAddress;
}

const AddressSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  flat: { type: String, required: true },
  locality: { type: String, required: true },
  landmark: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderSchema: Schema = new Schema({
  image: {
    type: String, // store image as a base64 string
    required: true,
  },
  addFrame: {
    type: Boolean,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
