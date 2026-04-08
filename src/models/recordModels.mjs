import { Schema, model } from "mongoose";
import { transactionTypes } from "../utils/constants.mjs";

const recordSchema = new Schema({
    _id: {
        type: Number
    },
    amount: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: transactionTypes,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    }
});

const Record = model('Record', recordSchema, 'records');

export default Record;