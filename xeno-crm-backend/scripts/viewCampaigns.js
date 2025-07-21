import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import CommunicationLog from '../models/CommunicationLog.js';

dotenv.config();

const viewCampaigns = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get database info
    const db = mongoose.connection.db;
    console.log(`📊 Database name: ${db.databaseName}`);

    // Get campaign counts
    const campaignCount = await Campaign.countDocuments();
    console.log(`📈 Total campaigns: ${campaignCount}`);

    if (campaignCount === 0) {
      console.log('❌ No campaigns found in database');
      return;
    }

    // Get all campaigns with basic info
    console.log('\n📋 All Campaigns:');
    console.log('='.repeat(80));
    
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .lean();

    for (const campaign of campaigns) {
      console.log(`
🔷 Campaign: ${campaign.name}
   ID: ${campaign._id}
   Status: ${campaign.status}
   Created: ${campaign.createdAt}
   Created by: ${campaign.createdBy}
   Message: ${campaign.message.substring(0, 100)}${campaign.message.length > 100 ? '...' : ''}
   Sent: ${campaign.sentCount} | Delivered: ${campaign.deliveredCount} | Failed: ${campaign.failedCount}
   ${'-'.repeat(70)}`);
    }

    // Get campaign status summary
    console.log('\n📊 Campaign Status Summary:');
    const statusCounts = await Campaign.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    statusCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count}`);
    });

    // Get communication logs count
    const logsCount = await CommunicationLog.countDocuments();
    console.log(`\n📧 Total communication logs: ${logsCount}`);

    // Recent campaigns (last 5)
    console.log('\n🕒 Recent Campaigns (Last 5):');
    const recentCampaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status createdAt sentCount deliveredCount failedCount')
      .lean();

    recentCampaigns.forEach((campaign, index) => {
      console.log(`${index + 1}. ${campaign.name} [${campaign.status}] - ${campaign.createdAt}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the script
viewCampaigns(); 