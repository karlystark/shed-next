import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username.'],
        unique: true,
        maxlength: [30, 'Username cannot be more than 30 characters.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        unique: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password.'],
    },
    color: {
        type: String,
        required: false,
    },
    icon: {
        type: String,
        required: false,
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
}, {
    timestamps: true,
});

const User = models.User || model("User", userSchema);

export default User;
