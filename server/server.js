const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clientRecordRoutes = require("./routes/clientRecordRoutes");
const sessionNoteRoutes = require("./routes/sessionNoteRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/counselors",
  counselorRoutes
);

app.use(
  "/api/appointments",
  appointmentRoutes
);

app.use(
  "/api/client-records",
  clientRecordRoutes
);

app.use(
  "/api/session-notes",
  sessionNoteRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/emails",
  emailRoutes
);

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "join-chat",
    (userId) => {
      socket.join(userId);

      console.log(
        "User joined chat:",
        userId
      );
    }
  );

  socket.on(
    "send-message",
    (message) => {
      const receiverId =
        message.receiver?._id;

      if (receiverId) {
        io.to(receiverId).emit(
          "receive-message",
          message
        );
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected"
    );
  })
  .catch((error) => {
    console.log(
      "MongoDB connection error:",
      error
    );
  });

app.get("/", (req, res) => {
  res.send(
    "Online Counseling Platform API is running"
  );
});

const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);