import mongoose, { Schema, model, models } from "mongoose";

const friendRequestSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

const FriendRequest = models.FriendRequest || model("FriendRequest", friendRequestSchema);

export default FriendRequest;
