const mongoose = require("mongoose");

const borrowingSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        issueDate: {
            type: Date
        },

        dueDate: {
            type: Date
        },

        returnDate: {
            type: Date
        },

        status: {
            type: String,
            enum: ["pending", "issued", "returned"],
            default: "pending"
        },

        fine: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Borrowing", borrowingSchema);