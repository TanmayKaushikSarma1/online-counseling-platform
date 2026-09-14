import { Link } from "react-router-dom";

function CounselorCard({ counselor }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 flex flex-col">
      <h2 className="text-xl font-bold text-slate-800">
        {counselor.name}
      </h2>

      <p className="text-blue-600 mt-2 font-medium">
        {counselor.specialization || "Counselor"}
      </p>

      <p className="text-gray-600 mt-2">
        {counselor.experience
          ? `${counselor.experience} years experience`
          : "Experienced counselor"}
      </p>

      <p className="text-gray-600 mt-3 leading-relaxed">
        {counselor.bio ||
          "Counselor available for online sessions."}
      </p>

      {counselor.services &&
        counselor.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
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
        )}

      <Link
        to={`/counselors/${counselor._id}`}
        className="inline-block w-full sm:w-auto text-center mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        View Profile
      </Link>
    </div>
  );
}

export default CounselorCard;