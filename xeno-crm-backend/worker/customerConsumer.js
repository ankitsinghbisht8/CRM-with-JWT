import redisClient, { createConsumerGroupIfNotExists } from '../utils/redisClient.js';
import Customer from '../models/Customer.js';

const STREAM_NAME = 'customerStream';
const GROUP_NAME = 'customerGroup';
const CONSUMER_NAME = `consumer-${Math.floor(Math.random() * 1000)}`;
const BATCH_SIZE = 1; // Process one at a time for immediate processing

export const startCustomerConsumer = async () => {
  try {
    // Create consumer group if it doesn't exist
    await createConsumerGroupIfNotExists(STREAM_NAME, GROUP_NAME);
    
    console.log(`Started customer consumer: ${CONSUMER_NAME}`);
    
    // Start consuming
    consumeCustomers();
  } catch (error) {
    console.error('Error starting customer consumer:', error);
  }
};

const consumeCustomers = async () => {
  try {
    // Read from stream with GROUP READ - immediate processing
    const streams = await redisClient.xreadgroup(
      'GROUP', GROUP_NAME, CONSUMER_NAME,
      'COUNT', BATCH_SIZE,
      'BLOCK', 100, // Block for only 100ms for faster processing
      'STREAMS', STREAM_NAME, '>'
    );
    
    if (!streams || !streams.length || !streams[0][1].length) {
      // No messages, try again immediately
      setImmediate(consumeCustomers);
      return;
    }
    
    const messages = streams[0][1];
    console.log(`Processing ${messages.length} customer message(s) immediately`);
    
    // Process messages immediately
    for (const message of messages) {
      const [id, fields] = message;
      
      // Convert array of [key, value, key, value] to object
      const customerData = {};
      for (let i = 0; i < fields.length; i += 2) {
        customerData[fields[i]] = fields[i + 1];
      }
      
      try {
        // Save customer immediately to MongoDB
        console.log('Saving customer to MongoDB:', customerData);
        const customer = new Customer(customerData);
        await customer.save();
        console.log(`✅ Customer saved successfully: ${customer._id}`);
        
        // Acknowledge message immediately after successful save
        await redisClient.xack(STREAM_NAME, GROUP_NAME, id);
        console.log(`✅ Message acknowledged: ${id}`);
      } catch (saveError) {
        console.error(`❌ Error saving customer (message ${id}):`, saveError.message);
        // Don't acknowledge failed messages - they'll be retried
      }
    }
    
    // Continue consuming immediately
    setImmediate(consumeCustomers);
  } catch (error) {
    console.error('Error consuming customers:', error);
    
    // Retry after a short delay on error
    setTimeout(consumeCustomers, 1000);
  }
};

const saveCustomersToDB = async (customers) => {
  try {
    console.log('Preparing to save customers:', customers);
    
    const operations = customers.map(customer => {
      console.log('Processing customer data:', customer.data);
      return {
        insertOne: {
          document: customer.data
        }
      };
    });
    
    if (operations.length > 0) {
      console.log('Executing bulk write with operations:', operations);
      const result = await Customer.bulkWrite(operations);
      console.log('Bulk write result:', result);
      console.log(`Inserted ${result.insertedCount} customers to MongoDB`);
      
      // Verify the saved customers
      const savedCustomers = await Customer.find({
        _id: { $in: Object.values(result.insertedIds) }
      });
      console.log('Verified saved customers:', savedCustomers);
    }
  } catch (error) {
    console.error('Error saving customers to DB:', error);
    throw error;
  }
};