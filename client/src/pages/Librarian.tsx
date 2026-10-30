import { useEffect, useState } from "react";
import {
    getBorrowingRequests,
    approveRequest
} from "../services/librarianService";

interface Request {
    _id: string;

    student: {
        name: string;
        email: string;
        department?: string;
    };

    book: {
        title: string;
        author: string;
        isbn: string;
    };
}

function Librarian() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setError("");

            const data = await getBorrowingRequests();

            setRequests(data.requests);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            setError("");
            setMessage("");

            await approveRequest(id);

            setMessage(
                "Book issued successfully!"
            );

            await loadRequests();

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Librarian Dashboard</h1>

            {error && <p>{error}</p>}

            {message && <p>{message}</p>}

            <h2>Pending Book Requests</h2>

            {requests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Book</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id}>

                                <td>
                                    {request.student.name}
                                </td>

                                <td>
                                    {request.student.email}
                                </td>

                                <td>
                                    {request.student.department || "-"}
                                </td>

                                <td>
                                    {request.book.title}
                                </td>

                                <td>
                                    {request.book.author}
                                </td>

                                <td>
                                    {request.book.isbn}
                                </td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleApprove(
                                                request._id
                                            )
                                        }
                                    >
                                        Approve & Issue
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Librarian;