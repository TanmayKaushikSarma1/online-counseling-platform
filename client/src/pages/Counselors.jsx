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
        "http://localhost:5000/api/counselors"
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
        search.toLowerCase();

      const matchesSearch =
        counselor.name
          ?.toLowerCase()
          .includes(searchText) ||
        counselor.specialization
          ?.toLowerCase()
          .includes(searchText);

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

        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Find a Counselor
          </h1>

          <p className="text-gray-600 mt-3">
            Find a counselor based on your needs
            and preferred service.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or specialization"
              className="w-full border rounded-lg p-3"
            />

            <select
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
              className="w-full border rounded-lg p-3"
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

        {/* Counselor List */}
        {loading && (
          <p className="text-center mt-10 text-gray-600">
            Loading counselors...
          </p>
        )}

        {error && (
          <p className="text-center mt-10 text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          filteredCounselors.length === 0 && (
            <p className="text-center mt-10 text-gray-600">
              No counselors found.
            </p>
          )}

        {!loading &&
          !error &&
          filteredCounselors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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