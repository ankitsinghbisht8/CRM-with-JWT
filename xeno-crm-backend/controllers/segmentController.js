import Customer from '../models/Customer.js';

// Helper function to build MongoDB query from segment rules
const buildQueryFromRules = (rules) => {
  if (!rules || !rules.conditions || rules.conditions.length === 0) {
    return {};
  }

  const { operator, conditions } = rules;
  const mongoOperator = operator === 'AND' ? '$and' : '$or';
  
  const mongoConditions = conditions.map(condition => {
    const { field, operator: condOperator, value } = condition;
    
    // Handle different field types
    let parsedValue = value;
    if (field === 'totalSpend' || field === 'visits') {
      parsedValue = Number(value);
    } else if (field === 'inactiveDays') {
      // For inactiveDays, we need to calculate the date
      const date = new Date();
      date.setDate(date.getDate() - Number(value));
      return { lastActive: { '$lte': date } };
    }
    
    // Map operators to MongoDB operators
    switch (condOperator) {
      case '>':
        return { [field]: { '$gt': parsedValue } };
      case '<':
        return { [field]: { '$lt': parsedValue } };
      case '=':
        return { [field]: parsedValue };
      case '>=':
        return { [field]: { '$gte': parsedValue } };
      case '<=':
        return { [field]: { '$lte': parsedValue } };
      default:
        return { [field]: parsedValue };
    }
  });
  
  return { [mongoOperator]: mongoConditions };
};

// Preview segment (count customers matching rules)
export const previewSegment = async (req, res) => {
  try {
    const { rules } = req.body;
    
    if (!rules) {
      return res.status(400).json({ message: 'Segment rules are required' });
    }
    
    const query = buildQueryFromRules(rules);
    const count = await Customer.countDocuments(query);
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error previewing segment:', error);
    res.status(500).json({ message: 'Error previewing segment', error: error.message });
  }
};

// Get customers matching segment rules
export const getSegmentCustomers = async (req, res) => {
  try {
    const { rules } = req.body;
    const { page = 1, limit = 10 } = req.query;
    
    if (!rules) {
      return res.status(400).json({ message: 'Segment rules are required' });
    }
    
    const query = buildQueryFromRules(rules);
    
    const customers = await Customer.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Customer.countDocuments(query);
    
    res.status(200).json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching segment customers:', error);
    res.status(500).json({ message: 'Error fetching segment customers', error: error.message });
  }
};

export { buildQueryFromRules };