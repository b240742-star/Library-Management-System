const API_URL = "http://127.0.0.1:5000/api/borrowings";

// Student requests a book
export const requestBook = async (bookId: string) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            bookId
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Book request failed"
        );
    }

    return data;
};


// Student views borrowing history
export const getMyBorrowingHistory = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/my-history`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch borrowing history"
        );
    }

    return data;
};


// Student returns a book
export const returnBook = async (borrowingId: string) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/return/${borrowingId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to return book"
        );
    }

    return data;
};