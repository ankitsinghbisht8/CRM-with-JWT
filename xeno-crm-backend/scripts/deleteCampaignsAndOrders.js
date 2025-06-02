import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import Order from '../models/Order.js';

dotenv.config();

const deleteCampaignsAndOrders = async () => {
  try {
    // Connect to MongoDB - URI already includes database name
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get current counts
    const campaignCount = await Campaign.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`📊 Current counts:
    - Database name: ${mongoose.connection.db.databaseName}
    - Campaigns: ${campaignCount}
    - Orders: ${orderCount}
    `);

    // Delete all campaigns
    console.log('🗑️ Deleting all campaigns...');
    const campaignResult = await Campaign.deleteMany({});
    
    // Delete all orders
    console.log('🗑️ Deleting all orders...');
    const orderResult = await Order.deleteMany({});

    // Get final counts
    const finalCampaignCount = await Campaign.countDocuments();
    const finalOrderCount = await Order.countDocuments();
    
    console.log(`✅ Deletion completed:
    - Campaigns deleted: ${campaignResult.deletedCount}
    - Orders deleted: ${orderResult.deletedCount}
    - Final campaign count: ${finalCampaignCount}
    - Final order count: ${finalOrderCount}
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
deleteCampaignsAndOrders(); 