import Campaign from '../models/Campaign.js';
import Customer from '../models/Customer.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { buildQueryFromRules } from './segmentController.js';
import { addToStream } from '../utils/redisClient.js';

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const campaignData = req.body;
    
    // Basic validation
    if (!campaignData.name || !campaignData.segmentRules || !campaignData.message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Add creator info
    campaignData.createdBy = req.user.email;
    
    // Create the campaign
    const campaign = new Campaign(campaignData);
    await campaign.save();
    
    // If campaign is not in draft status, send messages
    if (campaignData.status !== 'draft') {
      // Process in background to not block response
      processCampaign(campaign._id).catch(err => 
        console.error(`Error processing campaign ${campaign._id}:`, err)
      );
    }
    
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

// Background processing function to send campaign messages
const processCampaign = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      console.error(`Campaign ${campaignId} not found`);
      return;
    }
    
    // Update status to in-progress
    campaign.status = 'in-progress';
    await campaign.save();
    
    // Get customers matching segment rules
    const query = buildQueryFromRules(campaign.segmentRules);
    const customers = await Customer.find(query);
    
    console.log(`Processing campaign ${campaignId} for ${customers.length} customers`);
    
    // Initialize campaign stats
    campaign.sentCount = customers.length;
    campaign.deliveredCount = 0;
    campaign.failedCount = 0;
    await campaign.save();
    
    // Send messages to each customer
    const sendPromises = customers.map(async (customer) => {
      try {
        // Create communication log entry
        const communicationLog = new CommunicationLog({
          customer: customer._id,
          campaign: campaign._id,
          type: 'email',
          message: campaign.message,
          status: 'sent'
        });
        
        await communicationLog.save();
        
        // Send to dummy vendor API (simulate delivery) - don't wait for result
        sendToDummyVendor(customer, campaign, communicationLog._id).catch(err => 
          console.error(`Error in delivery simulation for ${customer.email}:`, err)
        );
        
        return { success: true, customerId: customer._id };
      } catch (error) {
        console.error(`Error sending message to customer ${customer._id}:`, error);
        return { success: false, customerId: customer._id, error };
      }
    });
    
    await Promise.all(sendPromises);
    
    // Set a timeout to force campaign completion if needed (30 seconds)
    setTimeout(async () => {
      try {
        const timeoutCampaign = await Campaign.findById(campaignId);
        if (timeoutCampaign && timeoutCampaign.status === 'in-progress') {
          console.log(`⏰ Campaign ${campaignId} timeout - forcing completion check`);
          await updateCampaignStats(campaignId);
        }
      } catch (error) {
        console.error(`Error in campaign timeout handler:`, error);
      }
    }, 30000); // 30 second timeout
    
    // Note: Campaign completion will be handled by delivery receipt processor
    // when all delivery statuses are received
    console.log(`Campaign ${campaignId} messages sent. Waiting for delivery receipts...`);
  } catch (error) {
    console.error(`Error processing campaign ${campaignId}:`, error);
    
    // Update campaign status to failed
    await Campaign.findByIdAndUpdate(campaignId, { status: 'failed' });
  }
};

// Update campaign stats when delivery status changes (called from delivery controller)
export const updateCampaignStats = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;
    
    // Count actual delivery statuses from communication logs
    const deliveredCount = await CommunicationLog.countDocuments({
      campaign: campaignId,
      status: 'delivered'
    });
    
    const failedCount = await CommunicationLog.countDocuments({
      campaign: campaignId,
      status: 'failed'
    });
    
    const totalProcessed = deliveredCount + failedCount;
    
    // Update campaign stats
    campaign.deliveredCount = deliveredCount;
    campaign.failedCount = failedCount;
    
    // Only mark campaign as completed if we have processed all expected messages
    // and the campaign is currently in-progress
    if (campaign.status === 'in-progress' && 
        campaign.sentCount > 0 && 
        totalProcessed >= campaign.sentCount) {
      
      campaign.status = 'completed';
      
      // Calculate success rate with safeguards
      const successRate = campaign.sentCount > 0 
        ? Math.round((deliveredCount / campaign.sentCount) * 100)
        : 0;
      
      console.log(`Campaign ${campaignId} completed. Sent: ${campaign.sentCount}, Delivered: ${deliveredCount}, Failed: ${failedCount}, Success Rate: ${successRate}%`);
    } else if (campaign.status === 'in-progress') {
      // Campaign still in progress - log current stats
      const currentSuccessRate = campaign.sentCount > 0 
        ? Math.round((deliveredCount / campaign.sentCount) * 100)
        : 0;
      
      console.log(`Campaign ${campaignId} progress: Processed ${totalProcessed}/${campaign.sentCount}, Delivered: ${deliveredCount}, Failed: ${failedCount}, Current Rate: ${currentSuccessRate}%`);
    }
    
    await campaign.save();
  } catch (error) {
    console.error('Error updating campaign stats:', error);
  }
};

// Send message to dummy vendor API (simulate delivery)
const sendToDummyVendor = async (customer, campaign, logId) => {
  try {
    console.log(`Sending message to customer ${customer.email} for campaign ${campaign.name}`);
    
    // Simulate a success rate between 90-100%
    // Generate random number between 0.9 and 1.0 (90% to 100%)
    const successThreshold = 0.9 + (Math.random() * 0.1); // Random between 0.9 and 1.0
    const success = Math.random() < successThreshold;
    
    // Simulate API call delay (100ms to 500ms)
    const delay = Math.floor(Math.random() * 400) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (success) {
      console.log(`✅ Message delivered to ${customer.email}`);
      
      // Add a small delay to spread out the Redis stream additions
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 100) + 50));
      
      // Simulate delivery receipt by adding to Redis stream
      await addToStream('deliveryStream', {
        messageId: logId.toString(),
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      });
      
    } else {
      console.log(`❌ Message failed to deliver to ${customer.email}`);
      
      // Add a small delay to spread out the Redis stream additions
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 100) + 50));
      
      // Add failed delivery to stream
      await addToStream('deliveryStream', {
        messageId: logId.toString(),
        status: 'failed',
        deliveredAt: new Date().toISOString()
      });
    }
    
    return { success };
  } catch (error) {
    console.error('Error in dummy vendor simulation:', error);
    
    // Add failed delivery to stream for processing
    await addToStream('deliveryStream', {
      messageId: logId.toString(),
      status: 'failed',
      deliveredAt: new Date().toISOString(),
      error: error.message
    });
    
    throw error;
  }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const campaigns = await Campaign.find()
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Campaign.countDocuments();
    
    res.status(200).json({
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Error fetching campaign', error: error.message });
  }
};

// Update a campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Check if we're changing from draft to active status
    const activating = campaign.status === 'draft' && 
                      ['scheduled', 'in-progress'].includes(updateData.status);
    
    // Update the campaign
    Object.assign(campaign, updateData);
    await campaign.save();
    
    // If activating the campaign, process it
    if (activating) {
      processCampaign(campaign._id).catch(err => 
        console.error(`Error processing campaign ${campaign._id}:`, err)
      );
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Error updating campaign', error: error.message });
  }
};

// Delete a campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    
    if (!deletedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Also delete related communication logs
    await CommunicationLog.deleteMany({ campaign: id });
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Error deleting campaign', error: error.message });
  }
};