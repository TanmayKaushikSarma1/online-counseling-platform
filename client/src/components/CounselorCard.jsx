import { Link } from "react-router-dom";

function CounselorCard({ counselor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-full">

      {/* Counselor Name */}

      <h2 className="text-xl font-bold text-slate-800">
        {counselor.name}
      </h2>

      {/* Specialization */}

      <p className="text-blue-600 font-medium mt-2">
        {counselor.specialization ||
          "Counselor"}
      </p>

      {/* Experience */}

      <p className="text-sm text-gray-500 mt-2">
        {counselor.experience
          ? `${counselor.experience} years experience`
          : "Experienced counselor"}
      </p>

      {/* Bio */}

      <p className="text-gray-600 mt-4 leading-relaxed">
        {counselor.bio ||
          "Counselor available for online sessions."}
      </p>

      {/* Services */}

      {counselor.services &&
        counselor.services.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700 mb-2">
              Services
            </p>

            <div className="flex flex-wrap gap-2">
              {counselor.services.map(
                (service, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {/* View Profile */}

      <div className="mt-auto pt-6">
        <Link
          to={`/counselors/${counselor._id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium"
        >
          View Profile
        </Link>
      </div>

    </div>
  );
}

export default CounselorCard;