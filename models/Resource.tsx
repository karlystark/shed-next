import mongoose, { Schema, model, models } from "mongoose";

const resourceSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this resource.'],
        maxlength: [50, 'Name cannot be more than 50 characters.'],
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
    image: {
        type: [String],
        required: [false]
    }
}, {
    timestamps: true,
});

const Resource = models.Resource || model("Resource", resourceSchema);

export default Resource;