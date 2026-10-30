const Book = require("../models/Book");

// Add a new book
const addBook = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            category,
            totalCopies,
            shelfLocation
        } = req.body;

        if (!title || !author || !isbn || !category || !totalCopies) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const bookExists = await Book.findOne({ isbn });

        if (bookExists) {
            return res.status(400).json({
                message: "Book with this ISBN already exists"
            });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            category,
            totalCopies,
            availableCopies: totalCopies,
            shelfLocation
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.json({
            count: books.length,
            books
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get one book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json(book);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Update a book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: "Book updated successfully",
            book: updatedBook
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete a book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};