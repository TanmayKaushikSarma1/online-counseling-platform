import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-white"
          >
            🩺 Counseling Platform by Tanmay Kaushik
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-white hover:text-blue-300 px-2 py-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Register
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
}

export default Navbar;