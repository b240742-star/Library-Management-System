const Borrowing = require("../models/Borrowing");
const Book = require("../models/Book");

// Student requests a book
const requestBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({
                message: "Book ID is required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                message: "Book is currently unavailable"
            });
        }

        const existingRequest = await Borrowing.findOne({
            student: req.user._id,
            book: bookId,
            status: {
                $in: ["pending", "issued"]
            }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already have an active request for this book"
            });
        }

        const borrowing = await Borrowing.create({
            student: req.user._id,
            book: bookId,
            status: "pending"
        });

        res.status(201).json({
            message: "Book request submitted successfully",
            borrowing
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Librarian gets all pending requests
const getBorrowingRequests = async (req, res) => {
    try {
        const requests = await Borrowing.find({
            status: "pending"
        })
            .populate("student", "name email department")
            .populate("book", "title author isbn");

        res.json({
            count: requests.length,
            requests
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Librarian approves a book request
const approveRequest = async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(
            req.params.id
        );

        if (!borrowing) {
            return res.status(404).json({
                message: "Borrowing request not found"
            });
        }

        if (borrowing.status !== "pending") {
            return res.status(400).json({
                message: "Request has already been processed"
            });
        }

        const book = await Book.findById(
            borrowing.book
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                message: "No copies of this book are available"
            });
        }

        const issueDate = new Date();

        const dueDate = new Date(issueDate);

        // Student gets 7 days to return the book
        dueDate.setDate(
            dueDate.getDate() + 7
        );

        borrowing.issueDate = issueDate;
        borrowing.dueDate = dueDate;
        borrowing.status = "issued";

        await borrowing.save();

        // Reduce available copies
        book.availableCopies -= 1;

        await book.save();

        res.json({
            message: "Book issued successfully",
            borrowing
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Student returns a book
const returnBook = async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(
            req.params.id
        );

        if (!borrowing) {
            return res.status(404).json({
                message: "Borrowing record not found"
            });
        }

        if (borrowing.status !== "issued") {
            return res.status(400).json({
                message: "This book is not currently issued"
            });
        }

        // Student can only return their own book
        if (
            borrowing.student.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only return your own books"
            });
        }

        const returnDate = new Date();

        // Calculate late days
        const lateDays = Math.max(
            0,
            Math.ceil(
                (returnDate - borrowing.dueDate) /
                (1000 * 60 * 60 * 24)
            )
        );

        // Fine = ₹10 per late day
        const fine = lateDays * 10;

        borrowing.returnDate = returnDate;
        borrowing.status = "returned";
        borrowing.fine = fine;

        await borrowing.save();

        // Increase available copies
        const book = await Book.findById(
            borrowing.book
        );

        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        res.json({
            message: "Book returned successfully",
            lateDays,
            fine,
            borrowing
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Student views borrowing history
const getMyBorrowingHistory = async (req, res) => {
    try {
        const history = await Borrowing.find({
            student: req.user._id
        })
            .populate(
                "book",
                "title author isbn category"
            )
            .sort({
                createdAt: -1
            });

        res.json({
            count: history.length,
            history
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    requestBook,
    getBorrowingRequests,
    approveRequest,
    returnBook,
    getMyBorrowingHistory
};