const { createClient } = require('redis');
const env = require('./env');

const redisClient = createClient({
  username: env.REDIS.USERNAME,
  password: env.REDIS.PASSWORD,
  socket: {
    host: env.REDIS.HOST,
    port: env.REDIS.PORT,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis Connected');
  }
};

module.exports = { redisClient, connectRedis };
