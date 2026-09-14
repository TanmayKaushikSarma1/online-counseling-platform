import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";

function Payment() {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const appointmentId =
    searchParams.get("appointmentId");

  const token =
    localStorage.getItem("token");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/payments/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            appointmentId:
              appointmentId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not create payment order."
        );

        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Counseling Platform",
        description:
          "Counseling Session",
        order_id: data.orderId,

        handler: async function () {
          try {
            const response =
              await fetch(
                "http://localhost:5000/api/payments/payment-success",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization: `Bearer ${token}`,
                  },

                  body: JSON.stringify({
                    appointmentId:
                      appointmentId,
                  }),
                }
              );

            const data =
              await response.json();

            if (!response.ok) {
              setMessage(
                data.message ||
                  "Could not update payment."
              );

              return;
            }

            navigate(
              `/payment-success?appointmentId=${appointmentId}`
            );
          } catch (error) {
            console.log(error);

            setMessage(
              "Could not complete payment."
            );
          }
        },
      };

      if (!window.Razorpay) {
        setMessage(
          "Razorpay checkout could not be loaded."
        );

        setLoading(false);
        return;
      }

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {
      console.log(
        "Payment error:",
        error
      );

      setMessage(
        "Could not start payment."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-lg mx-auto">

        <Link
          to="/client-dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-5">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Payment
          </h1>

          <p className="text-gray-600 mt-2">
            Complete your payment for
            the counseling session.
          </p>

          <div className="border rounded-lg p-5 mt-6">

            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
              Counseling Session
            </h2>

            <p className="text-gray-600 mt-2">
              Online counseling session
            </p>

            <div className="mt-5 flex justify-between items-center">

              <span className="text-gray-600">
                Session Fee
              </span>

              <span className="text-2xl font-bold text-slate-800">
                ₹500
              </span>

            </div>

          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-5">
            <p className="text-sm text-blue-700">
              This is a test payment using
              Razorpay Test Mode.
            </p>
          </div>

          {message && (
            <p className="text-red-600 text-sm mt-4">
              {message}
            </p>
          )}

          <button
            onClick={handlePayment}
            disabled={
              loading ||
              !appointmentId
            }
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Starting Payment..."
              : "Pay ₹500"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Payment;