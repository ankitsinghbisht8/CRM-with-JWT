import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer.js';

dotenv.config();

const deleteCustomers = async () => {
  try {
    // Connect to MongoDB - URI already includes database name
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get total count directly from collection
    const db = mongoose.connection.db;
    const collection = db.collection('customers');
    const totalCount = await collection.countDocuments();
    const modelCount = await Customer.countDocuments();

    console.log(`📊 Database counts:
    - Database name: ${db.databaseName}
    - Collection name: ${collection.collectionName}
    - Direct collection count: ${totalCount}
    - Mongoose model count: ${modelCount}
    `);

    // Find the most recent 70 customers
    const customersToDelete = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(70)
      .lean();

    console.log(`Found ${customersToDelete.length} customers to delete`);
    
    if (customersToDelete.length === 0) {
      console.log('❌ No customers found to delete!');
      return;
    }

    // Delete these customers
    const result = await Customer.deleteMany({
      _id: { $in: customersToDelete.map(c => c._id) }
    });

    // Get final counts
    const finalCount = await Customer.countDocuments();
    
    console.log(`🗑️ Deletion result:
    - Attempted to delete: 70 customers
    - Actually deleted: ${result.deletedCount} customers
    - Starting count: ${modelCount}
    - Final count: ${finalCount}
    `);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the deletion
deleteCustomers(); 