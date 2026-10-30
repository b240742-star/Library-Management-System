
import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { requestBook } from "../services/borrowingService";

interface Book {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
    shelfLocation?: string;
}

function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data.books);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleRequest = async (bookId: string) => {
        try {
            setError("");
            setMessage("");

            await requestBook(bookId);

            setMessage("Book request submitted successfully!");

        } catch (error: any) {
            setError(error.message);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Library Books</h1>

            <input
                type="text"
                placeholder="Search by title, author or category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <br />
            <br />

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}

            {filteredBooks.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Available</th>
                            <th>Shelf</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>

                                <td>
                                    {book.availableCopies} / {book.totalCopies}
                                </td>

                                <td>
                                    {book.shelfLocation || "N/A"}
                                </td>

                                <td>
                                    {book.availableCopies > 0 ? (
                                        <button
                                            onClick={() =>
                                                handleRequest(book._id)
                                            }
                                        >
                                            Request Book
                                        </button>
                                    ) : (
                                        <span>
                                            Unavailable
                                        </span>
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

export default Books;