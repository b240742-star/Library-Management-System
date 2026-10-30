
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import MyBorrowings from "./pages/MyBorrowings";
import Librarian from "./pages/Librarian";
import ManageBooks from "./pages/ManageBooks";
import Reservations from "./pages/Reservations";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/books" element={<Books />} />
                <Route
                    path="/my-borrowings"
                    element={<MyBorrowings />}
                />
                <Route
                    path="/reservations"
                    element={<Reservations />}
                />

                <Route path="/librarian" element={<Librarian />} />
                <Route
                    path="/manage-books"
                    element={<ManageBooks />}
                />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
