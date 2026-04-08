import { Schema, model } from "mongoose";

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  value: { type: Number, default: 0 }
});

const Counter = model('Counter', CounterSchema, 'counters');

export const getRecordID = async () => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'recordId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    return counter.value;
  } catch (error) {
    throw error;
  }
};