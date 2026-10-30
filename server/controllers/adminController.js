const User = require("../models/User");
const Book = require("../models/Book");
const Borrowing = require("../models/Borrowing");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalBooks = await Book.countDocuments();

        const books = await Book.find();

        const totalCopies = books.reduce(
            (sum, book) => sum + book.totalCopies,
            0
        );

        const availableCopies = books.reduce(
            (sum, book) => sum + book.availableCopies,
            0
        );

        const issuedBooks = await Borrowing.countDocuments({
            status: "issued"
        });

        const pendingRequests = await Borrowing.countDocuments({
            status: "pending"
        });

        const fineResult = await Borrowing.aggregate([
            {
                $group: {
                    _id: null,
                    totalFine: { $sum: "$fine" }
                }
            }
        ]);

        const totalFine =
            fineResult.length > 0
                ? fineResult[0].totalFine
                : 0;

        res.json({
            totalUsers,
            totalBooks,
            totalCopies,
            availableCopies,
            issuedBooks,
            pendingRequests,
            totalFine
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};