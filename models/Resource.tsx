import mongoose, { Schema, model, models } from "mongoose";
import { CATEGORIES } from "../lib/constants";

const resourceSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this resource.'],
        maxlength: [50, 'Title cannot be more than 50 characters.'],
    },
    quantity: {
        type: Number,
        required: [true, "Please provide a quantity for this resource."],
        min: [1, 'Quantity cannot be less than 1'],
    },
    description: {
        type: String,
        required: [false],
        maxlength:[100, "Description cannot be more than 100 characters"],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for this resource.'],
        enum: CATEGORIES,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const Resource = models.Resource || model("Resource", resourceSchema);

export default Resource;
