import * as dashboardServices from "../services/dashboardServices.mjs";

export const totalIncome = async (req, res) => {
    try {
        const result = await dashboardServices.totalIncome();
        return res.status(200).json(result);
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const totalExpense = async (req, res) => {
    try {
        const result = await dashboardServices.totalExpense();
        return res.status(200).json(result);
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const netBalance = async (req, res) => {
    try {
        const result = await dashboardServices.netBalance();
        return res.status(200).json(result);
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}

export const categoryWise = async (req, res) => {
    try {
        const result = await dashboardServices.categoryWise();
        return res.status(200).json(result);
    }
    catch(err) {
        console.error(err.stack);
        return res.status(500).json(err.message);
    }
}