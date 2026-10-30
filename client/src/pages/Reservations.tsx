
import { useEffect, useState } from "react";
import {
    getMyReservations,
    cancelReservation
} from "../services/reservationService";

interface Reservation {
    _id: string;
    book: {
        title: string;
        author: string;
        isbn: string;
    };
    reservationDate: string;
    queuePosition: number;
    status: "waiting" | "completed" | "cancelled";
}

function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setError("");
            const data = await getMyReservations();
            setReservations(data.reservations);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load reservations"
            );
        }
    };

    const handleCancel = async (id: string) => {
        try {
            setError("");
            setMessage("");

            await cancelReservation(id);
            setMessage("Reservation cancelled successfully!");
            await loadReservations();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to cancel reservation"
            );
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>My Reservations</h1>
            <p>View your reserved books and queue positions.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            {reservations.length === 0 ? (
                <p>You have no reservations.</p>
            ) : (
                <table border={1} cellPadding={8}>
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Reservation Date</th>
                            <th>Queue Position</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation._id}>
                                <td>{reservation.book.title}</td>
                                <td>{reservation.book.author}</td>
                                <td>{reservation.book.isbn}</td>
                                <td>
                                    {new Date(
                                        reservation.reservationDate
                                    ).toLocaleDateString()}
                                </td>
                                <td>{reservation.queuePosition}</td>
                                <td>{reservation.status}</td>
                                <td>
                                    {reservation.status === "waiting" ? (
                                        <button
                                            onClick={() =>
                                                handleCancel(reservation._id)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Reservations;
