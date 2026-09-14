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
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">
            {error}
          </p>

          <Link
            to="/counselors"
            className="inline-block mt-5 text-blue-600 hover:underline"
          >
            ← Back to Counselors
          </Link>
        </div>
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="text-center text-gray-600">
          Loading counselor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-4xl mx-auto">

        <Link
          to="/counselors"
          className="text-blue-600 hover:underline"
        >
          ← Back to Counselors
        </Link>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-5">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {counselor.name}
          </h1>

          <p className="text-blue-600 text-base sm:text-lg mt-2">
            {counselor.specialization ||
              "Counselor"}
          </p>

          <p className="text-gray-600 mt-4">
            {counselor.experience
              ? `${counselor.experience} years of experience`
              : "Experienced counselor"}
          </p>

          {/* About */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800">
              About the Counselor
            </h2>

            <p className="text-gray-600 mt-2 leading-relaxed">
              {counselor.bio ||
                "Information about this counselor is not available."}
            </p>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Services Offered
            </h2>

            {counselor.services &&
            counselor.services.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {counselor.services.map(
                  (service, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
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

          {/* Book */}
          <Link
            to={`/book/${counselor._id}`}
            className="block sm:inline-block text-center mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Book Appointment
          </Link>

        </div>
      </div>
    </div>
  );
}

export default CounselorProfile;