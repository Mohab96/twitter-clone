const express = require("express");
const fs = require("fs");
require("dotenv").config();
const app = express();
app.use(express.json());
const fileRoutes = require("./routes/filesRoutes");

app.use("/api/file", fileRoutes);

app.listen(process.env.PORT, () => {
  console.log("[!] server is running on port:", process.env.PORT);
  const uploadDir = "uploads";
  if (!fs.existsSync(uploadDir)) {
    console.log("[!] uploads folder does not exist, creating one...");
    fs.mkdirSync(uploadDir, { recursive: true });
  } else {
    console.log("[!] uploads folder already exists.");
  }
});
