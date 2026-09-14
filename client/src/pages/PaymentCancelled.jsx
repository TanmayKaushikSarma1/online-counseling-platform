import { Link } from "react-router-dom";

function PaymentCancelled() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-lg mx-auto">

        <div className="bg-white rounded-xl shadow-md p-8 text-center">

          <h1 className="text-3xl font-bold text-red-600">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 mt-4">
            Your payment was cancelled.
            You can try again from the
            dashboard.
          </p>

          <Link
            to="/client-dashboard"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            Go to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PaymentCancelled;