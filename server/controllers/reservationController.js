const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

// Student reserves a book
const createReservation = async (req, res) => {
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

        // Reservation is only needed when book is unavailable
        if (book.availableCopies > 0) {
            return res.status(400).json({
                message: "Book is currently available. You can request it directly."
            });
        }

        // Check existing reservation
        const existingReservation =
            await Reservation.findOne({
                student: req.user._id,
                book: bookId,
                status: "waiting"
            });

        if (existingReservation) {
            return res.status(400).json({
                message: "You already have a reservation for this book"
            });
        }

        // Find last position in queue
        const lastReservation =
            await Reservation.findOne({
                book: bookId,
                status: "waiting"
            }).sort({
                queuePosition: -1
            });

        const queuePosition = lastReservation
            ? lastReservation.queuePosition + 1
            : 1;

        const reservation =
            await Reservation.create({
                student: req.user._id,
                book: bookId,
                queuePosition
            });

        res.status(201).json({
            message: "Book reserved successfully",
            reservation
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Student views their reservations
const getMyReservations = async (req, res) => {
    try {
        const reservations =
            await Reservation.find({
                student: req.user._id
            })
                .populate(
                    "book",
                    "title author isbn category"
                )
                .sort({
                    queuePosition: 1
                });

        res.json({
            count: reservations.length,
            reservations
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// View reservation queue for a book
const getBookReservations = async (req, res) => {
    try {
        const reservations =
            await Reservation.find({
                book: req.params.bookId,
                status: "waiting"
            })
                .populate(
                    "student",
                    "name email department"
                )
                .sort({
                    queuePosition: 1
                });

        res.json({
            count: reservations.length,
            reservations
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Student cancels reservation
const cancelReservation = async (req, res) => {
    try {
        const reservation =
            await Reservation.findById(
                req.params.id
            );

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        if (
            reservation.student.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only cancel your own reservation"
            });
        }

        if (reservation.status !== "waiting") {
            return res.status(400).json({
                message: "Reservation cannot be cancelled"
            });
        }

        reservation.status = "cancelled";

        await reservation.save();

        res.json({
            message: "Reservation cancelled successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createReservation,
    getMyReservations,
    getBookReservations,
    cancelReservation
};