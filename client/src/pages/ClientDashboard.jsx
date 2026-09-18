import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ClientDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token =
    localStorage.getItem("token");

  const [appointments, setAppointments] =
    useState([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await fetch(
          "https://online-counseling-platform-backend.onrender.com/api/appointments/client",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Could not get appointments."
          );
          return;
        }

        setAppointments(data);
      } catch (error) {
        console.log(error);

        setMessage(
          "Could not get appointments."
        );
      }
    };

    if (token) {
      getAppointments();
    }
  }, [token]);

  const cancelAppointment = async (
    id
  ) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `https://online-counseling-platform-backend.onrender.com/api/appointments/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not cancel appointment."
        );
        return;
      }

      setMessage(
        "Appointment cancelled successfully."
      );

      setAppointments(
        appointments.map(
          (appointment) =>
            appointment._id === id
              ? {
                  ...appointment,
                  status: "cancelled",
                }
              : appointment
        )
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "Could not cancel appointment."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Welcome, {user?.name}
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your counseling appointments
            and sessions.
          </p>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 mb-6">
            {message}
          </div>
        )}

        {/* Quick Actions */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

          {/* Find Counselor */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">
              👨‍⚕️
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Find a Counselor
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              Browse counselor profiles and
              choose a counseling service.
            </p>

            <Link
              to="/counselors"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Find Counselors
            </Link>
          </div>

          {/* Messages */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">
              💬
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Messages
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              Communicate with a counselor
              through online chat.
            </p>

            {appointments.length > 0 &&
            appointments[0].counselor?._id ? (
              <Link
                to={`/chat/${appointments[0].counselor._id}`}
                className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Open Chat
              </Link>
            ) : (
              <p className="text-sm text-gray-500 mt-5">
                Book an appointment to
                chat with a counselor.
              </p>
            )}
          </div>

          {/* Account */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">
              👤
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              My Account
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              You are logged in as{" "}
              <span className="font-medium">
                {user?.name}
              </span>
              .
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Email: {user?.email}
            </p>
          </div>

        </div>

        {/* Appointments */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-8 mt-8">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                My Appointments
              </h2>

              <p className="text-gray-600 mt-1">
                View and manage your upcoming sessions.
              </p>
            </div>

            <Link
              to="/counselors"
              className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Book Session
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="mt-8 border border-dashed border-gray-300 rounded-lg text-center py-10 px-4">

              <p className="text-gray-500">
                You don't have any appointments yet.
              </p>

              <Link
                to="/counselors"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Find a Counselor
              </Link>

            </div>
          ) : (
            <div className="space-y-4 mt-6">

              {appointments.map(
                (appointment) => (
                  <div
                    key={appointment._id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-5"
                  >

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                      {/* Appointment Information */}

                      <div className="flex-1">

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                            {appointment.counselor?.name ||
                              "Counselor"}
                          </h3>

                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                              appointment.status ===
                              "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>

                        <p className="text-blue-600 font-medium mt-2">
                          {appointment.service}
                        </p>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
                          <p>
                            <span className="font-medium text-slate-700">
                              Date:
                            </span>{" "}
                            {appointment.date}
                          </p>

                          <p>
                            <span className="font-medium text-slate-700">
                              Time:
                            </span>{" "}
                            {appointment.time}
                          </p>
                        </div>

                        <p className="text-gray-600 text-sm mt-3">
                          <span className="font-medium text-slate-700">
                            Payment:
                          </span>{" "}
                          <span
                            className={
                              appointment.paymentStatus ===
                              "paid"
                                ? "text-green-600 font-semibold"
                                : "text-orange-600 font-semibold"
                            }
                          >
                            {appointment.paymentStatus ===
                            "paid"
                              ? "Paid"
                              : "Pending"}
                          </span>
                        </p>

                      </div>

                      {/* Action Buttons */}

                      <div className="flex flex-wrap gap-2 items-start">

                        {appointment.paymentStatus !==
                          "paid" &&
                          appointment.status ===
                            "booked" && (
                            <Link
                              to={`/payment?appointmentId=${appointment._id}`}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                              Pay ₹500
                            </Link>
                          )}

                        {appointment.status ===
                          "booked" && (
                          <Link
                            to={`/video-call/${appointment._id}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Video Call
                          </Link>
                        )}

                        {appointment.counselor?._id && (
                          <Link
                            to={`/chat/${appointment.counselor._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Chat
                          </Link>
                        )}

                        {appointment.status ===
                          "booked" && (
                          <button
                            onClick={() =>
                              cancelAppointment(
                                appointment._id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ClientDashboard;