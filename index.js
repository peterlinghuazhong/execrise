const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/user", require("./routes/UserRoutes"));
app.use("/", require("./routes/productRoutes"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});
