require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const { AuthRouter } = require("./Routes/auth.routes");
const { OwnerRouter } = require("./Routes/owner.routes");
const { AdminRouter } = require("./Routes/admin.routes");
const { EmployeeRouter } = require("./Routes/employee.routes");
const { AnalyticsRouter } = require("./Routes/analytics.routes");
const { ChatRouter } = require("./Routes/chats.routes");

// Models
const { Chat } = require("./Models/Chat.Schema");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Team Management API is running",
  });
});

// API routes
app.use("/api/auth", AuthRouter);
app.use("/api/owner", OwnerRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/analytics", AnalyticsRouter);
app.use("/api/chats", ChatRouter);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join private conversation room
  socket.on("join-room", (data) => {
    if (!data?.sender || !data?.receiver) {
      return;
    }

    const roomId = [String(data.sender), String(data.receiver)]
      .sort()
      .join("");

    socket.join(roomId);
  });

  // Send and save message
  socket.on("send-msg", async (data) => {
    try {
      if (
        !data?.sender ||
        !data?.receiver ||
        typeof data.msg !== "string" ||
        !data.msg.trim()
      ) {
        return;
      }

      const roomId = [String(data.sender), String(data.receiver)]
        .sort()
        .join("");

      const savedMessage = await Chat.create({
        text: data.msg.trim(),
        sender: data.sender,
        receiver: data.receiver,
      });

      // Emit only after successful database save
      io.to(roomId).emit("rec-msg", {
        _id: savedMessage._id,
        msg: savedMessage.text,
        sender: savedMessage.sender,
        receiver: savedMessage.receiver,
        createdAt: savedMessage.createdAt || new Date(),
      });
    } catch (error) {
      console.error("Message sending failed:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error("API error:", err);

  let status = err.status || 500;
  let message =
    status >= 500 ? "Internal server error" : err.message;

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `${field} already exists`;
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    status = 401;
    message = "Session expired, please log in again";
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  }

  res.status(status).json({ message });
});

// Connect DB and start server
async function startServer() {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing from environment variables");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Stop the existing process.`
        );
      } else {
        // console.error("Server error:", error.message);
      }

      process.exit(1);
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();









































// require("dotenv").config()
// const express = require("express")
// const mongoose = require("mongoose")
// const { AuthRouter } = require("./Routes/auth.routes")
// const { OwnerRouter } = require("./Routes/owner.routes")
// const { AdminRouter } = require("./Routes/admin.routes")
// const { EmployeeRouter } = require("./Routes/employee.routes")
// const { AnalyticsRouter } = require("./Routes/analytics.routes")
// const { ChatRouter } = require("./Routes/chats.routes")
// const cors = require("cors")
// const cp = require("cookie-parser")
// const http = require("http")
// const { Server } = require("socket.io")
// const { Chat } = require("./Models/Chat.Schema")

// // const { addUser } = require("./Utils/AddOwner")

// const app = express()
// const server = http.createServer(app)



// const io = new Server(server, {
//     cors : {
//         origin : [process.env.CLIENT_URL]
//     }
// })

// io.on("connection", (socket) => {
//     // console.log("Socket connected")


//     socket.on("join-room", (data) => {
//         let roomId = [data.sender, data.receiver].sort().join("")
//         socket.join(roomId)
//     })

//     socket.on("send-msg", async(data) => {
        
//         // let roomId = [data.sender, data.receiver].sort().join("")
//         // socket.join(roomId)
//         let roomId = [data.sender, data.receiver].sort().join("")
//         io.to(roomId).emit("rec-msg", data)

//         await Chat.create({
//             text : data.msg,
//             sender : data.sender,
//             receiver : data.receiver
//         })


//     })


// })




// app.use(cors({
//     origin : ["deployedUrl", process.env.CLIENT_URL],
//     credentials : true // allowing browser to request cookies
// }))

// app.use(cp())
// app.use(express.json())
// app.use("/api/auth", AuthRouter)
// app.use("/api/owner", OwnerRouter)
// app.use("/api/admin", AdminRouter)
// app.use("/api/employee", EmployeeRouter)
// app.use("/api/analytics", AnalyticsRouter)
// app.use("/api/chats", ChatRouter)



// mongoose.connect(process.env.DB_URL)
// .then(() => {
//     // addUser("Testing123!", "DemoUser", "demo@something.com", "admin")
//     console.log("Database connected")

//     const port = process.env.PORT || 8080

//     server.listen(port, () => {
//         console.log(`Server Running on port ${port}`)
//     })
// })
// .catch((error) => {
//     console.log(`DB Connection failed : ${error.message}`)
// })



// // Registered synchronously at startup, so it runs after every router above.
// // Express 5 forwards errors thrown in async handlers here automatically.
// app.use((err, req, res, next) => {

//     let status = err.status || 400
//     let message = err.message

//     if(err.code == 11000)
//     {
//         const field = Object.keys(err.keyValue || {})[0] || "value"
//         status = 409
//         message = `${field} already exists`
//     }
//     else if(err.name == "JsonWebTokenError" || err.name == "TokenExpiredError")
//     {
//         status = 401
//         message = "Session expired, please log in again"
//     }
//     else if(err.name == "CastError")
//     {
//         status = 400
//         message = "Invalid ID"
//     }

//     res
//     .status(status)
//     .json({
//         message
//     })
// }) 