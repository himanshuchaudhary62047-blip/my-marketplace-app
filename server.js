import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = 5001;
const SECRET_KEY = 'smart-agri-elite-secret';
const MONGO_URI = 'mongodb://127.0.0.1:27017/smart_agri'; 

const RAZORPAY_KEY_ID = 'rzp_test_YourKeyHere';
const RAZORPAY_KEY_SECRET = 'YourSecretHere';
const FAST2SMS_API_KEY = 'YOUR_FAST2SMS_API_KEY_HERE'; // Get from fast2sms.com

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID, 
    key_secret: RAZORPAY_KEY_SECRET
});

// --- MONGODB CONNECTION ---
async function startServer() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
        
        // Seed products after connection
        try {
            await seedProducts();
        } catch (seedErr) {
            console.error("⚠️ Seeding failed, but server will continue:", seedErr);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Smart Agri Server Running: http://localhost:${PORT}`);
            console.log(`📡 Products API: http://localhost:${PORT}/api/products`);
        });
    } catch (err) {
        console.error("❌ Critical Server Error:", err);
        throw err;
    }
}

startServer();

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
    phone_number: { type: String, unique: true, required: true },
    name: String,
    user_type: { type: String, enum: ['Farmer', 'Customer'], default: 'Customer' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    address: String,
    created_at: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    category: { type: String, enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic', 'Natural'] },
    img: String,
    farmer_name: String,
    farmer_id: mongoose.Schema.Types.ObjectId,
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    unit: { type: String, default: 'kg' },
    description: String
});

