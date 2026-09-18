import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const getStartedLink = () => {
    if (!token) {
      return "/register";
    }

    if (user?.role === "counselor") {
      return "/counselor-dashboard";
    }

    return "/client-dashboard";
  };

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">

            <p className="text-blue-600 font-semibold mb-3">
              Online Counseling
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Find the Right Counselor for You
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mt-5 leading-relaxed">
              Connect with counselors for mental health,
              relationship and career guidance through
              convenient online sessions.
            </p>

            <div className="mt-8">
              <Link
                to={getStartedLink()}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {token
                  ? "Go to Dashboard"
                  : "Get Started"}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Counseling Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Counseling Services
          </h2>

          <p className="text-gray-600 mt-3">
            Choose the type of support that matches
            your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Mental Health */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="text-3xl mb-4">
              🧠
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              Mental Health
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Get support for stress, anxiety and
              other mental health concerns.
            </p>
          </div>

          {/* Relationship */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="text-3xl mb-4">
              💬
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              Relationship Advice
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Talk to counselors about relationships,
              communication and personal challenges.
            </p>
          </div>

          {/* Career */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="text-3xl mb-4">
              🎯
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              Career Counseling
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Get guidance for career decisions,
              goals and professional development.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              How It Works
            </h2>

            <p className="text-gray-600 mt-3">
              Get started with a counselor in a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                1
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mt-3">
                Find a Counselor
              </h3>

              <p className="text-gray-600 mt-2">
                Browse counselor profiles and
                choose a service.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                2
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mt-3">
                Book a Session
              </h3>

              <p className="text-gray-600 mt-2">
                Select an available date and time
                for your appointment.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                3
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mt-3">
                Connect Online
              </h3>

              <p className="text-gray-600 mt-2">
                Communicate with your counselor
                through the available tools.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;