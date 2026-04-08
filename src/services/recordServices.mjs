import Record from "../models/recordModels.mjs";
import { getRecordID } from "../utils/getId.mjs";
import { paging } from "../utils/page.mjs";

export const createRecord = async (data) => {
    data._id = await getRecordID();
    const record = new Record(data);
    return await record.save();
}

export const updateRecord = async (id, data) => {
    return await Record.findByIdAndUpdate(
        id,
        { $set: data },   // ✅ only updates provided fields
        { new: true, runValidators: true }
    );
}

export const deleteRecord = async (id) => {
    return await Record.findByIdAndDelete(id);
}

export const fetchRecord = async (id) => {
    return await Record.findById(id);
}

export const viewRecords = async(filter, lim, page) => {
    return await paging (
        Record.find(filter),
        lim,
        page,
        Record
    );
}