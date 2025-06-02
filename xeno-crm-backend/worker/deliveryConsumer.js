import redisClient, { createConsumerGroupIfNotExists } from '../utils/redisClient.js';
import { updateDeliveryStatusBatch } from '../controllers/deliveryController.js';

const STREAM_NAME = 'deliveryStream';
const GROUP_NAME = 'deliveryGroup';
const CONSUMER_NAME = `consumer-${Math.floor(Math.random() * 1000)}`;
const BATCH_SIZE = 50;
const BATCH_INTERVAL = 2000;

let deliveryUpdates = [];
let batchTimer = null;

export const startDeliveryConsumer = async () => {
  try {
    // Create consumer group if it doesn't exist
    await createConsumerGroupIfNotExists(STREAM_NAME, GROUP_NAME);
    
    console.log(`Started delivery consumer: ${CONSUMER_NAME}`);
    
    // Start consuming
    consumeDeliveryReceipts();
    
    // Start batch timer
    startBatchTimer();
  } catch (error) {
    console.error('Error starting delivery consumer:', error);
  }
};

const consumeDeliveryReceipts = async () => {
  try {
    // Read from stream with GROUP READ
    const streams = await redisClient.xreadgroup(
      'GROUP', GROUP_NAME, CONSUMER_NAME,
      'COUNT', BATCH_SIZE,
      'BLOCK', 1000, // Reduced block time to 1 second
      'STREAMS', STREAM_NAME, '>'
    );
    
    if (!streams || !streams.length || !streams[0][1].length) {
      // No messages, try again
      setTimeout(consumeDeliveryReceipts, 500); // Reduced retry interval
      return;
    }
    
    const messages = streams[0][1];
    console.log(`Received ${messages.length} delivery receipt messages`);
    
    // Process messages
    const updates = messages.map(message => {
      const [id, fields] = message;
      
      // Convert array of [key, value, key, value] to object
      const data = {};
      for (let i = 0; i < fields.length; i += 2) {
        data[fields[i]] = fields[i + 1];
      }
      
      return {
        id,
        messageId: data.messageId,
        status: data.status,
        deliveredAt: data.deliveredAt
      };
    });
    
    // Add to batch
    deliveryUpdates.push(...updates);
    
    // Acknowledge messages
    for (const update of updates) {
      await redisClient.xack(STREAM_NAME, GROUP_NAME, update.id);
    }
    
    // If we have enough updates, process immediately
    if (deliveryUpdates.length >= 10) {
      await processBatch();
    }
    
    // Continue consuming
    setImmediate(consumeDeliveryReceipts);
  } catch (error) {
    console.error('Error consuming delivery receipts:', error);
    
    // Retry after a delay
    setTimeout(consumeDeliveryReceipts, 2000); // Reduced retry delay
  }
};

const processBatch = async () => {
  if (deliveryUpdates.length > 0) {
    const batch = [...deliveryUpdates];
    deliveryUpdates = [];
    
    try {
      const result = await updateDeliveryStatusBatch(batch);
      console.log(`Batch processed ${result.processed} of ${result.total} delivery updates`);
    } catch (error) {
      console.error('Error processing delivery batch:', error);
      
      // Put failed updates back in the queue
      deliveryUpdates.push(...batch);
    }
  }
};

const startBatchTimer = () => {
  batchTimer = setInterval(processBatch, BATCH_INTERVAL);
};