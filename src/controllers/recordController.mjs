import * as recordServices from "../services/recordServices.mjs";
import { validationResult } from "express-validator";

export const createRecord = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const newRecord = await recordServices.createRecord(req.body);
            return res.status(201).json({ message: "Record created successfully", record: newRecord});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const updateRecord = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const rec = await recordServices.updateRecord(req.params.id, req.body);
            return res.status(200).json({ message: "Record updated successfully", record: rec});
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const deleteRecord = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const del = await recordServices.deleteRecord(req.params.id);
            if(del)
                return res.status(200).json( "Record deleted successfully" );
            else 
                return res.status(404).json( "Record not found" );
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const fetchRecord = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json(errors.array());
        else {
            const output = await recordServices.fetchRecord(req.params.id);
            if(output) 
                return res.status(200).json(output);
            else
                return res.status(404).json("Record not found");
        }
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const viewRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page, limit } = req.query;

        let filter = {};

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate || endDate) {
            filter.date = {};

            if (startDate) filter.date.$gte = (new Date(startDate)).getTime();
            if (endDate) filter.date.$lte = (new Date(endDate)).getTime();
        }

        const records = await recordServices.viewRecords(filter, limit, page);

        return res.status(200).json(records);
    } 
    catch (err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}