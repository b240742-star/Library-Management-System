
const API_URL = "http://127.0.0.1:5000/api/reservations";

const getToken = () => localStorage.getItem("token");

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Get the logged-in student's reservations
export const getMyReservations = async () => {
    const response = await fetch(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return handleResponse(response);
};

// Cancel a waiting reservation
export const cancelReservation = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return handleResponse(response);
};
