const express = require("express");

const {
    createReservation,
    getMyReservations,
    getBookReservations,
    cancelReservation
} = require("../controllers/reservationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// Student creates reservation
router.post(
    "/",
    protect,
    authorize("student"),
    createReservation
);


// Student views own reservations
router.get(
    "/my",
    protect,
    authorize("student"),
    getMyReservations
);


// View queue for a particular book
router.get(
    "/book/:bookId",
    protect,
    getBookReservations
);


// Student cancels reservation
router.delete(
    "/:id",
    protect,
    authorize("student"),
    cancelReservation
);


module.exports = router;
