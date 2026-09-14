import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://online-counseling-platform-backend.onrender.com");

function Chat() {
  const { userId } = useParams();

  const token =
    localStorage.getItem("token");

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [otherUser, setOtherUser] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const getOtherUser = async () => {
      try {
        const response = await fetch(
          `https://online-counseling-platform-backend.onrender.com/api/messages/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Could not get user."
          );

          return;
        }

        setOtherUser(data);
      } catch (error) {
        console.log(error);

        setError(
          "Could not connect to the server."
        );
      }
    };

    const getMessages = async () => {
      try {
        const response = await fetch(
          `https://online-counseling-platform-backend.onrender.com/api/messages/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Could not get messages."
          );

          return;
        }

        setMessages(data);
      } catch (error) {
        console.log(error);

        setError(
          "Could not get messages."
        );
      }
    };

    if (token) {
      getOtherUser();
      getMessages();
    }
  }, [userId, token]);

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    socket.emit(
      "join-chat",
      currentUser.id
    );

    const receiveMessage = (
      newMessage
    ) => {
      const senderId =
        newMessage.sender?._id;

      const receiverId =
        newMessage.receiver?._id;

      const isCurrentChat =
        (senderId === userId &&
          receiverId ===
            currentUser.id) ||
        (senderId ===
            currentUser.id &&
          receiverId === userId);

      if (isCurrentChat) {
        setMessages(
          (oldMessages) => [
            ...oldMessages,
            newMessage,
          ]
        );
      }
    };

    socket.on(
      "receive-message",
      receiveMessage
    );

    return () => {
      socket.off(
        "receive-message",
        receiveMessage
      );
    };
  }, [userId, currentUser?.id]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      const response = await fetch(
        "https://online-counseling-platform-backend.onrender.com/api/messages",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            receiver: userId,
            message: message,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Could not send message."
        );

        return;
      }

      socket.emit(
        "send-message",
        data
      );

      setMessages(
        (oldMessages) => [
          ...oldMessages,
          data,
        ]
      );

      setMessage("");
      setError("");
    } catch (error) {
      console.log(error);

      setError(
        "Could not send message."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">

        <Link
          to={
            currentUser?.role ===
            "counselor"
              ? "/counselor-dashboard"
              : "/client-dashboard"
          }
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-md mt-5 sm:mt-6 overflow-hidden">

          {/* Chat Header */}

          <div className="bg-slate-800 text-white p-4 sm:p-5">

            <h1 className="text-lg sm:text-xl font-bold">
              Chat
            </h1>

            <p className="text-gray-300 mt-1">
              {otherUser?.name ||
                "Loading..."}
            </p>

          </div>

          {/* Messages */}

          <div className="h-[60vh] sm:h-96 overflow-y-auto p-4 sm:p-5 space-y-3">

            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No messages yet.
                <br />
                Start the conversation.
              </p>
            ) : (
              messages.map(
                (item) => {
                  const isMine =
                    item.sender?._id ===
                    currentUser?.id;

                  return (
                    <div
                      key={item._id}
                      className={`flex ${
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-xs px-4 py-3 rounded-lg ${
                          isMine
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >

                        <p className="break-words">
                          {item.message}
                        </p>

                        <p
                          className={`text-xs mt-1 ${
                            isMine
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(
                            item.createdAt
                          ).toLocaleTimeString()}
                        </p>

                      </div>
                    </div>
                  );
                }
              )
            )}

          </div>

          {/* Error */}

          {error && (
            <p className="text-red-600 text-sm px-4 sm:px-5 py-2">
              {error}
            </p>
          )}

          {/* Send Message */}

          <form
            onSubmit={sendMessage}
            className="border-t p-3 sm:p-4 flex gap-2 sm:gap-3"
          >

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Type a message..."
              className="flex-1 min-w-0 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg font-medium"
            >
              Send
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Chat;