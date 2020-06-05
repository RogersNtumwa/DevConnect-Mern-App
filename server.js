const express = require("express");
const auth = require("./routes/auth");
const user = require("./routes/user");
const profile = require("./routes/profile");
const post = require("./routes/post");

const connect_db = require("./config/database");

const app = express();

app.use(express.json());

// Connecting to databse
connect_db();

// setting up routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/profile", profile);
app.use("/api/v1/posts", post);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listing on port ${port}`));
