const { createClient } = require("redis");
const redisClient = createClient(process.env.REDIS_URL);

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.log("Error connecting to Redis: ", error);
  }
};

module.exports = { connectRedis, redisClient };
