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
            User.find({ role }).select("-password"),
            lim,
            page,
            User
        );
    }
    else {
        return await paging(
            User.find().select("-password"),
            lim,
            page,
            User
        );
    }
}

export const getUser = async (email_id) => {
    return await User.findOne({ email_id }).select("-password");
}
