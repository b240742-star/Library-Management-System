const express = require("express");

const {
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// Anyone can view books
router.get("/", getBooks);

router.get("/:id", getBookById);

// Only librarian and admin can add books
router.post(
    "/",
    protect,
    authorize("librarian", "admin"),
    addBook
);

// Only librarian and admin can update books
router.put(
    "/:id",
    protect,
    authorize("librarian", "admin"),
    updateBook
);

// Only librarian and admin can delete books
router.delete(
    "/:id",
    protect,
    authorize("librarian", "admin"),
    deleteBook
);

module.exports = router;