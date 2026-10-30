
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    const linkStyle = {
        color: "#e8e8d9",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: 500
    };

    return (
        <nav
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "22px",
                alignItems: "center",
                padding: "16px 28px",
                backgroundColor: "#203c30",
                color: "#f5f2e9",
                borderBottom: "3px solid #bd8052"
            }}
        >
            <Link
                to={
                    role === "admin"
                        ? "/admin"
                        : role === "librarian"
                        ? "/librarian"
                        : "/books"
                }
                style={{
                    color: "#fffdf7",
                    textDecoration: "none",
                    fontFamily: "Georgia, serif",
                    fontSize: "19px",
                    marginRight: "12px"
                }}
            >
                The Library Desk
            </Link>

            {role === "student" && (
                <>
                    <Link style={linkStyle} to="/books">Books</Link>
                    <Link style={linkStyle} to="/my-borrowings">
                        My Borrowings
                    </Link>
                    <Link style={linkStyle} to="/reservations">
                        Reservations
                    </Link>
                </>
            )}

            {(role === "librarian" || role === "admin") && (
                <>
                    <Link style={linkStyle} to="/librarian">
                        Requests
                    </Link>
                    <Link style={linkStyle} to="/manage-books">
                        Manage Books
                    </Link>
                </>
            )}

            {role === "admin" && (
                <Link style={linkStyle} to="/admin">
                    Dashboard
                </Link>
            )}

            <div
                style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px"
                }}
            >
                <span style={{ fontSize: "12px", color: "#d8d9c9" }}>
                    {user.name} · {role}
                </span>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 13px",
                        background: "transparent",
                        border: "1px solid #b8c5b7",
                        borderRadius: "2px",
                        color: "#fffdf7",
                        fontSize: "12px"
                    }}
                >
                    Log out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
