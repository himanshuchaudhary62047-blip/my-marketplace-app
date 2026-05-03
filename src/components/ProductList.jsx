import React from 'react';

import { ShoppingCart, User, Search, MapPin } from 'lucide-react';

const categories = ['All', 'Vegetables', 'Fruits', 'Honey', 'Dairy'];

const products = [
  { id: 1, name: 'Organic Tomatoes', price: 40, unit: 'kg', qty: 15, farmer: 'Ram Singh', type: 'Vegetables', img: '/tomatoes.png' },
  { id: 2, name: 'Fresh Spinach', price: 20, unit: 'bunch', qty: 25, farmer: 'Laxman Patil', type: 'Vegetables', img: '/spinach.png' },
  { id: 3, name: 'Small Potatoes', price: 30, unit: 'kg', qty: 40, farmer: 'Sunita Devi', type: 'Vegetables', img: '/hero.png' },
  { id: 4, name: 'Natural Honey', price: 450, unit: 'kg', qty: 5, farmer: 'Ankit Kumar', type: 'Honey', img: '/hero.png' },
];

const ProductList = ({ onSelectProduct }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingBottom: '80px' }}
    >
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ marginBottom: '4px', fontSize: '24px' }}>Fresh Marketplace</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}>
            <MapPin size={14} /> Delivering to <strong>Noida, UP</strong>
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--white)', padding: '12px', borderRadius: '14px', border: '1px solid #E0E7DE' }}>
            <Search size={20} color="var(--primary)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px' }} className="no-scrollbar">
        {categories.map((cat, i) => (
          <div key={cat} style={{ 
            padding: '8px 20px', 
            borderRadius: '20px', 
            background: i === 0 ? 'var(--primary)' : 'var(--white)',
            color: i === 0 ? 'var(--white)' : 'var(--text-main)',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid #E0E7DE',
            cursor: 'pointer'
          }}>
            {cat}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {products.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -5 }}
            className="glass-card"
            style={{ padding: '16px', display: 'flex', gap: '16px', cursor: 'pointer', marginBottom: '0' }}
            onClick={() => onSelectProduct(product)}
          >
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '16px', 
              overflow: 'hidden'
            }}>
              <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div className="flex-between">
                <span className="badge badge-success">{product.type}</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>₹{product.price}</span>
              </div>
              <h3 style={{ fontSize: '17px', margin: '4px 0', fontWeight: 600 }}>{product.name}</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>Available: {product.qty} {product.unit}</p>
              
              <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E0E7DE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={12} color="#5C715A" />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{product.farmer}</span>
                </div>
                <button className="btn btn-primary" style={{ padding: '8px 12px', width: 'auto', borderRadius: '10px' }}>
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(45, 90, 39, 0.05)', borderRadius: '16px' }}>
        <p style={{ fontSize: '13px' }}>
          “Customers can view fresh products listed by farmers and compare prices before placing an order.”
        </p>
      </div>
    </motion.div>
  );
};

export default ProductList;
