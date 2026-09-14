import { useState } from "react";
import {
  useSearchParams,
  Link,
} from "react-router-dom";

function Email() {
  const [searchParams] =
    useSearchParams();

  const to =
    searchParams.get("to") || "";

  const token =
    localStorage.getItem("token");

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (
      !to ||
      !subject.trim() ||
      !message.trim()
    ) {
      setStatus(
        "Please fill all fields."
      );

      return;
    }

    try {
      setSending(true);
      setStatus("");

      const response =
        await fetch(
          "http://localhost:5000/api/emails/send",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              to,
              subject,
              message,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setStatus(
          data.message ||
            "Could not send email."
        );

        setSending(false);

        return;
      }

      setStatus(
        "Email sent successfully!"
      );

      setSubject("");
      setMessage("");
    } catch (error) {
      console.log(error);

      setStatus(
        "Could not send email."
      );
    }

    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-2xl mx-auto">

        <Link
          to="/counselor-dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mt-5 sm:mt-6">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Send Email
          </h1>

          <p className="text-gray-600 mt-2">
            Send an email to your client.
          </p>

          {status && (
            <p
              className={`mt-4 text-sm ${
                status.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}

          <form
            onSubmit={sendEmail}
            className="mt-6"
          >

            <label className="block font-medium mb-2">
              To
            </label>

            <input
              type="email"
              value={to}
              readOnly
              className="w-full border rounded-lg p-3 mb-5 bg-gray-100"
            />

            <label className="block font-medium mb-2">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              placeholder="Enter email subject"
              className="w-full border rounded-lg p-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block font-medium mb-2">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              rows="7"
              placeholder="Write your message..."
              className="w-full border rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {sending
                ? "Sending..."
                : "Send Email"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Email;