const express = require("express");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/Userroutes");
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("[!] server is running on port:", process.env.PORT || 3000);
});
