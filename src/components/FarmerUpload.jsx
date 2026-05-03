import React, { useState } from 'react';

import { Upload, Plus, Sprout, Tag, Package } from 'lucide-react';

const FarmerUpload = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setFormData({ name: '', price: '', quantity: '' });
    alert('Product added successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card"
    >
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>List Your Harvest</h2>
          <p>Add products directly to customers</p>
        </div>
        <Sprout color="#2D5A27" size={32} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Product Name</label>
          <div style={{ position: 'relative' }}>
            <Plus size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9CA3AF' }} />
            <input 
              type="text" 
              placeholder="e.g. Organic Tomatoes" 
              style={{ paddingLeft: '48px' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label className="input-label">Price (₹/kg)</label>
            <div style={{ position: 'relative' }}>
              <Tag size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9CA3AF' }} />
              <input 
                type="number" 
                placeholder="40" 
                style={{ paddingLeft: '48px' }}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Quantity (kg)</label>
            <div style={{ position: 'relative' }}>
              <Package size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9CA3AF' }} />
              <input 
                type="number" 
                placeholder="50" 
                style={{ paddingLeft: '48px' }}
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Upload Image (Optional)</label>
          <div style={{ 
            border: '2px dashed #E0E7DE', 
            borderRadius: '16px', 
            padding: '32px', 
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
          }}>
            <Upload size={24} color="#9CA3AF" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '14px' }}>Click to upload product photo</p>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          List Product <Plus size={18} />
        </button>
      </form>

      <div style={{ marginTop: '32px', borderTop: '1px solid #E0E7DE', paddingTop: '20px' }}>
        <p style={{ fontSize: '13px', fontStyle: 'italic' }}>
          "Farmers can upload their agricultural products directly to the platform with price and quantity details. This removes middlemen from the selling process."
        </p>
      </div>
    </motion.div>
  );
};

export default FarmerUpload;
