import React, { useState } from 'react';

import { CreditCard, Banknote, CheckCircle, ChevronLeft } from 'lucide-react';

const PaymentPage = ({ order, onBack, onComplete }) => {
  const [method, setMethod] = useState('upi');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ marginBottom: 0 }}>Payment Method</h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ marginBottom: '16px' }}>Payable Amount: <strong style={{ color: 'var(--primary)', fontSize: '20px' }}>₹{order.price * order.orderQty}</strong></p>
      </div>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
        <div 
          onClick={() => setMethod('upi')}
          style={{ 
            padding: '20px', 
            borderRadius: '16px', 
            border: `2px solid ${method === 'upi' ? 'var(--primary)' : '#E0E7DE'}`,
            background: method === 'upi' ? 'rgba(45, 90, 39, 0.05)' : 'var(--white)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ color: 'var(--primary)' }}>
            <CreditCard size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>UPI Payment</h4>
            <p style={{ fontSize: '12px', margin: 0 }}>Google Pay, PhonePe, Paytm</p>
          </div>
          {method === 'upi' && <CheckCircle size={20} color="var(--primary)" />}
        </div>

        <div 
          onClick={() => setMethod('cod')}
          style={{ 
            padding: '20px', 
            borderRadius: '16px', 
            border: `2px solid ${method === 'cod' ? 'var(--primary)' : '#E0E7DE'}`,
            background: method === 'cod' ? 'rgba(45, 90, 39, 0.05)' : 'var(--white)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ color: 'var(--primary)' }}>
            <Banknote size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>Cash on Delivery</h4>
            <p style={{ fontSize: '12px', margin: 0 }}>Pay when you receive items</p>
          </div>
          {method === 'cod' && <CheckCircle size={20} color="var(--primary)" />}
        </div>
      </div>

      <button className="btn btn-primary" onClick={onComplete}>
        Complete Transaction
      </button>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px' }}>
          “The application supports secure digital payment and cash on delivery to build trust between farmers and customers.”
        </p>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
