const express = require("express");
const userRouter = require("./routes/users.js"); // Importing user routes
const bookRouter = require("./routes/books.js"); // Importing book routes

const app = express();
const PORT = 8081;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route: Root
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running! 🚀",
  });
});

// Mounting Routers
app.use("/users", userRouter); // All routes related to users will be prefixed with /users
app.use("/books", bookRouter); // All routes related to books will be prefixed with /books

// Fallback Route
app.use((req, res) => {
  res.status(404).json({
    message: "This route does not exist! ❌",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
