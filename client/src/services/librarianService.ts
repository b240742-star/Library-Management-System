const API_URL = "http://127.0.0.1:5000/api/borrowings";

// Get all pending borrowing requests
export const getBorrowingRequests = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/requests`,
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
            "Failed to fetch borrowing requests"
        );
    }

    return data;
};


// Approve a borrowing request
export const approveRequest = async (
    borrowingId: string
) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/approve/${borrowingId}`,
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
            data.message ||
            "Failed to approve request"
        );
    }

    return data;
};