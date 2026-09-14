import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ClientRecord() {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [record, setRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const getClientRecord = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/client-records/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message);
          return;
        }

        setRecord(data.record);
        setAppointments(data.appointments);
      } catch (error) {
        setMessage(
          "Could not get client record."
        );
      }
    };

    const getNotes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/session-notes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setNotes(data);
        }
      } catch (error) {
        console.log(
          "Could not get session notes"
        );
      }
    };

    if (token) {
      getClientRecord();
      getNotes();
    }
  }, [id, token]);

  const addNote = async (e) => {
    e.preventDefault();

    if (!newNote.trim()) {
      setMessage(
        "Please enter a session note."
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("note", newNote);

      if (attachment) {
        formData.append(
          "attachment",
          attachment
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/session-notes/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setNotes([
        data.sessionNote,
        ...notes,
      ]);

      setNewNote("");
      setAttachment(null);

      document.getElementById(
        "attachment"
      ).value = "";

      setMessage(
        "Session note added successfully."
      );
    } catch (error) {
      setMessage(
        "Could not add session note."
      );
    }
  };

  if (message && !record) {
    return (
      <div className="min-h-screen bg-slate-100 p-10 text-center">

        <p className="text-red-600">
          {message}
        </p>

        <Link
          to="/counselor-dashboard"
          className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </Link>

      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-10 text-center">
        Loading client record...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-5xl mx-auto">

        <Link
          to="/counselor-dashboard"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 mt-6">

          <h1 className="text-3xl font-bold">
            Client Record
          </h1>

          {message && (
            <p className="text-blue-600 mt-4">
              {message}
            </p>
          )}

          {/* Personal Information */}

          <div className="mt-6">

            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <div className="mt-4 space-y-2 text-gray-600">

              <p>
                <span className="font-medium text-gray-800">
                  Name:
                </span>{" "}
                {record.client?.name}
              </p>

              <p>
                <span className="font-medium text-gray-800">
                  Email:
                </span>{" "}
                {record.client?.email}
              </p>

              {record.client?.phone && (
                <p>
                  <span className="font-medium text-gray-800">
                    Phone:
                  </span>{" "}
                  {record.client.phone}
                </p>
              )}

            </div>

          </div>

          {/* Session History */}

          <div className="mt-10">

            <h2 className="text-xl font-semibold">
              Session History
            </h2>

            {appointments.length === 0 ? (
              <p className="text-gray-500 mt-4">
                No session history available.
              </p>
            ) : (
              <div className="space-y-4 mt-4">

                {appointments.map(
                  (appointment) => (
                    <div
                      key={appointment._id}
                      className="border rounded-lg p-5"
                    >

                      <h3 className="font-semibold text-lg">
                        {appointment.service}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Date: {appointment.date}
                      </p>

                      <p className="text-gray-600">
                        Time: {appointment.time}
                      </p>

                      <p className="text-gray-600">
                        Status: {appointment.status}
                      </p>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* Add Session Note */}

          <div className="mt-10">

            <h2 className="text-xl font-semibold">
              Add Session Note
            </h2>

            <form
              onSubmit={addNote}
              className="mt-4"
            >

              <textarea
                value={newNote}
                onChange={(e) =>
                  setNewNote(e.target.value)
                }
                rows="5"
                placeholder="Write notes about the session..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-4">

                <label className="block font-medium mb-2">
                  Attach File
                </label>

                <input
                  id="attachment"
                  type="file"
                  onChange={(e) =>
                    setAttachment(
                      e.target.files[0]
                    )
                  }
                  className="w-full border rounded-lg p-3"
                />

                {attachment && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected:{" "}
                    {attachment.name}
                  </p>
                )}

              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Add Note
              </button>

            </form>

          </div>

          {/* Previous Notes */}

          <div className="mt-10">

            <h2 className="text-xl font-semibold">
              Previous Session Notes
            </h2>

            {notes.length === 0 ? (
              <p className="text-gray-500 mt-4">
                No session notes yet.
              </p>
            ) : (
              <div className="space-y-4 mt-4">

                {notes.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-5"
                  >

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {item.note}
                    </p>

                    {item.attachment?.fileName && (
                      <div className="mt-4">

                        <p className="text-sm text-gray-600">
                          Attachment:
                        </p>

                        <a
                          href={`http://localhost:5000${item.attachment.filePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-blue-600 hover:underline"
                        >
                          {item.attachment.fileName}
                        </a>

                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-3">
                      Added on{" "}
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ClientRecord;