import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateSegment = () => {
  const navigate = useNavigate();
  const [segmentData, setSegmentData] = useState({
    name: '',
    description: '',
    message: '',
    rules: {
      operator: 'AND',
      conditions: [
        { field: 'totalSpend', operator: '>', value: '' }
      ]
    }
  });
  const [previewCount, setPreviewCount] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fieldOptions = [
    { value: 'totalSpend', label: 'Total Spend' },
    { value: 'visits', label: 'Number of Visits' },
    { value: 'inactiveDays', label: 'Days Since Last Active' }
  ];

  const operatorOptions = [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '=', label: 'Equal to' },
    { value: '>=', label: 'Greater than or equal' },
    { value: '<=', label: 'Less than or equal' }
  ];

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...segmentData.rules.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    
    setSegmentData({
      ...segmentData,
      rules: { ...segmentData.rules, conditions: newConditions }
    });
  };

  const addCondition = () => {
    setSegmentData({
      ...segmentData,
      rules: {
        ...segmentData.rules,
        conditions: [
          ...segmentData.rules.conditions,
          { field: 'totalSpend', operator: '>', value: '' }
        ]
      }
    });
  };

  const removeCondition = (index) => {
    if (segmentData.rules.conditions.length > 1) {
      const newConditions = segmentData.rules.conditions.filter((_, i) => i !== index);
      setSegmentData({
        ...segmentData,
        rules: { ...segmentData.rules, conditions: newConditions }
      });
    }
  };

  const previewSegment = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/segment/preview', {
        rules: segmentData.rules
      });
      setPreviewCount(response.data.count);
    } catch (error) {
      console.error('Error previewing segment:', error);
      setError('Error previewing segment');
    } finally {
      setLoading(false);
    }
  };

  const generateMessages = async () => {
    if (!segmentData.name) {
      setError('Please enter a campaign name first');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/generate-messages', {
        goal: segmentData.name,
        audience: `customers matching the segment criteria`,
        tone: 'professional'
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error generating messages:', error);
      setError('Error generating message suggestions');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!segmentData.name || !segmentData.message) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/campaigns', {
        name: segmentData.name,
        description: segmentData.description,
        segmentRules: segmentData.rules,
        message: segmentData.message,
        status: 'scheduled'
      });
      
      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-segment">
      <div className="page-header">
        <h1>Create Campaign</h1>
        <p>Build your audience and create a targeted campaign</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="segment-form">
        {/* Campaign Details */}
        <div className="card">
          <h2>Campaign Details</h2>
          <div className="form-group">
            <label>Campaign Name *</label>
            <input
              type="text"
              className="form-control"
              value={segmentData.name}
              onChange={(e) => setSegmentData({ ...segmentData, name: e.target.value })}
              placeholder="Enter campaign name"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={segmentData.description}
              onChange={(e) => setSegmentData({ ...segmentData, description: e.target.value })}
              placeholder="Enter campaign description"
              rows="3"
            />
          </div>
        </div>

        {/* Audience Rules */}
        <div className="card">
          <h2>Audience Rules</h2>
          
          <div className="form-group">
            <label>Logical Operator</label>
            <select
              className="form-control"
              value={segmentData.rules.operator}
              onChange={(e) => setSegmentData({
                ...segmentData,
                rules: { ...segmentData.rules, operator: e.target.value }
              })}
            >
              <option value="AND">AND (all conditions must match)</option>
              <option value="OR">OR (any condition can match)</option>
            </select>
          </div>

          <div className="conditions-list">
            {segmentData.rules.conditions.map((condition, index) => (
              <div key={index} className="condition-row">
                <select
                  className="form-control"
                  value={condition.field}
                  onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                >
                  {fieldOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control"
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                >
                  {operatorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                  placeholder="Value"
                />

                {segmentData.rules.conditions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeCondition(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="condition-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addCondition}
            >
              Add Condition
            </button>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={previewSegment}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Preview Audience'}
            </button>
          </div>

          {previewCount !== null && (
            <div className="preview-result">
              <p>
                <strong>Audience Size:</strong> {previewCount} customers match your criteria
              </p>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="card">
          <h2>Campaign Message</h2>
          
          <div className="message-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={generateMessages}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate AI Suggestions'}
            </button>
          </div>

          {loading && (
            <div className="loading-message">
              <p>Generating message suggestions...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {suggestions && suggestions.length > 0 && (
            <div className="suggestions">
              <h3>AI-Generated Suggestions:</h3>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  <p>{suggestion}</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSegmentData({ ...segmentData, message: suggestion })}
                  >
                    Use This Message
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>Message *</label>
            <textarea
              className="form-control"
              value={segmentData.message}
              onChange={(e) => setSegmentData({ ...segmentData, message: e.target.value })}
              placeholder="Enter your campaign message"
              rows="4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/campaigns')}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={createCampaign}
            disabled={loading || !segmentData.name || !segmentData.message}
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .create-segment {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .page-header p {
          color: #6b7280;
        }
        
        .segment-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .card h2 {
          margin-bottom: 1.5rem;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .conditions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .condition-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        
        .condition-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .preview-result {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 0.375rem;
        }
        
        .message-actions {
          margin-bottom: 1rem;
        }
        
        .suggestions {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.375rem;
        }
        
        .suggestions h3 {
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .suggestion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .suggestion-item p {
          margin: 0;
          flex: 1;
          margin-right: 1rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default CreateSegment;