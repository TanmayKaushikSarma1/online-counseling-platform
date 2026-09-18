import { useEffect, useState } from "react";
import CounselorCard from "../components/CounselorCard";

function Counselors() {
  const [counselors, setCounselors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [service, setService] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    getCounselors();
  }, []);

  const getCounselors = async () => {
    try {
      const response = await fetch(
        "https://online-counseling-platform-backend.onrender.com/api/counselors"
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Could not load counselors."
        );

        setLoading(false);
        return;
      }

      setCounselors(data);
    } catch (error) {
      console.log(error);

      setError(
        "Could not connect to the server."
      );
    }

    setLoading(false);
  };

  const filteredCounselors =
    counselors.filter((counselor) => {
      const searchText =
        search.toLowerCase().trim();

      const counselorName =
        counselor.name?.toLowerCase() || "";

      const specialization =
        counselor.specialization?.toLowerCase() ||
        "";

      const matchesSearch =
        counselorName.includes(searchText) ||
        specialization.includes(searchText);

      const matchesService =
        !service ||
        counselor.services?.includes(service);

      return (
        matchesSearch &&
        matchesService
      );
    });

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}

        <div className="text-center">
          <p className="text-blue-600 font-semibold">
            Our Counselors
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
            Find a Counselor
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Browse counselor profiles and find
            someone based on your needs and
            preferred service.
          </p>
        </div>

        {/* Search and Filter */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 mt-8">

          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Search Counselors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Name or specialization"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>

              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-500"
              >
                <option value="">
                  All Services
                </option>

                <option value="Mental Health">
                  Mental Health
                </option>

                <option value="Relationship Advice">
                  Relationship Advice
                </option>

                <option value="Career Counseling">
                  Career Counseling
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* Results Count */}

        {!loading && !error && (
          <p className="text-gray-600 text-sm mt-6">
            {filteredCounselors.length}{" "}
            counselor
            {filteredCounselors.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        )}

        {/* Loading */}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mt-6">
            <p className="text-gray-600">
              Loading counselors...
            </p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center mt-6">
            <p className="text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* No Results */}

        {!loading &&
          !error &&
          filteredCounselors.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center mt-6">
              <p className="text-gray-600">
                No counselors found.
              </p>

              {(search || service) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setService("");
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        {/* Counselor List */}

        {!loading &&
          !error &&
          filteredCounselors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredCounselors.map(
                (counselor) => (
                  <CounselorCard
                    key={counselor._id}
                    counselor={counselor}
                  />
                )
              )}
            </div>
          )}

      </div>
    </div>
  );
}

export default Counselors;