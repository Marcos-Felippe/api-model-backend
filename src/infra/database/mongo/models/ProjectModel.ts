import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            index: {
                unique: true,
            }
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        owner: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Project", projectSchema);