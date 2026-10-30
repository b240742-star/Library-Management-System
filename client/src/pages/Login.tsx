import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setError("");

            const data = await loginUser(email, password);
            console.log("Logged-in role:", data.user.role);
console.log("Token saved:", !!localStorage.getItem("token"));

            if (data.user.role === "admin") {
                navigate("/admin");
            } else if (data.user.role === "librarian") {
                navigate("/librarian");
            } else {
                navigate("/books");
            }

        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Library Management System</h1>

            <h2>Login</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login;
