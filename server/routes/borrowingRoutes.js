const express = require("express");

const {
    requestBook,
    getBorrowingRequests,
    approveRequest,
    returnBook,
    getMyBorrowingHistory
} = require("../controllers/borrowingController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Student requests a book
router.post(
    "/request",
    protect,
    authorize("student"),
    requestBook
);


// Librarian/Admin views pending requests
router.get(
    "/requests",
    protect,
    authorize("librarian", "admin"),
    getBorrowingRequests
);


// Librarian/Admin approves request
router.put(
    "/approve/:id",
    protect,
    authorize("librarian", "admin"),
    approveRequest
);


// Student returns a book
router.put(
    "/return/:id",
    protect,
    authorize("student"),
    returnBook
);


// Student views borrowing history
router.get(
    "/my-history",
    protect,
    authorize("student"),
    getMyBorrowingHistory
);


module.exports = router;
// Student returns a book
router.put(
    "/return/:id",
    protect,
    authorize("student"),
    returnBook
);


module.exports = router;