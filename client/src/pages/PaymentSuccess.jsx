import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] =
    useSearchParams();

  const sessionId =
    searchParams.get("sessionId");

  const token =
    localStorage.getItem("token");

  const [message, setMessage] =
    useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setMessage(
          "Payment session is missing."
        );
        return;
      }

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/payments/verify-payment/${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message
          );
          return;
        }

        setMessage(
          "Payment successful!"
        );
      } catch (error) {
        setMessage(
          "Could not verify payment."
        );
      }
    };

    verifyPayment();
  }, [sessionId, token]);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-lg mx-auto">

        <div className="bg-white rounded-xl shadow-md p-8 text-center">

          <h1 className="text-3xl font-bold text-green-600">
            {message}
          </h1>

          <p className="text-gray-600 mt-4">
            Your counseling appointment
            payment has been processed.
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

export default PaymentSuccess;