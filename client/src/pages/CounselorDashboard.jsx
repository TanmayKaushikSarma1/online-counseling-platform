import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CounselorDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  const [specialization, setSpecialization] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [services, setServices] =
    useState([]);

  const [availability, setAvailability] =
    useState([
      {
        day: "Monday",
        startTime: "",
        endTime: "",
      },
    ]);

  const [appointments, setAppointments] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response =
          await fetch(
            "https://online-counseling-platform-backend.onrender.com/api/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          setSpecialization(
            data.specialization || ""
          );

          setExperience(
            data.experience || ""
          );

          setBio(data.bio || "");

          setServices(
            data.services || []
          );

          setAvailability(
            data.availability?.length > 0
              ? data.availability
              : [
                  {
                    day: "Monday",
                    startTime: "",
                    endTime: "",
                  },
                ]
          );
        }
      } catch (error) {
        console.log(
          "Could not get profile"
        );
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response =
          await fetch(
            "https://online-counseling-platform-backend.onrender.com/api/appointments/counselor",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          setAppointments(data);
        }
      } catch (error) {
        console.log(
          "Could not get appointments"
        );
      }
    };

    const getClients = async () => {
      try {
        const response =
          await fetch(
            "https://online-counseling-platform-backend.onrender.com/api/client-records",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          setClients(data);
        }
      } catch (error) {
        console.log(
          "Could not get clients"
        );
      }
    };

    if (token) {
      getAppointments();
      getClients();
    }
  }, [token]);

  const updateService = (
    index,
    value
  ) => {
    const updatedServices = [
      ...services,
    ];

    updatedServices[index] =
      value;

    setServices(
      updatedServices
    );
  };

  const addService = () => {
    setServices([
      ...services,
      "",
    ]);
  };

  const removeService = (
    index
  ) => {
    const updatedServices =
      services.filter(
        (_, serviceIndex) =>
          serviceIndex !== index
      );

    setServices(
      updatedServices
    );
  };

  const updateAvailability = (
    index,
    field,
    value
  ) => {
    const updatedAvailability = [
      ...availability,
    ];

    updatedAvailability[index][
      field
    ] = value;

    setAvailability(
      updatedAvailability
    );
  };

  const addAvailability = () => {
    setAvailability([
      ...availability,
      {
        day: "Monday",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const removeAvailability = (
    index
  ) => {
    const updatedAvailability =
      availability.filter(
        (_, availabilityIndex) =>
          availabilityIndex !== index
      );

    setAvailability(
      updatedAvailability
    );
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const response =
        await fetch(
          "https://online-counseling-platform-backend.onrender.com/api/counselors/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              specialization,
              experience,
              bio,

              services:
                services.filter(
                  (service) =>
                    service.trim() !== ""
                ),

              availability,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not update profile."
        );

        return;
      }

      setMessage(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "Could not update profile. Please try again."
      );
    }
  };

  const cancelAppointment = async (
    id
  ) => {
    try {
      const response =
        await fetch(
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

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Welcome, {user?.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your counselor profile,
          availability, clients and
          appointments.
        </p>

        {message && (
          <p className="text-blue-600 mt-4">
            {message}
          </p>
        )}

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-8">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Counselor Profile
          </h2>

          <form
            onSubmit={saveProfile}
            className="mt-6"
          >

            <label className="block font-medium mb-2">
              Specialization
            </label>

            <input
              type="text"
              value={specialization}
              onChange={(e) =>
                setSpecialization(
                  e.target.value
                )
              }
              placeholder="Example: Mental Health Counselor"
              className="w-full border rounded-lg p-3 mb-5"
            />

            <label className="block font-medium mb-2">
              Years of Experience
            </label>

            <input
              type="number"
              value={experience}
              onChange={(e) =>
                setExperience(
                  e.target.value
                )
              }
              placeholder="Example: 5"
              className="w-full border rounded-lg p-3 mb-5"
            />

            <label className="block font-medium mb-2">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              placeholder="Write something about yourself..."
              rows="4"
              className="w-full border rounded-lg p-3 mb-5"
            />

            <label className="block font-medium mb-2">
              Services
            </label>

            <div className="space-y-3">

              {services.map(
                (service, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2"
                  >

                    <input
                      type="text"
                      value={service}
                      onChange={(e) =>
                        updateService(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Example: Mental Health"
                      className="flex-1 border rounded-lg p-3"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeService(
                          index
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={addService}
              className="mt-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Add Service
            </button>

            <h2 className="text-xl font-semibold mt-8 text-slate-800">
              Availability
            </h2>

            <div className="space-y-4 mt-4">

              {availability.map(
                (item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                      <select
                        value={item.day}
                        onChange={(e) =>
                          updateAvailability(
                            index,
                            "day",
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-3"
                      >
                        <option>
                          Monday
                        </option>

                        <option>
                          Tuesday
                        </option>

                        <option>
                          Wednesday
                        </option>

                        <option>
                          Thursday
                        </option>

                        <option>
                          Friday
                        </option>

                        <option>
                          Saturday
                        </option>

                        <option>
                          Sunday
                        </option>
                      </select>

                      <input
                        type="time"
                        value={
                          item.startTime
                        }
                        onChange={(e) =>
                          updateAvailability(
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-3"
                      />

                      <input
                        type="time"
                        value={
                          item.endTime
                        }
                        onChange={(e) =>
                          updateAvailability(
                            index,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-3"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeAvailability(
                          index
                        )
                      }
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={addAvailability}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Add Availability
            </button>

            <div className="mt-6">

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Save Profile
              </button>

            </div>

          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-8">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            My Clients
          </h2>

          {clients.length === 0 ? (
            <p className="text-gray-500 mt-4">
              No clients yet.
            </p>
          ) : (
            <div className="space-y-4 mt-6">

              {clients.map(
                (record) => (
                  <div
                    key={record._id}
                    className="border rounded-lg p-4 sm:p-5"
                  >

                    <h3 className="text-lg sm:text-xl font-semibold">
                      {record.client?.name}
                    </h3>

                    <p className="text-gray-600 mt-1 break-all">
                      {record.client?.email}
                    </p>

                    {record.client?.phone && (
                      <p className="text-gray-600 mt-1">
                        Phone:{" "}
                        {record.client.phone}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">

                      <Link
                        to={`/client-records/${record._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                      >
                        View Client Record
                      </Link>

                      {record.client?.email && (
                        <Link
                          to={`/email?to=${record.client.email}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                        >
                          Email
                        </Link>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-8">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            My Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 mt-4">
              No appointments yet.
            </p>
          ) : (
            <div className="space-y-4 mt-6">

              {appointments.map(
                (appointment) => (
                  <div
                    key={appointment._id}
                    className="border rounded-lg p-4 sm:p-5"
                  >

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                      <div>

                        <h3 className="text-lg sm:text-xl font-semibold">
                          {appointment.client?.name}
                        </h3>

                        <p className="text-gray-600 mt-1 break-all">
                          {appointment.client?.email}
                        </p>

                        <p className="text-blue-600 mt-2">
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

                      <div className="flex flex-wrap gap-2 items-start">

                        {appointment.status ===
                          "booked" && (
                          <Link
                            to={`/video-call/${appointment._id}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                          >
                            Video Call
                          </Link>
                        )}

                        {appointment.client?._id && (
                          <Link
                            to={`/chat/${appointment.client._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                          >
                            Chat
                          </Link>
                        )}

                        {appointment.client?.email && (
                          <Link
                            to={`/email?to=${appointment.client.email}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                          >
                            Email
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

export default CounselorDashboard;