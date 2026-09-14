import { useParams, Link } from "react-router-dom";

function VideoCall() {
  const { appointmentId } =
    useParams();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const roomName =
    `OnlineCounseling-${appointmentId}`;

  const jitsiUrl =
    `https://meet.jit.si/${roomName}`;

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-5 sm:py-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Video Session
            </h1>

            <p className="text-gray-600 mt-1">
              Your counseling session with the{" "}
              {user?.role === "counselor"
                ? "client"
                : "counselor"}.
            </p>
          </div>

          <Link
            to={
              user?.role === "counselor"
                ? "/counselor-dashboard"
                : "/client-dashboard"
            }
            className="w-full sm:w-auto text-center bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Exit Call
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <iframe
            src={jitsiUrl}
            title="Video Call"
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full h-[70vh] min-h-[450px] sm:h-[700px] border-0"
          />

        </div>

      </div>
    </div>
  );
}

export default VideoCall;