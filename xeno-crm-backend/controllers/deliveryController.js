import CommunicationLog from '../models/CommunicationLog.js';
import Campaign from '../models/Campaign.js';
import { addToStream } from '../utils/redisClient.js';
import { updateCampaignStats } from './campaignController.js';

// Handle delivery receipt from vendor API
export const handleDeliveryReceipt = async (req, res) => {
  try {
    const { messageId, status, deliveredAt } = req.body;
    
    if (!messageId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Add to Redis Stream for batch processing
    await addToStream('deliveryStream', {
      messageId,
      status,
      deliveredAt: deliveredAt || new Date().toISOString()
    });
    
    res.status(202).json({ message: 'Delivery receipt queued for processing' });
  } catch (error) {
    console.error('Error handling delivery receipt:', error);
    res.status(500).json({ message: 'Error handling delivery receipt', error: error.message });
  }
};

// Update delivery status in batch (called by consumer)
export const updateDeliveryStatusBatch = async (deliveryUpdates) => {
  try {
    if (!deliveryUpdates || deliveryUpdates.length === 0) {
      return { processed: 0 };
    }
    
    console.log(`Batch updating ${deliveryUpdates.length} delivery statuses`);
    
    // Prepare bulk operations
    const bulkOps = deliveryUpdates.map(update => ({
      updateOne: {
        filter: { _id: update.messageId },
        update: { 
          status: update.status,
          deliveredAt: update.deliveredAt,
          'metadata.processedAt': new Date()
        }
      }
    }));
    
    // Execute bulk update
    const result = await CommunicationLog.bulkWrite(bulkOps);
    
    // Update campaign stats for affected campaigns
    await updateAffectedCampaigns(deliveryUpdates);
    
    console.log(`Batch processed ${result.modifiedCount} of ${deliveryUpdates.length} delivery updates`);
    
    return {
      processed: result.modifiedCount,
      total: deliveryUpdates.length
    };
  } catch (error) {
    console.error('Error batch updating delivery status:', error);
    throw error;
  }
};

// Update campaign stats for affected campaigns
const updateAffectedCampaigns = async (deliveryUpdates) => {
  try {
    // Get all communication logs to find their campaigns
    const messageIds = deliveryUpdates.map(update => update.messageId);
    const logs = await CommunicationLog.find({ _id: { $in: messageIds } })
      .select('campaign');
    
    // Get unique campaign IDs
    const campaignIds = [...new Set(logs.map(log => log.campaign?.toString()).filter(Boolean))];
    
    // Update stats for each affected campaign
    for (const campaignId of campaignIds) {
      await updateCampaignStats(campaignId);
    }
  } catch (error) {
    console.error('Error updating affected campaigns:', error);
  }
};