
const API_URL = "http://127.0.0.1:5000/api/admin";

export const getDashboardStats = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
    }

    return data;
};
