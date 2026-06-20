const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT_NO),
    tls: true
  }
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

module.exports = redisClient;
