import React, { useState } from 'react';

import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      alert(`Demo Mode: OTP sent to ${phone}\n(In a real app, an SMS would be sent now via Twilio/Firebase)`);
      setStep(2);
    }
    else onLogin();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ marginTop: '40px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          width: '100%', 
          height: '160px', 
          borderRadius: '20px', 
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <img src="/hero.png" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1>Smart Agri Connect</h1>
        <p>A Direct Farm-to-Home Selling System</p>
      </div>

      <form onSubmit={handleNext}>
        {step === 1 ? (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Login</h2>
            <p style={{ marginBottom: '24px' }}>Enter your mobile number to get started</p>
            
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9CA3AF' }} />
                <input 
                  type="tel" 
                  placeholder="9876543210" 
                  style={{ paddingLeft: '48px' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Send OTP <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Verify OTP</h2>
            <p style={{ marginBottom: '24px' }}>Enter the 6-digit code sent to {phone}</p>
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="0 0 0 0 0 0" 
                maxLength="6"
                style={{ textAlign: 'center', letterSpacing: '12px', fontSize: '24px' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Log In <ShieldCheck size={18} />
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', cursor: 'pointer', color: '#2D5A27', fontWeight: 500 }} onClick={() => setStep(1)}>
              Change Phone Number
            </p>
          </motion.div>
        )}
      </form>

      <div style={{ marginTop: '32px', borderTop: '1px solid #E0E7DE', paddingTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px' }}>
          This screen allows farmers and customers to securely log into the application using mobile OTP verification.
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
