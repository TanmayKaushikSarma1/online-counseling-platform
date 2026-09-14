import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ClientDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
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
        const response =
          await fetch(
            "http://localhost:5000/api/appointments/client",
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
    try {
      const response =
        await fetch(
          `http://localhost:5000/api/appointments/${id}/cancel`,
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
        "Appointment cancelled."
      );

      setAppointments(
        appointments.map(
          (appointment) =>
            appointment._id === id
              ? {
                  ...appointment,
                  status:
                    "cancelled",
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

        {/* Header */}

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome, {user?.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your counseling appointments
          and sessions.
        </p>

        {message && (
          <p className="text-blue-600 mt-4">
            {message}
          </p>
        )}

        {/* Quick Actions */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8">

          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Find a Counselor
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              Browse counselors and choose
              the right service for you.
            </p>

            <Link
              to="/counselors"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Find Counselors
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Messages
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              Communicate with your counselor.
            </p>

            {appointments.length > 0 &&
            appointments[0].counselor?._id ? (
              <Link
                to={`/chat/${appointments[0].counselor._id}`}
                className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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

          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              My Profile
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              Manage your account information.
            </p>
          </div>

        </div>

        {/* Appointments */}

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-8">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            My Appointments
          </h2>

          {appointments.length === 0 ? (
            <div className="mt-6 text-center py-8">

              <p className="text-gray-500">
                You don't have any
                appointments yet.
              </p>

              <Link
                to="/counselors"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
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
                    className="border rounded-lg p-4 sm:p-5"
                  >

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                      {/* Appointment Details */}

                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                          {appointment.counselor?.name}
                        </h3>

                        <p className="text-blue-600 mt-1">
                          {appointment.service}
                        </p>

                        <div className="mt-3 text-gray-600 space-y-1">
                          <p>
                            Date:{" "}
                            {appointment.date}
                          </p>

                          <p>
                            Time:{" "}
                            {appointment.time}
                          </p>

                          <p>
                            Status:{" "}
                            {appointment.status}
                          </p>
                        </div>

                        <p className="text-gray-600 mt-2">
                          Payment:{" "}
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
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                            >
                              Pay ₹500
                            </Link>
                          )}

                        {appointment.status ===
                          "booked" && (
                          <Link
                            to={`/video-call/${appointment._id}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                          >
                            Video Call
                          </Link>
                        )}

                        {appointment.counselor?._id && (
                          <Link
                            to={`/chat/${appointment.counselor._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
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
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
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