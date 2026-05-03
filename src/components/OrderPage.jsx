import React, { useState } from 'react';

import { Minus, Plus, ChevronRight, Truck, Wallet } from 'lucide-react';

const OrderPage = ({ product, onConfirm }) => {
  const [qty, setQty] = useState(1);

  if (!product) return <div>Please select a product first</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 style={{ marginBottom: '24px' }}>Complete Your Order</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '16px', 
          overflow: 'hidden'
        }}>
           <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{product.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '18px' }}>₹{product.price} / {product.unit}</p>
          <p style={{ fontSize: '13px' }}>Sold by: {product.farmer}</p>
        </div>
      </div>

      <div className="flex-between" style={{ padding: '20px', background: 'var(--white)', borderRadius: '16px', marginBottom: '24px' }}>
        <span style={{ fontWeight: 500 }}>Select Quantity ({product.unit})</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E0E7DE', background: 'none' }}
          >
            <Minus size={16} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #E0E7DE', background: 'none' }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <span>Subtotal</span>
          <span>₹{product.price * qty}</span>
        </div>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <span>Delivery Fee</span>
          <span style={{ color: '#2E7D32', fontWeight: 600 }}>FREE</span>
        </div>
        <div style={{ height: '1px', background: '#E0E7DE', margin: '16px 0' }}></div>
        <div className="flex-between" style={{ fontSize: '20px', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary)' }}>₹{product.price * qty}</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => onConfirm({ ...product, orderQty: qty })}>
        Proceed to Payment <ChevronRight size={18} />
      </button>

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', opacity: 0.7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <Truck size={14} /> Express Delivery
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <Wallet size={14} /> Secure Checkout
        </div>
      </div>
    </motion.div>
  );
};

export default OrderPage;
