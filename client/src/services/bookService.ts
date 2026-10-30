
const API_URL = "http://127.0.0.1:5000/api/books";

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Get all books
export const getBooks = async () => {
    const response = await fetch(API_URL);
    return handleResponse(response);
};

// Add a new book
export const addBook = async (bookData: {
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    shelfLocation: string;
}) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(bookData)
    });

    return handleResponse(response);
};

// Update an existing book
export const updateBook = async (
    id: string,
    bookData: {
        title: string;
        author: string;
        isbn: string;
        category: string;
        totalCopies: number;
        availableCopies: number;
        shelfLocation: string;
    }
) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(bookData)
    });

    return handleResponse(response);
};

// Delete a book
export const deleteBook = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return handleResponse(response);
};
