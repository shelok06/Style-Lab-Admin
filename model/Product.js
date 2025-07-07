import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    picture: { type: String, required: true },
    price: {type: Number, required: true},
    product: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    AddedOn: { type: Date, default: Date.now },
})

export default mongoose.models.Product || model("Product", ProductSchema)