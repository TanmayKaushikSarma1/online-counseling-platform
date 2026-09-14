import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import Counselors from "./pages/Counselors";
import CounselorProfile from "./pages/CounselorProfile";
import BookAppointment from "./pages/BookAppointment";
import ClientRecord from "./pages/ClientRecord";
import Chat from "./pages/Chat";
import VideoCall from "./pages/VideoCall";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Email from "./pages/Email";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

        <Route
          path="/counselor-dashboard"
          element={<CounselorDashboard />}
        />

        <Route
          path="/counselors"
          element={<Counselors />}
        />

        <Route
          path="/counselors/:id"
          element={<CounselorProfile />}
        />

        <Route
          path="/book/:id"
          element={<BookAppointment />}
        />

        <Route
          path="/client-records/:id"
          element={<ClientRecord />}
        />

        <Route
          path="/chat/:userId"
          element={<Chat />}
        />

        <Route
          path="/video-call/:appointmentId"
          element={<VideoCall />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment-cancelled"
          element={<PaymentCancelled />}
        />

        <Route
          path="/email"
          element={<Email />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;