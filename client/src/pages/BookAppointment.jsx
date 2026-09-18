import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [counselor, setCounselor] =
    useState(null);

  const [service, setService] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [booking, setBooking] =
    useState(false);

  useEffect(() => {
    const getCounselor = async () => {
      try {
        const response = await fetch(
          `https://online-counseling-platform-backend.onrender.com/api/counselors/${id}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Could not get counselor."
          );
          return;
        }

        setCounselor(data);

        if (
          data.services &&
          data.services.length > 0
        ) {
          setService(data.services[0]);
        } else {
          setService(
            "General Counseling"
          );
        }
      } catch (error) {
        console.log(error);

        setMessage(
          "Could not connect to the server."
        );
      }
    };

    getCounselor();
  }, [id]);

  const getDayName = (
    selectedDate
  ) => {
    const dateObject = new Date(
      `${selectedDate}T00:00:00`
    );

    return dateObject.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );
  };

  const getSelectedAvailability =
    () => {
      if (
        !date ||
        !counselor?.availability
      ) {
        return null;
      }

      const dayName =
        getDayName(date);

      return counselor.availability.find(
        (item) =>
          item.day === dayName
      );
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login before booking an appointment."
      );

      return;
    }

    if (
      !service ||
      !date ||
      !time
    ) {
      setMessage(
        "Please select a service, date and time."
      );

      return;
    }

    const selectedAvailability =
      getSelectedAvailability();

    if (!selectedAvailability) {
      setMessage(
        "The counselor is not available on this day."
      );

      return;
    }

    if (
      time <
        selectedAvailability.startTime ||
      time >
        selectedAvailability.endTime
    ) {
      setMessage(
        `Please choose a time between ${selectedAvailability.startTime} and ${selectedAvailability.endTime}.`
      );

      return;
    }

    try {
      setBooking(true);
      setMessage("");

      const response = await fetch(
        "https://online-counseling-platform-backend.onrender.com/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            counselor: id,
            service,
            date,
            time,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not book appointment."
        );

        setBooking(false);
        return;
      }

      if (!data.appointment?._id) {
        setMessage(
          "Appointment was created, but appointment ID was not returned."
        );

        setBooking(false);
        return;
      }

      navigate(
        `/payment?appointmentId=${data.appointment._id}`
      );
    } catch (error) {
      console.log(error);

      setMessage(
        "Could not connect to the server."
      );

      setBooking(false);
    }
  };

  if (!counselor) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600">
              {message ||
                "Loading counselor..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedAvailability =
    getSelectedAvailability();

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl mx-auto">

        <Link
          to={`/counselors/${id}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Counselor
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-5 overflow-hidden">

          {/* Header */}

          <div className="bg-slate-800 px-5 sm:px-8 py-6">
            <p className="text-blue-200 text-sm font-medium">
              Appointment Booking
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Book a Session
            </h1>

            <p className="text-gray-300 mt-2">
              Schedule a session with{" "}
              {counselor.name}.
            </p>
          </div>

          <div className="p-5 sm:p-8">

            {message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 mb-6">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Service */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Counseling Service
                </label>

                {counselor.services &&
                counselor.services.length > 0 ? (
                  <select
                    value={service}
                    onChange={(e) =>
                      setService(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500"
                  >
                    {counselor.services.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={index}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={service}
                    onChange={(e) =>
                      setService(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                )}
              </div>

              {/* Date */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(
                      e.target.value
                    );
                    setTime("");
                    setMessage("");
                  }}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Availability */}

              {date &&
                !selectedAvailability && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-red-600 text-sm">
                      {counselor.name} is
                      not available on
                      this day.
                    </p>
                  </div>
                )}

              {date &&
                selectedAvailability && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <p className="text-green-700 text-sm">
                      Available from{" "}
                      <span className="font-semibold">
                        {
                          selectedAvailability.startTime
                        }
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold">
                        {
                          selectedAvailability.endTime
                        }
                      </span>
                    </p>
                  </div>
                )}

              {/* Time */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>

                <input
                  type="time"
                  value={time}
                  min={
                    selectedAvailability?.startTime ||
                    ""
                  }
                  max={
                    selectedAvailability?.endTime ||
                    ""
                  }
                  disabled={
                    !selectedAvailability
                  }
                  onChange={(e) =>
                    setTime(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />

                {!date && (
                  <p className="text-sm text-gray-500 mt-2">
                    Select a date first to
                    see available times.
                  </p>
                )}
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  !selectedAvailability ||
                  booking
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                {booking
                  ? "Booking..."
                  : "Book Appointment & Continue to Payment"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookAppointment;