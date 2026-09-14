import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-100 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800">
            Find the Right Counselor for You
          </h1>

          <p className="text-gray-600 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Connect with counselors for mental health,
            relationship and career guidance.
          </p>

          <div className="mt-8">
            <Link
              to="/register"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Counseling Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Counseling Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          
          <div className="bg-white shadow-md rounded-xl p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-slate-800">
              Mental Health
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Get support for stress, anxiety and other
              mental health concerns.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-slate-800">
              Relationship Advice
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Talk to counselors about relationships,
              communication and personal challenges.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-5 sm:p-6 sm:col-span-2 md:col-span-1">
            <h3 className="text-xl font-semibold text-slate-800">
              Career Counseling
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Get guidance for career decisions, goals
              and professional development.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;