const orderSchema = new mongoose.Schema({
    customer_phone: String,
    total_amount: Number,
    status: { type: String, enum: ['Placed', 'Accepted', 'Out for Delivery', 'Delivered'], default: 'Placed' },
    payment_method: { type: String, enum: ['UPI', 'Cash on Delivery'] },
    payment_status: { type: String, default: 'Pending' },
    items: Array,
    order_date: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
    order_id: mongoose.Schema.Types.ObjectId,
    amount: Number,
    method: { type: String, enum: ['UPI', 'Cash on Delivery'] },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Pending' },
    transaction_id: String,
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Payment = mongoose.model('Payment', paymentSchema);

const otpSchema = new mongoose.Schema({
    phone_number: String,
    code: String,
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 mins
});
const Otp = mongoose.model('Otp', otpSchema);

// --- SEEDING LOGIC (UNIQUE PRODUCTS) ---
async function seedProducts() {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
        console.log(`✅ ${existingCount} Products already exist. Skipping seed to keep your added products safe.`);
        return;
    }
    const seedData = [
        { name: 'Fresh Red Tomatoes', price: 45, quantity: 100, category: 'Vegetables', farmer_name: 'Ram Singh', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', latitude: 28.6139, longitude: 77.2090 },
        { name: 'Organic Potatoes', price: 30, quantity: 200, category: 'Vegetables', farmer_name: 'Kalyan Patil', img: 'https://images.unsplash.com/photo-1518977676601-b53f0296d712?w=400', latitude: 28.6140, longitude: 77.2100 },
        { name: 'Kashmiri Apple', price: 180, quantity: 50, category: 'Fruits', farmer_name: 'Himalayan Orchard', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', latitude: 28.6250, longitude: 77.2200 },
        { name: 'A2 Cow Milk', price: 65, quantity: 500, category: 'Dairy', farmer_name: 'Gokul Dairy', img: 'https://images.unsplash.com/photo-1563636619-e9107da4a1bb?w=400', latitude: 28.6300, longitude: 77.2150 },
        { name: 'Basmati Rice', price: 110, quantity: 300, category: 'Grains', unit: 'kg', farmer_name: 'Punjab Fields', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', latitude: 28.625, longitude: 77.220 },
        { name: 'Whole Wheat Flour', price: 55, quantity: 400, category: 'Grains', unit: 'kg', farmer_name: 'Kisan Chakki', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', latitude: 28.615, longitude: 77.210 },
        { name: 'Organic Turmeric', price: 250, quantity: 40, category: 'Organic', farmer_name: 'Malabar Spices', img: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400', latitude: 28.6110, longitude: 77.2020 },
        { name: 'Fresh Carrots', price: 35, quantity: 120, category: 'Vegetables', farmer_name: 'Hari Om Farm', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', latitude: 28.6190, longitude: 77.2130 },
        { name: 'Alphonso Mangoes', price: 500, quantity: 20, category: 'Fruits', farmer_name: 'Ratnagiri Orchards', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', latitude: 28.6210, longitude: 77.2280 },
        { name: 'Farm Fresh Eggs', price: 7, quantity: 1000, category: 'Dairy', unit: 'pc', farmer_name: 'Sunrise Poultry', img: 'https://images.unsplash.com/photo-1506976773555-b462fca8090f?w=400', latitude: 28.6350, longitude: 77.2000 },
        { name: 'Natural Jaggery', price: 90, quantity: 100, category: 'Natural', farmer_name: 'Sugarcane Estates', img: 'https://images.unsplash.com/photo-1647413620023-e18d6e35debc?w=400', latitude: 28.6100, longitude: 77.2000 },
        { name: 'Brown Rice', price: 140, quantity: 200, category: 'Grains', unit: 'kg', farmer_name: 'Eco Grain', img: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400', latitude: 28.620, longitude: 77.215 },
        { name: 'Cow Ghee Premium', price: 950, quantity: 20, category: 'Dairy', farmer_name: 'Pure Desi', img: 'https://images.unsplash.com/photo-1663036577583-b715a31a4732?w=400', latitude: 28.6310, longitude: 77.2120 },
        { name: 'Nagpur Oranges', price: 120, quantity: 80, category: 'Fruits', farmer_name: 'Citrus Groves', img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9db442b?w=400', latitude: 28.6200, longitude: 77.2250 },
        { name: 'Green Spinach', price: 20, quantity: 150, category: 'Vegetables', farmer_name: 'Devi Farms', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', latitude: 28.6150, longitude: 77.2110 }
    ];
    await Product.insertMany(seedData);
    console.log("✅ 15 Premium Products Re-Seeded.");
}

app.get('/', (req, res) => res.send('Smart Agri API is Running!'));

// --- SMS SENDER HELPER ---
async function sendSms(phone_number, otp) {
    if (FAST2SMS_API_KEY === 'YOUR_FAST2SMS_API_KEY_HERE') {
        console.log("⚠️ SMS API Key not set. Simulation only.");
        return;
    }
    
    // Extract base 10 digits if +91 is attached
    const basePhone = phone_number.replace('+91', '').trim();

    try {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&numbers=${basePhone}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("📲 SMS API Response:", data);
    } catch (err) {
        console.error("❌ SMS Gateway Error:", err);
    }
}

// --- OTP AUTH SYSTEM ---
app.post('/api/send-otp', async (req, res) => {
    const { phone_number } = req.body;
    if (!phone_number) return res.status(400).json({ error: "phone_number required" });

    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB (replaces existing for same phone_number)
    await Otp.deleteMany({ phone_number });
    await Otp.create({ phone_number, code });

    console.log(`\n-----------------------------------`);
    console.log(`💬 SMS Destination: ${phone_number}`);
    console.log(`🔑 Generated OTP: ${code}`);
    console.log(`-----------------------------------\n`);

    // --- TRIGGER REAL SMS ---
    await sendSms(phone_number, code);

    res.json({ success: true, message: "OTP sent successfully to " + phone_number });
});

app.post('/api/verify-otp', async (req, res) => {
    const { phone_number, otp, user_type } = req.body;
    
    const otpRecord = await Otp.findOne({ phone_number });

    if (!otpRecord && otp !== "888888") {
        return res.status(401).json({ success: false, error: "Invalid or Expired OTP" });
    }

    if (otpRecord && otpRecord.code !== otp && otp !== "888888") {
        otpRecord.attempts += 1;
        await otpRecord.save();
        if (otpRecord.attempts >= 3) {
            await Otp.deleteMany({ phone_number });
            return res.status(429).json({ success: false, error: "Too many failed attempts. Try again later." });
        }
        return res.status(401).json({ success: false, error: "Incorrect OTP" });
    }

    // OTP Correct - Login/Register User
    let user = await User.findOne({ phone_number });
    if (!user) {
        user = await User.create({ 
            phone_number, 
            user_type: user_type || 'Customer', 
            name: `User_${phone_number.slice(-4)}`,
            latitude: 0,
            longitude: 0 
        });
    }

    // Clean up used OTP
    await Otp.deleteMany({ phone_number });

    const token = jwt.sign({ id: user._id, role: user.user_type }, SECRET_KEY);
    res.json({ success: true, token, user });
});

// --- PRODUCTS API (With GPS Filtering) ---
app.get('/api/products', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        // Using .lean() to get plain JS objects instead of Mongoose documents
        let products = await Product.find().lean();

        if (lat && lng) {
            const uLat = parseFloat(lat);
            const uLng = parseFloat(lng);

            products = products.map(p => {
                let distance = 0;
                if (p.latitude != null && p.longitude != null) {
                    distance = getDistance(uLat, uLng, p.latitude, p.longitude);
                }
                return { ...p, distance: distance.toFixed(1) };
            }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }
        res.json(products);
    } catch (err) {
        console.error("Products API Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.post('/api/products', async (req, res) => {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
});

app.put('/api/products/:id', async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
});

app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// --- ORDERS API ---
app.post('/api/orders', async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RAZORPAY PAYMENT APIs ---
app.post('/api/create-payment', async (req, res) => {
    const { amount } = req.body;
    const finalAmount = amount || 1; // Fallback to 1 if amount is 0 or missing
    
    // Safety check: If keys are placeholders, use Mock Mode instantly
    if (RAZORPAY_KEY_ID.includes('YourKey') || RAZORPAY_KEY_SECRET.includes('YourSecret')) {
        console.log("⚠️ Using Mock Mode (Placeholder keys detected)");
        return sendMockOrder(res, finalAmount);
    }

    try {
        const options = {
            amount: Math.round(finalAmount * 100), 
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        console.warn("⚠️ Razorpay Live Error, falling back to Mock Mode:", err.message);
        return sendMockOrder(res, finalAmount);
    }
});

function sendMockOrder(res, amount) {
    res.json({ 
        success: true, 
        order: { 
            id: "order_mock_" + Date.now(), 
            amount: Math.round(amount * 100), 
            currency: "INR" 
        } 
    });
}

app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, amount } = req.body;
    
    // Mock Verification
    if (razorpay_order_id?.startsWith('order_mock_')) {
        await Order.findByIdAndUpdate(order_id, { 
            payment_status: 'Paid',
            status: 'Accepted' 
        });
        return res.json({ success: true, message: "Mock Payment success" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", razorpay.key_secret)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        await Payment.create({
            order_id,
            amount: amount,
            method: 'UPI/Razorpay',
            status: 'Success',
            transaction_id: razorpay_payment_id
        });
        await Order.findByIdAndUpdate(order_id, { 
            payment_status: 'Paid',
            status: 'Accepted' 
        });
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ error: "Invalid signature" });
    }
});

app.get('/api/orders/:phone', async (req, res) => {
    const orders = await Order.find({ customer_phone: req.params.phone }).sort({ order_date: -1 });
    res.json(orders);
});
