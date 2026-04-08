import { Schema, model } from "mongoose";
import { roles } from "../utils/constants.mjs";

const userSchema = new Schema({
    email_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    login_time: {
        type: Date,
    },
    last_active: {
        type: Date,
    },
    logout_time: {
        type: Date,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        default: roles[0]
    },
    isActive: {
        type: Boolean
    }
});

const User = model('User', userSchema, 'users');

export default User;