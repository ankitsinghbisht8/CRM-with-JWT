import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save hook to calculate total amount if not provided
orderSchema.pre('save', function(next) {
  if (!this.totalAmount && this.products && this.products.length > 0) {
    this.totalAmount = this.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
  }
  next();
});

// Post-save hook to update customer's total spend
orderSchema.post('save', async function(doc) {
  try {
    const Customer = mongoose.model('Customer');
    const customer = await Customer.findById(doc.customer);
    
    if (customer && doc.status === 'completed') {
      customer.totalSpend += doc.totalAmount;
      customer.visits += 1;
      customer.lastActive = new Date();
      await customer.save();
    }
  } catch (error) {
    console.error('Error updating customer data:', error);
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;