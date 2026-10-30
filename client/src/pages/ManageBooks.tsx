
import { useEffect, useState } from "react";
import {
    getBooks,
    addBook,
    updateBook,
    deleteBook
} from "../services/bookService";

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

const emptyForm = {
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
    shelfLocation: ""
};

function ManageBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data.books);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load books");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: name === "totalCopies" ? Number(value) : value
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            if (editingId) {
                const oldBook = books.find(
                    (book) => book._id === editingId
                );

                if (!oldBook) {
                    throw new Error("Book not found");
                }

                if (form.totalCopies < oldBook.totalCopies - oldBook.availableCopies) {
                    throw new Error("Total copies cannot be less than currently issued copies");
                }

                await updateBook(editingId, {
                    ...form,
                    availableCopies:
                        form.totalCopies -
                        (oldBook.totalCopies - oldBook.availableCopies)
                });

                setMessage("Book updated successfully!");
            } else {
                await addBook(form);
                setMessage("Book added successfully!");
            }

            setForm(emptyForm);
            setEditingId("");
            await loadBooks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Operation failed");
        }
    };

    const handleEdit = (book: Book) => {
        setEditingId(book._id);
        setForm({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            totalCopies: book.totalCopies,
            shelfLocation: book.shelfLocation || ""
        });
        setError("");
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this book?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await deleteBook(id);
            setMessage("Book deleted successfully!");
            await loadBooks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete book");
        }
    };

    const cancelEdit = () => {
        setEditingId("");
        setForm(emptyForm);
        setError("");
        setMessage("");
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>Manage Books</h1>
            <p>Add new books or update the existing library catalog.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <h2>{editingId ? "Edit Book" : "Add New Book"}</h2>

            <form onSubmit={handleSubmit}>
                <p>
                    <label>Book Title</label><br />
                    <input name="title" value={form.title}
                        onChange={handleChange} required />
                </p>

                <p>
                    <label>Author</label><br />
                    <input name="author" value={form.author}
                        onChange={handleChange} required />
                </p>

                <p>
                    <label>ISBN</label><br />
                    <input name="isbn" value={form.isbn}
                        onChange={handleChange} required />
                </p>

                <p>
                    <label>Category</label><br />
                    <input name="category" value={form.category}
                        onChange={handleChange} required />
                </p>

                <p>
                    <label>Total Copies</label><br />
                    <input type="number" name="totalCopies"
                        value={form.totalCopies}
                        onChange={handleChange} min="1" required />
                </p>

                <p>
                    <label>Shelf Location</label><br />
                    <input name="shelfLocation"
                        value={form.shelfLocation}
                        onChange={handleChange} />
                </p>

                <button type="submit">
                    {editingId ? "Update Book" : "Add Book"}
                </button>

                {editingId && (
                    <button type="button" onClick={cancelEdit}>
                        Cancel Edit
                    </button>
                )}
            </form>

            <hr />

            <h2>Book Catalog ({books.length})</h2>

            {books.length === 0 ? (
                <p>No books available.</p>
            ) : (
                <table border={1} cellPadding={8}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>ISBN</th>
                            <th>Category</th>
                            <th>Total</th>
                            <th>Available</th>
                            <th>Shelf</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.isbn}</td>
                                <td>{book.category}</td>
                                <td>{book.totalCopies}</td>
                                <td>{book.availableCopies}</td>
                                <td>{book.shelfLocation || "-"}</td>
                                <td>
                                    <button onClick={() => handleEdit(book)}>
                                        Edit
                                    </button>{" "}
                                    <button onClick={() => handleDelete(book._id)}>
                                        Delete
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

export default ManageBooks;
