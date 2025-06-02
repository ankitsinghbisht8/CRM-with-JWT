import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
const redisClient = new Redis(process.env.REDIS_URI, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Helper function to add to a stream
export const addToStream = async (streamName, data) => {
  try {
    const id = await redisClient.xadd(
      streamName,
      '*', // Auto-generate ID
      ...Object.entries(data).flat()
    );
    return id;
  } catch (error) {
    console.error(`Error adding to stream ${streamName}:`, error);
    throw error;
  }
};

// Helper function to create a consumer group if it doesn't exist
export const createConsumerGroupIfNotExists = async (stream, groupName) => {
  try {
    await redisClient.xgroup('CREATE', stream, groupName, '$', 'MKSTREAM');
    console.log(`Consumer group ${groupName} created for stream ${stream}`);
  } catch (err) {
    // Group already exists error is fine
    if (!err.message.includes('BUSYGROUP')) {
      console.error(`Error creating consumer group ${groupName}:`, err);
    }
  }
};

export default redisClient;