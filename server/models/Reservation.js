const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
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

        reservationDate: {
            type: Date,
            default: Date.now
        },

        queuePosition: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["waiting", "completed", "cancelled"],
            default: "waiting"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Reservation",
    reservationSchema
);