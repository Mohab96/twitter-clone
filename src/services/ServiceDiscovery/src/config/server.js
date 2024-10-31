const express = require("express");
const app = express();
const { connectRedis } = require("./redis");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("combined"));
app.use(cors());
app.use(helmet());
app.use(express.json());

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Service Discovery instance is running on port ${port}`);
  await connectRedis();
  require("../ServiceDiscovery");
});
