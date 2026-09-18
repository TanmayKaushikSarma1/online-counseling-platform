import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CounselorProfile() {
  const { id } = useParams();

  const [counselor, setCounselor] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const getCounselor = async () => {
      try {
        const response = await fetch(
          `https://online-counseling-platform-backend.onrender.com/api/counselors/${id}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Could not load counselor."
          );

          return;
        }

        setCounselor(data);
      } catch (error) {
        console.log(error);

        setError(
          "Could not connect to the server."
        );
      }
    };

    getCounselor();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600">
              {error}
            </p>

            <Link
              to="/counselors"
              className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Back to Counselors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Loading counselor...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* Back Link */}

        <Link
          to="/counselors"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Counselors
        </Link>

        {/* Counselor Profile */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-5 overflow-hidden">

          {/* Profile Header */}

          <div className="bg-slate-800 px-5 sm:px-8 py-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {counselor.name}
            </h1>

            <p className="text-blue-200 text-base sm:text-lg mt-2">
              {counselor.specialization ||
                "Counselor"}
            </p>
          </div>

          <div className="p-5 sm:p-8">

            {/* Basic Information */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Experience
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  {counselor.experience
                    ? `${counselor.experience} years`
                    : "Experienced counselor"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Availability
                </p>

                <p className="font-semibold text-slate-800 mt-1">
                  Online Sessions
                </p>
              </div>

            </div>

            {/* About */}

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-800">
                About the Counselor
              </h2>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {counselor.bio ||
                  "Information about this counselor is not available."}
              </p>
            </div>

            {/* Services */}

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-800">
                Services Offered
              </h2>

              {counselor.services &&
              counselor.services.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {counselor.services.map(
                    (service, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mt-3">
                  No services listed.
                </p>
              )}
            </div>

            {/* Booking */}

            <div className="mt-8 pt-6 border-t border-gray-200">

              <h2 className="text-xl font-semibold text-slate-800">
                Book a Session
              </h2>

              <p className="text-gray-600 mt-2">
                Choose an available date and time
                for your counseling session.
              </p>

              <Link
                to={`/book/${counselor._id}`}
                className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Book Appointment
              </Link>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CounselorProfile;