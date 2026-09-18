import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

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

          <nav className="flex flex-wrap items-center gap-3">

            {!token && (
              <>
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
              </>
            )}

            {token &&
              user?.role === "client" && (
                <>
                  <Link
                    to="/client-dashboard"
                    className="text-white hover:text-blue-300 px-2 py-2"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/counselors"
                    className="text-white hover:text-blue-300 px-2 py-2"
                  >
                    Counselors
                  </Link>
                </>
              )}

            {token &&
              user?.role === "counselor" && (
                <Link
                  to="/counselor-dashboard"
                  className="text-white hover:text-blue-300 px-2 py-2"
                >
                  Dashboard
                </Link>
              )}

            {token && (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;