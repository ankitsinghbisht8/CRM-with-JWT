import Customer from '../models/Customer.js';
import { addToStream } from '../utils/redisClient.js';

// Add a new customer (push to Redis Stream)
export const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    
    // Basic validation
    if (!customerData.email || !customerData.firstName || !customerData.lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: customerData.email });
    if (existingCustomer) {
      return res.status(409).json({ message: 'Customer with this email already exists' });
    }
    
    // Add to Redis Stream
    const streamId = await addToStream('customerStream', customerData);
    console.log('Customer added to Redis stream:', streamId);
    
    res.status(202).json({ 
      message: 'Customer data received and queued for processing',
      streamId
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    console.log('Fetching customers with query:', req.query);
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const customers = await Customer.find()
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Customer.countDocuments();
    console.log(`Found ${total} total customers, returning ${customers.length} for page ${page}`);
    
    if (customers.length === 0) {
      console.log('No customers found in database');
    } else {
      console.log('Sample customer:', customers[0]);
    }
    
    res.status(200).json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// Get a single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};