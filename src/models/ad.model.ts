import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const adSchema = new Schema({
    title: String,
    address: String,
    preview: String,
    city: String,
    price: String,
    imageUrl: String
});

const Ad = mongoose.model('Ad', adSchema);

export { Ad };
