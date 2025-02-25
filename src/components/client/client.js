const { createClient } = require('redis');

let redisClient;

async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            username: 'default',
            password: 'DkaMaYs6wiA0QYwR5O2qcB2myNd0F7TS',
            socket: {
                host: 'redis-17999.c16.us-east-1-2.ec2.redns.redis-cloud.com',
                port: 17999,
            },
        });

        redisClient.on('error', (err) => console.error('Redis Client Error', err));

        await redisClient.connect();
    }
    return redisClient;
}

module.exports = getRedisClient;





















// const Redis = require('ioredis');

// // const redisHost = process.env.REDIS_HOST || 'redis';
// // const redisPort = process.env.REDIS_PORT || 6379;
// const redisHost = 'redis';
// const redisPort =  6379;

// const client = new Redis({
//     host: redisHost,
//     port: redisPort
// });

// client.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// module.exports = client;