import { useEffect, useState } from "react";
import {
    getMyBorrowingHistory,
    returnBook
} from "../services/borrowingService";

interface Borrowing {
    _id: string;

    book: {
        title: string;
        author: string;
        isbn: string;
        category: string;
    };

    issueDate?: string;
    dueDate?: string;
    returnDate?: string;

    status: "pending" | "issued" | "returned";

    fine: number;
}

function MyBorrowings() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setError("");

            const data = await getMyBorrowingHistory();

            setBorrowings(data.history);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleReturn = async (borrowingId: string) => {
        try {
            setError("");
            setMessage("");

            const data = await returnBook(borrowingId);

            setMessage(
                `Book returned successfully. Fine: ₹${data.fine}`
            );

            await loadHistory();

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>My Borrowings</h1>

            {error && (
                <p>{error}</p>
            )}

            {message && (
                <p>{message}</p>
            )}

            {borrowings.length === 0 ? (
                <p>No borrowing records found.</p>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Fine</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {borrowings.map((record) => (
                            <tr key={record._id}>

                                <td>
                                    {record.book.title}
                                </td>

                                <td>
                                    {record.book.author}
                                </td>

                                <td>
                                    {record.status}
                                </td>

                                <td>
                                    {record.issueDate
                                        ? new Date(
                                              record.issueDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td>
                                    {record.dueDate
                                        ? new Date(
                                              record.dueDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td>
                                    {record.returnDate
                                        ? new Date(
                                              record.returnDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td>
                                    ₹{record.fine}
                                </td>

                                <td>
                                    {record.status === "issued" ? (
                                        <button
                                            onClick={() =>
                                                handleReturn(
                                                    record._id
                                                )
                                            }
                                        >
                                            Return Book
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

export default MyBorrowings;