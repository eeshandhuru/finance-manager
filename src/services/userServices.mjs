import User from '../models/userModels.mjs';
import { hashPassword } from '../utils/authUtils.mjs';
import { paging } from '../utils/page.mjs';

export const createUser = async (data) => {
    if(data.role)
        data.role = data.role.toLowerCase();
    data.password = await hashPassword(data.password);
    const user = new User(data);
    return await user.save();
}

export const createViewer = async (data) => {
    data.role = 'viewer';
    data.password = await hashPassword(data.password);
    const user = new User(data);
    return await user.save();
}

export const changeName = async (email_id, new_name) => {
    return await User.findOneAndUpdate(
        { email_id },
        { $set: { name: new_name } }
    );
}

export const changeRole = async (data) => {
    return await User.findOneAndUpdate(
        { email_id: data.email_id },
        { $set: { role: data.role.toLowerCase() } }
    );
}

export const changePassword = async (email_id, new_pass) => {
    return await User.findOneAndUpdate(
        { email_id },
        { $set: { password: await hashPassword(new_pass) } }
    );
}

export const deleteUser = async (email_id) => {
    return await User.findOneAndDelete({ email_id });
}

export const getUserList = async (role, lim, page) => {      
    if(role) {
        role = role.toLowerCase();
        return await paging(
            User.aggregate([
                {
                    $match: { role }
                },
                {
                    $addFields: {
                        isActive: {
                            $cond: {
                                if: { $eq: ["$logout_time", null] }, // If logout time is null
                                then: false,                        // isActive = false
                                else: {
                                    $cond: {
                                        if: { $lt: ["$$NOW", "$logout_time"] }, // If current time < logout time
                                        then: true,                                // isActive = true
                                        else: false                                // Else (current time > logout time), false
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: { password: 0 }
                }
            ]),
            lim,
            page,
            User
        );
    }
    else {
        return await paging(
            User.aggregate([
                {
                    $addFields: {
                        isActive: {
                            $cond: {
                                if: { $eq: ["$logout_time", null] }, // If logout time is null
                                then: false,                        // isActive = false
                                else: {
                                    $cond: {
                                        if: { $lt: ["$$NOW", "$logout_time"] }, // If current time < logout time
                                        then: true,                                // isActive = true
                                        else: false                                // Else (current time > logout time), false
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: { password: 0 }
                }
            ]),
            lim,
            page,
            User
        );
    }
}
/*
// This can be used in your dashboard or user list services
const activeStatus = await User.aggregate([
    { $match: { email_id: "target@example.com" } },
    {
        $project: {
            _id: 0,
            email_id: 1,
            isActive: { 
                $gt: ["$login_time", { $ifNull: ["$logout_time", new Date(0)] }] 
            }
        }
    }
]);
*/
export const getUser = async (email_id) => {
    const result = User.aggregate([
        {
            $match: { email_id }
        },
        {
            $addFields: {
                isActive: {
                    $cond: {
                        if: { $eq: ["$logout_time", null] }, // If logout time is null
                        then: false,                        // isActive = false
                        else: {
                            $cond: {
                                if: { $lt: ["$$NOW", "$logout_time"] }, // If current time < logout time
                                then: true,                                // isActive = true
                                else: false                                // Else (current time > logout time), false
                            }
                        }
                    }
                }
            }
        },
        {
            $project: { password: 0 }
        }
    ])
    return result[0];
}
