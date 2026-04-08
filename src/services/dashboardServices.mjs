import Record from "../models/recordModels.mjs";

export const totalIncome = async () => {
    const result = await Record.aggregate([
        { 
            $match: { type: "income" } 
        },
        { 
            $group: { 
                _id: null, 
                totalIncome: { $sum: "$amount" } 
            } 
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1
            }
        }
    ]);
    return result[0];
};

export const totalExpense = async () => {
    const result = await Record.aggregate([
        { 
            $match: { type: "expense" } 
        },
        { 
            $group: { 
                _id: null, 
                totalExpense: { $sum: "$amount" } 
            } 
        },
        {
            $project: {
                _id: 0,
                totalExpense: 1
            }
        }
    ]);
    return result[0];
};

export const netBalance = async () => {
    const result = await Record.aggregate([
        {
            $group: {
                _id: null,
                netBalance: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "income"] }, 
                            "$amount", 
                            {
                                $cond: [
                                    { $eq: ["$type", "expense"] },
                                    { $multiply: ["$amount", -1] }, // Subtract expense
                                    0 // Default else 0
                                ]
                            }
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                netBalance: 1
            }
        }
    ]);
    return result[0];
}

export const categoryWise = async () => {
    return await Record.aggregate([
        {
            $group: {
                _id: "$category",
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                totalIncome: {
                    $cond: [{ $gt: ["$totalIncome", 0] }, "$totalIncome", "$$REMOVE"]
                },
                totalExpense: {
                    $cond: [{ $gt: ["$totalExpense", 0] }, "$totalExpense", "$$REMOVE"]
                },
            }
        }
    ]);
};

export const monthlyTrends = async () => {
    return await Record.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalIncome: {
                    $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
                }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ["$totalIncome", "$totalExpense"] }
            }
        }
    ]);
};

export const weeklyTrends = async () => {
    return await Record.aggregate([
        {
            $group: {
                _id: {
                    year: { $isoWeekYear: "$date" },
                    week: { $isoWeek: "$date" }
                },
                totalIncome: {
                    $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
                }
            }
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                week: "$_id.week",
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ["$totalIncome", "$totalExpense"] }
            }
        }
    ]);
};