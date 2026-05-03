import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Star, Truck, MapPin, ShoppingCart, Search, Plus, Award, Camera, User as UserIcon, Zap, TrendingUp, ShoppingBag as BagIcon, Settings, HelpCircle, LogOut, Home, PlusCircle, Package, Minus, CreditCard, CheckCircle, ChevronRight, Menu, X } from "lucide-react";

const API_URL = 'http://localhost:5001/api';
const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400";
const RAZORPAY_KEY = "rzp_test_YourKeyHere";

// --- FIREBASE CONFIG (Aapne firebase console se yahan paste karein) ---
const firebaseConfig = {
  apiKey: "AIzaSyCZVAk5VN4pe_b2gzDcTP0mHOBmwTdO2x0",
  authDomain: "smart-agri-4361c.firebaseapp.com",
  projectId: "smart-agri-4361c",
  storageBucket: "smart-agri-4361c.firebasestorage.app",
  messagingSenderId: "589035921600",
  appId: "1:589035921600:web:11de2264867403dcba4d25"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const TRANSLATIONS = {
  en: {
    welcome: "Welcome Back",
    login_sub: "Login to start your agricultural journey",
    phone_placeholder: "Phone Number",
    get_started: "GET STARTED",
    verify_login: "VERIFY & LOGIN",
    customer: "Customer",
    farmer: "Farmer",
    change_phone: "Change Phone Number",
    Bihar: "Bihar, India",
    AmanKumar: "Aman Kumar",
    Guest: "Welcome Guest",
    Empowering: "Empowering Farmers, Harvest",
    HomeTab: "Home",
    MarketTab: "Market",
    OrdersTab: "Orders",
    ProfileTab: "Profile",
    SellTab: "Sell",
    BasketTab: "Basket",
    MandiPrice: "Today's Market Price",
    CurrentWeather: "Current Weather",
    Sunny: "Sunny",
    IdealHarvest: "Ideal time for harvesting Wheat.",
    ViewDetails: "View Details",
    ExpertAdvice: "Expert Advice",
    CropWeather: "Crop Weather",
    SoilTesting: "Soil Testing",
    DailyMandi: "Daily Mandi Rates",
    MyListings: "My Listings",
    SearchPlaceholder: "Search Rice, Milk, Fruits...",
    AddProduct: "Add New Product",
    ProductName: "Product Name",
    Price: "Price per kg",
    PostListing: "Post Listing",
    UploadPhotos: "Upload Photos",
    NoNearby: "No fresh items found nearby.",
    Trending: "Trending Harvest"
  },
  hi: {
    welcome: "आपका स्वागत है",
    login_sub: "अपनी कृषि यात्रा शुरू करने के लिए लॉगिन करें",
    phone_placeholder: "फ़ोन नंबर दर्ज करें",
    get_started: "शुरू करें",
    verify_login: "सत्यापित करें और लॉगिन करें",
    customer: "ग्राहक",
    farmer: "किसान",
    change_phone: "नंबर बदलें",
    Bihar: "बिहार, भारत",
    AmanKumar: "अमन कुमार",
    Guest: "अतिथि",
    Empowering: "कृषि और किसानों की मुस्कान",
    HomeTab: "होम",
    MarketTab: "बाज़ार",
    OrdersTab: "ऑर्डर्स",
    ProfileTab: "प्रोफ़ाइल",
    SellTab: "बेचें",
    BasketTab: "टोकरी",
    MandiPrice: "आज का मंडी भाव",
    CurrentWeather: "वर्तमान मौसम",
    Sunny: "धूप",
    IdealHarvest: "गेहूं की कटाई के लिए उत्तम समय।",
    ViewDetails: "विवरण देखें",
    ExpertAdvice: "विशेषज्ञ सलाह",
    CropWeather: "फसल मौसम",
    SoilTesting: "मिट्टी परीक्षण",
    DailyMandi: "दैनिक मंडी भाव",
    MyListings: "मेरी लिस्टिंग",
    SearchPlaceholder: "चावल, दूध, फल खोजें...",
    AddProduct: "नया उत्पाद जोड़ें",
    ProductName: "उत्पाद का नाम",
    Price: "कीमत (प्रति किलो)",
    PostListing: "लिस्टिंग डालें",
    UploadPhotos: "फोटो अपलोड करें",
    NoNearby: "आस-पास कोई सामान नहीं मिला।",
    Trending: "ट्रेंडिंग हार्वेस्ट"
  },
  bn: {}, mr: {}, ta: {}
};

const CATEGORIES = [
  { id: 'all', name: { en: 'All', hi: 'सभी' }, icon: '🌱' },
  { id: 'Vegetables', name: { en: 'Veg', hi: 'सब्जी' }, icon: '🍅' },
  { id: 'Fruits', name: { en: 'Fruits', hi: 'फल' }, icon: '🍎' },
  { id: 'Dairy', name: { en: 'Dairy', hi: 'डेयरी' }, icon: '🥛' },
  { id: 'Grains', name: { en: 'Grains', hi: 'अनाज' }, icon: '🌾' },
  { id: 'Organic', name: { en: 'Organic', hi: 'ऑर्गेनिक' }, icon: '🥗' },
  { id: 'Natural', name: { en: 'Natural', hi: 'प्राकृतिक' }, icon: '🍯' },
];

const MANDI_PRICES = [
  { crop: { en: 'Wheat', hi: 'गेहूं' }, price: '2,500', market: 'Patna Mandi' },
  { crop: { en: 'Rice', hi: 'चावल' }, price: '5,500', market: 'Muzaffarpur Mandi' },
  { crop: { en: 'Corn', hi: 'मक्का' }, price: '1,850', market: 'Gaya Mandi' },
];

const App = () => {
  const [lang, setLang] = useState('en'); 
  const t = (key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS['en'][key] || key;

  const [view, setView] = useState('login'); 
  const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('Customer'); // Farmer or Customer
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [phone, setPhone] = useState('6204738184');
  const [otp, setOtp] = useState('');
  const [location, setLocation] = useState(null); // { lat, lng, address }
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [payMethod, setPayMethod] = useState('UPI');
  const [deliveryMode, setDeliveryMode] = useState('Home Delivery');
  const [isPaying, setIsPaying] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Vegetables', unit: 'kg' });
  const [imgPreview, setImgPreview] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const fetchProducts = async (lat = null, lng = null) => {
    try {
      let url = `${API_URL}/products`;
      if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log("API Fetch Products:", data); // For debugging
        if (Array.isArray(data)) {
           setProducts(data.filter(p => p.name && p.price));
        } else {
           console.error("API returned non-array data:", data);
           setProducts([]);
        }
      }
    } catch (err) {
      console.warn("Server connection failed:", err);
    }
  };

  const handleRazorpay = async (orderData, amount, orderId) => {
    if (orderData.id.startsWith('order_mock_')) {
      setPendingOrder({ orderData, amount, orderId });
      setShowUPIModal(true);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "Smart Agri Connect",
      description: "Organic Harvest Payment",
      image: FALLBACK_IMG,
      order_id: orderData.id,
      handler: async (res) => {
        const verifyRes = await fetch(`${API_URL}/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            order_id: orderId,
            amount: amount
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setCheckoutStep(2);
          setCart([]);
          setIsPaying(false);
        }
      },
      prefill: {
        contact: phone,
      },
      theme: { color: "#2d6a4f" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Current Location"
        };
        setLocation(coords);
        fetchProducts(coords.lat, coords.lng);
        setLoadingLocation(false);
      },
      () => {
        alert("Unable to retrieve your location. Showing all products.");
        setLoadingLocation(false);
        fetchProducts();
      }
    );
  };

  useEffect(() => {
    if (location) {
      fetchProducts(location.lat, location.lng);
    } else {
      fetchProducts();
    }
     
  }, [tab, location]);

  useEffect(() => {
    // Keep recaptcha ready when on login view
    if (view === 'login') {
      setupRecaptcha();
    }
  }, [view]);

  const requestOtp = async () => {
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    
    // For real firebase, the user needs to set their config keys from console.
    // If not setup, default fallback triggers.
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase not configured. Using Mock step");
      setLoginStep(2);
      alert("Firebase not configured. Mock OTP Sent. Enter 888888 for demo.");
      return;
    }

    const fullPhone = "+91" + phone.replace('+91', '').trim();
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setLoginStep(2);
      // alert("OTP sent successfully to " + fullPhone);
    } catch (e) {
      console.error(e);
      // Fallback for Billing/Too Many Requests
      if (e.message.includes('billing-not-enabled') || e.code === 'auth/too-many-requests' || e.message.includes('too-many-requests') || e.code === 'auth/internal-error') {
         setIsDemoMode(true);
         setConfirmationResult('MOCK_BILLING');
         setLoginStep(2);
      } else {
         alert("Failed to send Firebase OTP: " + e.message);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      alert("Please enter 6 digit OTP.");
      return;
    }
    const fullPhone = "+91" + phone.replace('+91', '').trim();
    
    // Fallback Mock Validation
    if ((firebaseConfig.apiKey === "YOUR_API_KEY" || confirmationResult === 'MOCK_BILLING') && otp === "888888") {
       finishLogin(fullPhone, role);
       return;
    }

    try {
      // 1. Firebase Validation
      if (!confirmationResult) throw new Error("Please request OTP first");
      await confirmationResult.confirm(otp);
      
      // 2. Register/Login on our Backend
      finishLogin(fullPhone, role);
    } catch (err) {
      console.error(err);
      alert("Invalid OTP or Failed Verification: " + err.message);
    }
  };

  const finishLogin = async (fullPhone, roleType) => {
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: fullPhone, 
          otp: "888888", // Sent backend master to just fetch/create user since frontend verified
          user_type: roleType 
        })
      });
      const data = await res.json();
      if (data?.success) {
        setUser({ ...data.user, role: roleType }); 
        setView('home');
        if (roleType === 'Farmer') setTab('sell');
      } else {
         throw new Error(data.error);
      }
    } catch(err) {
       console.warn("Server issue:", err);
       setUser({ name: roleType === 'Farmer' ? 'Test Farmer' : 'Test Customer', phone: phone, role: roleType }); 
       setView('home');
       if (roleType === 'Farmer') setTab('sell');
    }
  }

  const addToCart = (p, qty = 1) => {
    const exists = cart.find(i => i.id === p._id || i.id === p.id);
    const pId = p._id || p.id;
    if (exists) setCart(cart.map(i => (i.id === pId) ? { ...i, qty: i.qty + qty } : i));
    else setCart([...cart, { ...p, id: pId, qty }]);
  };

  const filteredProducts = products.filter(p => {
    if (!p || !p.name) return false;
    const matchesCat = cat === 'all' || p.category === cat;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.farmer_name || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (view === 'login') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1b4332] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-[100px] -right-[80px] w-[300px] h-[300px] bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[20%] -left-[50px] w-[150px] h-[150px] bg-white/5 rounded-[40px] rotate-[25deg]"></div>
        
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-sm font-bold outline-none cursor-pointer hover:bg-white/20 transition"
          >
            <option value="en" className="text-black">English</option>
            <option value="hi" className="text-black">हिन्दी</option>
            <option value="bn" className="text-black">বাংলা (Bengali)</option>
            <option value="mr" className="text-black">मराठी (Marathi)</option>
            <option value="ta" className="text-black">தமிழ் (Tamil)</option>
          </select>
        </div>

        <div className="w-full max-w-md h-full md:h-auto flex flex-col md:bg-white md:rounded-[45px] md:overflow-hidden md:shadow-2xl z-10 relative">
          <div className="animate-fade px-8 pt-16 pb-10 md:bg-[#1b4332]">
            <h1 className="text-white text-4xl font-black tracking-tight">Smart Agri</h1>
            <p className="text-white/70 font-semibold text-lg mt-2">{t('Empowering')}</p>
          </div>

          <div className="animate-fade bg-white rounded-t-[45px] md:rounded-none px-8 py-10 flex-1 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.15)] md:shadow-none">
            <div className="text-center mb-8">
              <div className="w-[120px] h-[120px] rounded-[40px] overflow-hidden mx-auto mb-5 border-4 border-[#f0f7f0] shadow-xl">
                {role === 'Farmer' ? (
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#f0f7f0] flex items-center justify-center text-[50px]">🥗</div>
                )}
              </div>
              <h2 className="text-2xl font-black text-[#1b4332]">{role === 'Farmer' ? t('AmanKumar') : t('Guest')}</h2>
              <p className="text-[#888] font-bold text-sm mt-1">{role === 'Farmer' ? t('Bihar') : t('login_sub')}</p>
            </div>

            {loginStep === 1 ? (
              <div className="grid gap-5">
                <div className="bg-[#f4f8f4] rounded-3xl p-1.5 flex border border-[#e8f5e9]">
                  <button onClick={() => setRole('Customer')} className={`flex-1 py-3.5 rounded-[20px] font-extrabold transition-all duration-300 ${role === 'Customer' ? 'bg-[#1b4332] text-white shadow-md' : 'bg-transparent text-[#666] hover:bg-black/5'}`}>
                    {t('customer')}
                  </button>
                  <button onClick={() => setRole('Farmer')} className={`flex-1 py-3.5 rounded-[20px] font-extrabold transition-all duration-300 ${role === 'Farmer' ? 'bg-[#1b4332] text-white shadow-md' : 'bg-transparent text-[#666] hover:bg-black/5'}`}>
                    {t('farmer')}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-5 top-5 font-extrabold text-[#1b4332] text-base border-r-2 border-[#edf2ef] pr-3">+91</div>
                  <input className="input-field pl-[75px] h-[64px] rounded-[22px]" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('phone_placeholder')} />
                </div>

                <button className="btn-primary h-[64px] bg-[#1b4332] rounded-[22px] text-lg mt-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={requestOtp}>
                  {t('get_started')} <ChevronRight size={22} className="ml-2" />
                </button>
                
                <div id="recaptcha-container"></div>
                
                <p className="text-center text-xs text-[#999] font-medium mt-4 leading-relaxed">
                  By continuing, you verify that you agree <br/> 
                  to our <span className="text-[#1b4332] font-extrabold cursor-pointer">Terms</span> & <span className="text-[#1b4332] font-extrabold cursor-pointer">Privacy Settings</span>
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="text-center">
                  {isDemoMode && (
                    <div className="bg-[#fff3e0] p-3 rounded-2xl mb-5 border border-[#ffe0b2]">
                      <p className="text-[#e65100] text-sm font-bold">⚠️ {lang === 'en' ? 'Demo Mode: Enter 888888' : 'डेमो मोड: 888888 दर्ज करें'}</p>
                    </div>
                  )}
                  <p className="text-[#666] text-base font-semibold">{lang === 'en' ? 'Code sent to' : 'कोड भेजा गया है'} <b className="text-[#1b4332]">+91 {phone}</b></p>
                </div>
                <input 
                  className="input-field h-[75px] text-center text-4xl tracking-[12px] font-black text-[#1b4332] rounded-[22px]" 
                  maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  autoFocus
                />
                <button className="btn-primary h-[64px] bg-[#1b4332] rounded-[22px] mt-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={handleVerifyOtp}>
                  {t('verify_login')}
                </button>
                <div className="text-center mt-2">
                  <button onClick={() => setLoginStep(1)} className="text-[#1b4332] font-extrabold text-sm hover:underline p-2">{t('change_phone')}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen flex w-full bg-[#f8faf8] flex-col md:flex-row overflow-hidden min-h-screen h-[100dvh]">
      {/* Mobile Top Navbar */}
      {view !== 'login' && !selectedProduct && checkoutStep !== 2 && (
        <div className="md:hidden flex items-center justify-between bg-[#1b4332] text-white p-4 shrink-0 z-40">
           <h1 className="text-xl font-bold">Smart Agri</h1>
           <button onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
           </button>
        </div>
      )}

      {/* Mobile Drawer */}
      {view !== 'login' && mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-[200] flex animate-fade">
           <div className="w-[75%] max-w-[300px] bg-[#1b4332] h-full p-6 flex flex-col justify-between text-white shadow-2xl">
              <div>
                 <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Menu</h1>
                    <button onClick={() => setMobileMenuOpen(false)} className="bg-white/10 p-2 rounded-full"><X size={20} /></button>
                 </div>
                 <div className="flex flex-col gap-4">
                    {role === 'Farmer' ? (
                      <>
                        <NavItem desktop active={tab === 'home'} icon={<Home size={22} />} label={t('HomeTab')} onClick={() => {setTab('home'); setMobileMenuOpen(false);}} />
                        <NavItem desktop active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => {setTab('sell'); setMobileMenuOpen(false);}} />
                        <NavItem desktop active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => {setTab('profile'); setMobileMenuOpen(false);}} />
                      </>
                    ) : (
                      <>
                        <NavItem desktop active={tab === 'home'} icon={<Home size={22} />} label={t('MarketTab')} onClick={() => {setTab('home'); setMobileMenuOpen(false);}} />
                        <NavItem desktop active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => {setTab('sell'); setMobileMenuOpen(false);}} />
                        <NavItem desktop active={tab === 'cart'} icon={<ShoppingCart size={22} />} label={t('BasketTab')} onClick={() => {setTab('cart'); setMobileMenuOpen(false);}} badge={cart.length} />
                        <NavItem desktop active={tab === 'orders'} icon={<Package size={22} />} label={t('OrdersTab')} onClick={() => {setTab('orders'); setMobileMenuOpen(false);}} />
                        <NavItem desktop active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => {setTab('profile'); setMobileMenuOpen(false);}} />
                      </>
                    )}
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20 transition-all" onClick={() => {setRole(role === 'Farmer' ? 'Customer' : 'Farmer'); setMobileMenuOpen(false);}}>
                 <Zap size={20} className="text-yellow-400" />
                 <span className="text-sm font-semibold">{role === 'Farmer' ? 'Switch to Customer' : 'Switch to Farmer'}</span>
              </div>
           </div>
           <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {view !== 'login' && !selectedProduct && checkoutStep !== 2 && (
        <div className="hidden md:flex flex-col w-64 bg-[#1b4332] text-white p-6 justify-between shrink-0">
           <div>
              <h1 className="text-2xl font-bold mb-8">Smart Agri</h1>
              <div className="flex flex-col gap-4">
                 {role === 'Farmer' ? (
                   <>
                     <NavItem desktop active={tab === 'home'} icon={<Home size={22} />} label={t('HomeTab')} onClick={() => setTab('home')} />
                     <NavItem desktop active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => setTab('sell')} />
                     <NavItem desktop active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => setTab('profile')} />
                   </>
                 ) : (
                   <>
                     <NavItem desktop active={tab === 'home'} icon={<Home size={22} />} label={t('MarketTab')} onClick={() => setTab('home')} />
                     <NavItem desktop active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => setTab('sell')} />
                     <NavItem desktop active={tab === 'cart'} icon={<ShoppingCart size={22} />} label={t('BasketTab')} onClick={() => setTab('cart')} badge={cart.length} />
                     <NavItem desktop active={tab === 'orders'} icon={<Package size={22} />} label={t('OrdersTab')} onClick={() => setTab('orders')} />
                     <NavItem desktop active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => setTab('profile')} />
                   </>
                 )}
              </div>
           </div>
           <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20 transition-all" onClick={() => setRole(role === 'Farmer' ? 'Customer' : 'Farmer')}>
              <Zap size={20} className="text-yellow-400" />
              <span className="text-sm font-semibold">{role === 'Farmer' ? 'Switch to Customer' : 'Switch to Farmer'}</span>
           </div>
        </div>
      )}
      
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden content w-full max-w-full">
      {selectedProduct ? (
        <div className="absolute inset-0 w-full h-full bg-white z-[100] overflow-y-auto overflow-x-hidden">
          <div className="relative bg-white border-b border-[#f0f0f0] h-[280px] sm:h-[340px] md:h-[380px]">
            <img
              src={selectedProduct.img}
              onError={(e) => { e.target.src = FALLBACK_IMG; }}
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-md active:scale-95 transition"
              aria-label="Back"
            >
              <ArrowLeft size={22} color="#1b4332" />
            </button>
            <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md">
              <Heart size={22} color="#ff4d4d" />
            </div>
          </div>
          <div className="p-5 sm:p-6 md:p-7 max-w-full">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <p style={{ color: '#2d6a4f', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedProduct.category}</p>
                   <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '5px', color: '#1b4332' }}>{selectedProduct.name}</h1>
                </div>
                <div style={{ background: '#e8f5e9', padding: '5px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <span style={{ fontWeight: 800, color: '#2d6a4f' }}>4.8</span>
                   <Star size={16} fill="#2d6a4f" color="#2d6a4f" />
                </div>
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '25px 0' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: '#2d6a4f' }}>₹{selectedProduct.price}</span>
                <span style={{ color: '#bbb', textDecoration: 'line-through', fontSize: '20px' }}>₹{Math.round(selectedProduct.price * 1.6)}</span>
                <div style={{ background: '#fff3e0', color: '#e65100', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>40% OFF</div>
             </div>

             <div style={{ background: '#f0f7f0', padding: '20px', borderRadius: '20px', border: '1px solid #e8f5e9' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                   <div style={{ background: '#fff', padding: '10px', borderRadius: '12px' }}><Truck size={24} color="#2d6a4f" /></div>
                   <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#1b4332' }}>Fastest Delivery</p>
                      <p style={{ fontSize: '13px', color: '#52b788' }}>By Tomorrow, 8 AM - 10 AM</p>
                   </div>
                </div>
             </div>

             <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1b4332' }}>Farm Description</h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.7', marginTop: '10px' }}>
                  Pure and natural {selectedProduct.name} sourced directly from <strong>{selectedProduct.farmer_name || "Himanshu's Local Farm"}</strong>. 
                  Grown with traditional organic methods and zero pesticides.
                </p>
             </div>
          </div>
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-[#f0f0f0] z-10">
             <button
               type="button"
               className="flex-1 min-h-[48px] px-5 py-4 bg-white border-2 border-[#2d6a4f] font-extrabold text-[#2d6a4f] rounded-2xl text-base active:scale-[0.99] transition"
               onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
             >
               TO BASKET
             </button>
             <button
               type="button"
               className="flex-1 min-h-[48px] px-5 py-4 bg-[#2d6a4f] border-none font-extrabold text-white rounded-2xl text-base shadow-[0_8px_20px_rgba(45,106,79,0.25)] active:scale-[0.99] transition"
               onClick={() => { addToCart(selectedProduct); setTab('cart'); setSelectedProduct(null); }}
             >
               BUY NOW
             </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-full p-0 md:p-6">
            {tab === 'home' && role === 'Farmer' && (
              <div className="bg-[#f8faf8] min-h-full md:rounded-3xl overflow-hidden md:shadow-lg">
                {/* Floating Language Switcher */}
                <div style={{ position: 'absolute', top: 15, right: 20, zIndex: 1001, background: 'rgba(0,0,0,0.5)', padding: '6px 15px', borderRadius: '15px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                   <p style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>English / हिन्दी</p>
                </div>

                {/* Farmer Profile Header */}
                <div style={{ background: '#1b4332', padding: '40px 20px 30px', borderRadius: '0 0 40px 40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                      <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 900 }}>Smart Agri <span style={{ fontWeight: 400, fontSize: '14px', opacity: 0.8 }}>- Dashboard</span></h1>
                      <div style={{ display: 'flex', gap: '10px' }}>
                         <button onClick={() => setRole('Customer')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 15px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>Customer 🛒</button>
                      </div>
                   </div>

                   <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ width: '75px', height: '75px', borderRadius: '25px', border: '3px solid #52b788', overflow: 'hidden' }}>
                         <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                         <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 900 }}>Aman Kumar</h2>
                         <p style={{ color: '#52b788', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14}/> Bihar, India</p>
                      </div>
                   </div>
                </div>

                {/* Market Price Banner */}
                <div style={{ padding: '20px' }}>
                   <div style={{ background: '#fff', borderRadius: '30px', padding: '25px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                         <h3 style={{ fontSize: '15px', color: '#888', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Live Mandi Rates</h3>
                         <div style={{ marginTop: '15px', display: 'grid', gap: '12px' }}>
                            {MANDI_PRICES.map((m, i) => (
                               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <p style={{ fontWeight: 800, color: '#1b4332' }}>{m.crop[lang]}: <span style={{ color: '#2d6a4f' }}>₹{m.price}/quintal</span></p>
                                  <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>{m.market}</span>
                               </div>
                            ))}
                         </div>
                         <button className="btn-primary" style={{ marginTop: '20px', padding: '12px 25px', width: 'auto', borderRadius: '15px', fontSize: '14px' }}>View Full Mandi Report</button>
                      </div>
                      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}><TrendingUp size={120} /></div>
                   </div>

                   {/* Quick Actions Grid */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
                         <div style={{ background: '#f0f7f0', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                            <Zap size={28} color="#2d6a4f" />
                         </div>
                         <p style={{ fontWeight: 800, color: '#1b4332' }}>{t('SoilTesting')}</p>
                      </div>
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
                         <div style={{ background: '#fff3e0', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                            <UserIcon size={28} color="#e65100" />
                         </div>
                         <p style={{ fontWeight: 800, color: '#1b4332' }}>{t('ExpertAdvice')}</p>
                      </div>
                      <div onClick={() => setTab('sell')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
                         <div style={{ background: '#e8f5e9', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                            <Plus size={28} color="#2d6a4f" />
                         </div>
                         <p style={{ fontWeight: 800, color: '#1b4332' }}>{t('SellTab')}</p>
                      </div>
                      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition">
                         <div style={{ background: '#f3e5f5', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                            <Truck size={28} color="#7b1fa2" />
                         </div>
                         <p style={{ fontWeight: 800, color: '#1b4332' }}>{t('CropWeather')}</p>
                      </div>
                   </div>

                   {/* Weather Widget (Simplified) */}
                   <div style={{ marginTop: '25px', background: 'linear-gradient(to right, #52b788, #2d6a4f)', padding: '25px', borderRadius: '30px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <p style={{ fontSize: '14px', fontWeight: 700, opacity: 0.9 }}>{t('CurrentWeather')}</p>
                         <h2 style={{ fontSize: '32px', fontWeight: 900, marginTop: '5px' }}>32°C <span style={{ fontSize: '18px', fontWeight: 600 }}>{t('Sunny')}</span></h2>
                         <p style={{ fontSize: '13px', marginTop: '5px', opacity: 0.8 }}>{t('IdealHarvest')}</p>
                      </div>
                      <Zap size={50} />
                   </div>

                   {/* Seller Dashboard Analytics */}
                   <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-2xl border border-[#f0f0f0] shadow-sm flex flex-col items-center justify-center text-center">
                         <p className="text-[#888] text-xs font-bold mb-1">Total Products</p>
                         <h3 className="text-xl md:text-2xl font-black text-[#1b4332]">{products.filter(p => p.farmer_id === user?._id || p.farmer_name === 'Himalayan Orchard').length}</h3>
                      </div>
                      <div className="bg-[#f0f7f0] p-4 rounded-2xl border border-[#e8f5e9] shadow-sm flex flex-col items-center justify-center text-center">
                         <p className="text-[#2d6a4f] text-xs font-bold mb-1">Orders</p>
                         <h3 className="text-xl md:text-2xl font-black text-[#1b4332]">12</h3>
                      </div>
                      <div className="bg-[#fff3e0] p-4 rounded-2xl border border-[#ffe0b2] shadow-sm flex flex-col items-center justify-center text-center">
                         <p className="text-[#e65100] text-xs font-bold mb-1">Earnings</p>
                         <h3 className="text-xl md:text-2xl font-black text-[#1b4332]">₹45K</h3>
                      </div>
                   </div>

                   {/* My Listings Section */}
                   <div className="mt-8 mb-6">
                      <div className="flex justify-between items-center mb-5">
                         <h2 className="text-xl md:text-2xl font-black text-[#1b4332]">My Crop Listings</h2>
                         <p onClick={() => setTab('sell')} className="text-[#2d6a4f] font-extrabold text-sm cursor-pointer hover:underline">+ Add New</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                         {products.filter(p => p.farmer_name === 'Himalayan Orchard' || !p.farmer_name).slice(0, 3).map((p, i) => (
                            <div key={i} className="bg-white rounded-[20px] p-4 flex items-center gap-4 border border-[#f0f0f0] shadow-sm hover:shadow-md transition active:scale-[0.98] cursor-pointer">
                               <div className="w-[64px] h-[64px] bg-[#f9f9f9] rounded-2xl p-2 shrink-0">
                                  <img src={p.img} className="w-full h-full object-contain" />
                               </div>
                               <div className="flex-1">
                                  <h4 className="font-extrabold text-[#1b4332] text-base md:text-lg">{p.name}</h4>
                                  <p className="text-xs md:text-sm text-[#888] font-bold mt-1">₹{p.price}/{p.unit || 'kg'} • {p.category}</p>
                               </div>
                               <div className="flex gap-2">
                                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100" onClick={(e) => { e.stopPropagation(); setTab('sell'); setNewProduct(p); }}><span className="text-xs font-bold">Edit</span></div>
                                  <div className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100" onClick={async (e) => { e.stopPropagation(); if(confirm('Delete product?')) { await fetch(`${API_URL}/products/${p._id}`, {method: 'DELETE'}); fetchProducts(); } }}><span className="text-xs font-bold">Del</span></div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {tab === 'home' && role === 'Customer' && (
              <div className="bg-[#f8faf8] min-h-full md:rounded-3xl overflow-hidden md:shadow-lg">
                <div style={{ background: '#1b4332', padding: '25px 20px 35px', borderRadius: '0 0 35px 35px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={detectLocation}>
                         <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <MapPin size={22} color="#fff" />
                         </div>
                         <div>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>DELIVER TO</p>
                            <p style={{ fontSize: '15px', color: '#fff', fontWeight: 800 }}>{loadingLocation ? 'Detecting...' : (location ? location.address : 'Select Location ▾')}</p>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                         <button onClick={() => setRole('Farmer')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800 }}>Farmer Mod 🚜</button>
                         <div style={{ position: 'relative', background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '15px' }} onClick={() => setTab('cart')}>
                            <ShoppingCart size={24} color="#fff" />
                            {cart.length > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#ff4d4d', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '3px 7px', borderRadius: '10px', border: '2px solid #1b4332' }}>{cart.length}</span>}
                         </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '18px', padding: '0 18px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                      {(search || cat !== 'all') ? (
                        <ArrowLeft size={22} color="#2d6a4f" onClick={() => { setSearch(''); setCat('all'); }} style={{ cursor: 'pointer', marginRight: '10px' }} />
                      ) : (
                        <Search size={22} color="#888" style={{ marginRight: '10px' }} />
                      )}
                      <input 
                        style={{ flex: 1, height: '58px', border: 'none', outline: 'none', fontSize: '16px', fontWeight: 600 }} 
                        placeholder={t('SearchPlaceholder')} 
                        value={search} onChange={e => setSearch(e.target.value)} 
                      />
                   </div>
                </div>

                <div style={{ padding: '25px 0 15px', display: 'flex', gap: '20px', overflowX: 'auto', paddingLeft: '20px' }} className="no-scrollbar">
                    {CATEGORIES.map(c => (
                      <div key={c.id} style={{ textAlign: 'center', minWidth: '70px', cursor: 'pointer', transition: '0.3s' }} onClick={() => { setCat(c.id); setSearch(''); }}>
                         <div style={{ width: '65px', height: '65px', borderRadius: '22px', background: cat === c.id ? '#1b4332' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto', boxShadow: cat === c.id ? '0 10px 20px rgba(45, 106, 79, 0.2)' : '0 4px 10px rgba(0,0,0,0.03)', border: cat === c.id ? 'none' : '1px solid #f0f0f0' }}>
                           {c.icon}
                         </div>
                          <p style={{ marginTop: '8px', fontSize: '12px', fontWeight: 800, color: cat === c.id ? '#1b4332' : '#888' }}>{c.name[lang]}</p>
                      </div>
                    ))}
                </div>

                <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-black text-[#1b4332]">Trending Harvest</h2>
                      <p className="text-[#2d6a4f] font-extrabold text-sm bg-[#e8f5e9] px-3 py-1.5 rounded-xl">See All</p>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                      {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                           <p className="text-[#aaa]">No fresh items found nearby.</p>
                        </div>
                      ) : filteredProducts.map(p => (
                        <div key={p._id || p.id} className="p-card animate-fade bg-white rounded-[24px] overflow-hidden border border-[#f0f0f0] shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] cursor-pointer" onClick={() => setSelectedProduct(p)}>
                          <div className="h-[180px] bg-white p-4 relative">
                              <img src={p.img || FALLBACK_IMG} onError={(e) => { e.target.src = FALLBACK_IMG; }} className="w-full h-full object-contain" />
                              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[13px] font-extrabold flex items-center gap-1 shadow-sm text-[#2d6a4f]">
                                 <Star size={16} fill="#2d6a4f" color="#2d6a4f" /> {(p.rating || (4.4 + Math.random() * 0.2)).toFixed(1)}
                              </div>
                              <div className="absolute top-3 right-3 bg-[#2d6a4f] text-white px-3 py-1.5 rounded-xl text-[11px] font-extrabold shadow-sm">
                                  {p.distance && p.distance < 1000 ? `${p.distance} km away` : '2 km away'}
                              </div>
                          </div>
                          <div className="p-4 sm:p-5 bg-white">
                              <h4 className="text-[15px] sm:text-base font-bold h-[44px] overflow-hidden text-[#1b4332] leading-snug">{p.name}</h4>
                              <div className="flex justify-between items-end mt-4">
                                <div>
                                   <span className="text-[22px] sm:text-[24px] font-black text-[#2d6a4f]">₹{p.price}</span>
                                   <p className="text-[11px] text-[#bbb] font-extrabold mt-0.5">PER {p.unit?.toUpperCase() || 'KG'}</p>
                                </div>
                                <div className="btn-primary w-[48px] h-[48px] p-0 rounded-2xl shadow-[0_8px_20px_rgba(45,106,79,0.2)] active:scale-95 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); addToCart(p); }}><Plus size={24} /></div>
                              </div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {tab === 'sell' && (
              <div className="bg-white min-h-full md:rounded-3xl p-5 md:p-8 md:shadow-lg">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                  <button
                    type="button"
                    onClick={() => setTab('home')}
                    className="bg-[#f5f8f5] p-3 rounded-xl active:scale-95 transition"
                    aria-label="Back"
                  >
                    <ArrowLeft size={24} color="#2d6a4f" />
                  </button>
                  <h1 className="text-2xl md:text-3xl font-black text-[#1b4332]">Seller Studio</h1>
                </div>

                <div className="bg-[#f0f7f0] rounded-2xl p-4 md:p-5 mb-6 md:mb-8 flex gap-4 items-start">
                  <div className="bg-[#2d6a4f] p-4 rounded-2xl shrink-0">
                    <Award size={30} color="#fff" />
                  </div>
                  <div>
                    <h3 className="text-[#1b4332] font-extrabold text-base">Farmer Verified</h3>
                    <p className="text-[#52b788] font-semibold text-sm mt-1">Your products will be featured on Home.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <button
                    type="button"
                    onClick={() => document.getElementById('fileInput').click()}
                    className="h-[220px] sm:h-[240px] w-full bg-white rounded-[30px] border-[2.5px] border-dashed border-[#e0e0e0] flex flex-col items-center justify-center overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] active:scale-[0.99] transition"
                  >
                    {imgPreview ? (
                      <div className="w-full h-full relative">
                        <img src={imgPreview} className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-2xl text-[#2d6a4f] font-extrabold text-xs">
                          CHANGE PHOTO
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-[#f0f7f0] p-6 rounded-[25px] mb-4">
                          <Camera size={45} color="#2d6a4f" />
                        </div>
                        <p className="font-extrabold text-[#2d6a4f] text-base">Upload Harvest Photo</p>
                        <p className="text-xs text-[#aaa] mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </button>

                  <div className="grid gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-[#1b4332] mb-2 ml-1">Product Name</p>
                      <input
                        className="input-field"
                        placeholder="e.g. Kashmiri Apples"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <p className="text-[13px] font-bold text-[#1b4332] mb-2 ml-1">Price (₹)</p>
                        <input
                          className="input-field"
                          placeholder="45"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                      </div>

                      <div>
                        <p className="text-[13px] font-bold text-[#1b4332] mb-2 ml-1">Unit</p>
                        <select
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                          className="w-full h-[60px] rounded-[18px] border-2 border-[#edf2ef] bg-white font-extrabold px-4 outline-none"
                        >
                          <option>kg</option>
                          <option>pc</option>
                          <option>bundle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary mt-5 md:mt-6 h-[60px] md:h-[65px] rounded-[20px] bg-[#1b4332] text-base md:text-lg"
                  onClick={async () => {
                    if (!newProduct.name || !newProduct.price) return alert("Please fill all details");
                    const method = newProduct._id ? 'PUT' : 'POST';
                    const url = newProduct._id ? `${API_URL}/products/${newProduct._id}` : `${API_URL}/products`;
                    const res = await fetch(url, {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...newProduct,
                        img: imgPreview || newProduct.img,
                        farmer_name: user?.name,
                        farmer_id: user?._id,
                        latitude: location?.lat || 28.6139,
                        longitude: location?.lng || 77.2090
                      })
                    });
                    if (res.ok) {
                      alert(`Success! Your product has been ${newProduct._id ? 'updated' : 'published'}.`);
                      setNewProduct({ name: '', price: '', category: 'Vegetables', unit: 'kg' });
                      setImgPreview(null);
                      setTab('home');
                      fetchProducts(location?.lat, location?.lng);
                    }
                  }}
                >
                  {newProduct._id ? 'UPDATE HARVEST' : 'PUBLISH HARVEST'}
                </button>
              </div>
            )}

            {tab === 'profile' && (
               <div className="bg-[#f8faf8] min-h-full md:rounded-3xl overflow-hidden md:shadow-lg">
                  <div style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', padding: '60px 25px 40px', color: '#fff', borderRadius: '0 0 40px 40px', position: 'relative' }}>
                     <ArrowLeft size={24} color="#fff" onClick={() => setTab('home')} style={{ position: 'absolute', top: 25, left: 25, cursor: 'pointer' }} />
                     <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                        <div style={{ width: '85px', height: '85px', borderRadius: '30px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                           {role === 'Farmer' ? (
                              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                              <UserIcon size={45} color="#fff" />
                           )}
                        </div>
                        <div>
                           <h2 style={{ fontSize: '26px', fontWeight: 900 }}>{role === 'Farmer' ? 'Aman Kumar' : (user?.name || 'Himanshu Kumar')}</h2>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '10px', marginTop: '6px', width: 'fit-content' }}>
                              <Zap size={14} fill="#ffcc00" color="#ffcc00" />
                              <span style={{ fontSize: '13px', fontWeight: 800 }}>{role === 'Farmer' ? 'Mandi Professional' : `Account Role: ${user?.role || 'User'}`}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div style={{ padding: '25px' }}>
                     {role === 'Customer' && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                           <div className="bg-white p-3 rounded-2xl border border-[#f0f0f0] shadow-sm text-center">
                              <h3 className="text-xl font-black text-[#1b4332]">24</h3>
                              <p className="text-[10px] text-[#888] font-bold uppercase mt-1">Orders</p>
                           </div>
                           <div className="bg-[#f0f7f0] p-3 rounded-2xl border border-[#e8f5e9] shadow-sm text-center">
                              <h3 className="text-xl font-black text-[#2d6a4f]">5</h3>
                              <p className="text-[10px] text-[#2d6a4f] font-bold uppercase mt-1">In Transit</p>
                           </div>
                           <div className="bg-[#fff3e0] p-3 rounded-2xl border border-[#ffe0b2] shadow-sm text-center">
                              <h3 className="text-xl font-black text-[#e65100]">12</h3>
                              <p className="text-[10px] text-[#e65100] font-bold uppercase mt-1">Saved</p>
                           </div>
                        </div>
                     )}
                     <div style={{ background: '#fff', borderRadius: '25px', padding: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                        <ProfileLink icon={<TrendingUp size={20} color="#2d6a4f" />} label="Farmer Analytics" onClick={() => setTab('sell')} />
                        <ProfileLink icon={<BagIcon size={20} color="#2d6a4f" />} label="Order Tracking" onClick={() => setTab('orders')} />
                        <ProfileLink icon={<MapPin size={20} color="#2d6a4f" />} label="Farm Address" />
                        <ProfileLink icon={<Settings size={20} color="#2d6a4f" />} label="Advanced Settings" />
                        <ProfileLink icon={<HelpCircle size={20} color="#2d6a4f" />} label="Help Center" />
                        <div style={{ padding: '20px', color: '#ff4d4d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', borderTop: '1px solid #f9f9f9', marginTop: '10px' }} onClick={() => { setUser(null); setCart([]); setView('login'); setTab('home'); }}>
                           <LogOut size={22} /> System Logout
                        </div>
                     </div>
                     <p style={{ textAlign: 'center', color: '#ccc', fontSize: '12px', marginTop: '30px' }}>Smart Agri v2.0.0 • Made for Farmers</p>
                  </div>
               </div>
            )}

            {tab === 'cart' && (
               <div className="bg-[#f8faf8] min-h-full md:rounded-3xl p-5 md:p-8 md:shadow-lg">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div onClick={() => setTab('home')} style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}><ArrowLeft size={24} color="#2d6a4f" /></div>
                    <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1b4332' }}>Your Basket</h1>
                  </div>
                  
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                       <div style={{ width: '120px', height: '120px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', boxShadow: '0 15px 30px rgba(0,0,0,0.04)' }}>
                          <ShoppingCart size={50} color="#e0e0e0" />
                       </div>
                       <h3 style={{ color: '#1b4332', fontSize: '20px', fontWeight: 800 }}>Basket is empty!</h3>
                       <p style={{ color: '#aaa', marginTop: '5px' }}>Add fresh harvests to get started.</p>
                       <button onClick={() => setTab('home')} style={{ background: '#2d6a4f', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '16px', fontWeight: 800, marginTop: '25px', boxShadow: '0 8px 15px rgba(45, 106, 79, 0.2)' }}>Shop Now</button>
                    </div>
                  ) : (
                    <>
                       <div style={{ display: 'grid', gap: '15px' }}>
                          {cart.map(i => (
                            <div key={i.id} style={{ background: '#fff', padding: '15px', borderRadius: '22px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
                               <div style={{ width: '70px', height: '70px', background: '#f9f9f9', borderRadius: '15px', padding: '10px' }}><img src={i.img || FALLBACK_IMG} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                               <div style={{ flex: 1 }}>
                                  <p style={{ fontWeight: 800, color: '#1b4332', fontSize: '16px' }}>{i.name}</p>
                                  <p style={{ fontSize: '15px', color: '#2d6a4f', fontWeight: 700, marginTop: '2px' }}>₹{i.price}</p>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f5f8f5', padding: '8px 15px', borderRadius: '12px' }}>
                                  <Minus size={18} color="#2d6a4f" style={{ cursor: 'pointer' }} onClick={() => setCart(cart.map(x => x.id === i.id ? {...x, qty: Math.max(1, x.qty-1)} : x))} />
                                  <span style={{ fontWeight: 900, color: '#1b4332', fontSize: '18px', minWidth: '20px', textAlign: 'center' }}>{i.qty}</span>
                                  <Plus size={18} color="#2d6a4f" style={{ cursor: 'pointer' }} onClick={() => setCart(cart.map(x => x.id === i.id ? {...x, qty: x.qty + 1} : x))} />
                               </div>
                            </div>
                          ))}
                       </div>
                       
                       <div style={{ marginTop: '30px', background: '#fff', borderRadius: '25px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontWeight: 600 }}><span>Item Price</span><span>₹{cart.reduce((a, b) => a + (b.price * b.qty), 0)}</span></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontWeight: 600 }}><span>Eco Delivery</span><span style={{ color: '#2d6a4f' }}>FREE</span></div>
                          <div style={{ borderTop: '2px dashed #f0f0f0', margin: '20px 0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                             <span style={{ fontSize: '20px', fontWeight: 900, color: '#1b4332' }}>Grand Total</span>
                             <span style={{ fontSize: '24px', fontWeight: 900, color: '#2d6a4f' }}>₹{cart.reduce((a, b) => a + (b.price * b.qty), 0)}</span>
                          </div>
                       </div>
                       
                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1b4332', marginTop: '30px', marginBottom: '15px' }}>Delivery Method</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                           <div onClick={() => setDeliveryMode('Home Delivery')} className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 ${deliveryMode === 'Home Delivery' ? 'border-[#2d6a4f] bg-[#f0f7f0]' : 'border-[#f0f0f0] bg-white'}`}>
                              <p className="font-extrabold text-[#1b4332] text-sm text-center">Home Delivery</p>
                           </div>
                           <div onClick={() => setDeliveryMode('Self Pickup')} className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-2 ${deliveryMode === 'Self Pickup' ? 'border-[#2d6a4f] bg-[#f0f7f0]' : 'border-[#f0f0f0] bg-white'}`}>
                              <p className="font-extrabold text-[#1b4332] text-sm text-center">Self Pickup</p>
                           </div>
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1b4332', marginTop: '10px', marginBottom: '15px' }}>Choose Payment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div onClick={() => setPayMethod('UPI')} style={{ padding: '20px', borderRadius: '18px', border: '2px solid', borderColor: payMethod === 'UPI' ? '#2d6a4f' : '#f0f0f0', background: payMethod === 'UPI' ? '#f0f7f0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <CreditCard size={24} color="#2d6a4f" />
                              <div style={{ textAlign: 'left' }}>
                                 <p style={{ fontWeight: 800, color: '#1b4332' }}>UPI Payment</p>
                                 <p style={{ fontSize: '12px', color: '#666' }}>Google Pay, PhonePe, Paytm</p>
                              </div>
                           </div>
                           <div onClick={() => setPayMethod('COD')} style={{ padding: '20px', borderRadius: '18px', border: '2px solid', borderColor: payMethod === 'COD' ? '#2d6a4f' : '#f0f0f0', background: payMethod === 'COD' ? '#f0f7f0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ textAlign: 'left' }}>
                                 <p style={{ fontWeight: 800, color: '#1b4332' }}>Cash on Delivery</p>
                                 <p style={{ fontSize: '12px', color: '#666' }}>Pay when you get delivery</p>
                              </div>
                           </div>
                        </div>
                        
                        <button className="btn-primary" 
                          disabled={isPaying}
                          style={{ background: '#1b4332', height: '65px', borderRadius: '20px', fontWeight: 800, fontSize: '18px', marginTop: '30px', boxShadow: '0 10px 20px rgba(27, 67, 50, 0.2)', opacity: isPaying ? 0.7 : 1 }} 
                          onClick={async () => {
                             setIsPaying(true);
                             const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
                             
                             const orderRes = await fetch(`${API_URL}/orders`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                   customer_phone: user?.phone || phone, 
                                   total_amount: total, 
                                   payment_method: payMethod === 'UPI' ? 'UPI' : 'Cash on Delivery',
                                   items: cart 
                                })
                             });
                             const orderData = await orderRes.json();

                             if (payMethod === 'UPI') {
                                const razorRes = await fetch(`${API_URL}/create-payment`, {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({ amount: total })
                                });
                                const razorData = await razorRes.json();
                                if (razorData && razorData.order) { 
                                   handleRazorpay(razorData.order, total, orderData.order._id); 
                                } else { 
                                   alert("Payment Failed. Check Server."); 
                                   setIsPaying(false); 
                                }
                             } else {
                                setIsPaying(false);
                                setCheckoutStep(2);
                                setCart([]);
                             }
                          }}>
                          {isPaying ? 'OPENING PAYMENTS...' : payMethod === 'UPI' ? 'PAY & PLACE ORDER' : 'CONFIRM ORDER'}
                        </button>
                     </>
                  )}
               </div>
            )}

            {tab === 'orders' && (
               <div className="bg-[#f8faf8] min-h-full md:rounded-3xl p-5 md:p-8 md:shadow-lg">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div onClick={() => setTab('home')} style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}><ArrowLeft size={24} color="#2d6a4f" /></div>
                    <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1b4332' }}>Order History</h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((p, idx) => (
                      <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '25px', border: '1px solid #f0f0f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>ORDER #AGR-{1005 + idx}</span>
                          <span style={{ background: idx === 0 ? '#e8f5e9' : '#fff3e0', color: idx === 0 ? '#2d6a4f' : '#e65100', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>
                            {idx === 0 ? 'DELIVERED' : 'IN TRANSIT'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                           <div style={{ width: '50px', height: '50px', background: '#f9f9f9', borderRadius: '12px', padding: '8px' }}>
                             <img src={p.img || FALLBACK_IMG} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                           </div>
                           <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: 800, color: '#1b4332' }}>{p.name}</p>
                              <p style={{ fontSize: '13px', color: '#666' }}>Ordered on {new Date().toLocaleDateString()}</p>
                           </div>
                           <p style={{ fontWeight: 900, color: '#2d6a4f' }}>₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="btn-primary" style={{ background: '#fff', border: '2px solid #2d6a4f', color: '#2d6a4f', width: 'auto', padding: '15px 30px', margin: '0 auto' }} onClick={() => setTab('home')}>SHARE FEEDBACK</button>
                  </div>
               </div>
            )}

            {checkoutStep === 2 && (
              <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                 <div style={{ width: '120px', height: '120px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', boxShadow: '0 15px 30px rgba(45, 106, 79, 0.1)' }}>
                    <CheckCircle size={70} color="#2d6a4f" />
                 </div>
                 <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1b4332' }}>Thank You!</h1>
                 <p style={{ textAlign: 'center', color: '#666', marginTop: '10px', fontSize: '18px', lineHeight: '1.6' }}>Your eco-fresh order has been<br/>successfully placed.</p>
                 <button onClick={() => { setCheckoutStep(0); setCart([]); setTab('home'); }} style={{ marginTop: '50px', background: '#2d6a4f', color: '#fff', border: 'none', padding: '20px 60px', borderRadius: '20px', fontWeight: 800, fontSize: '18px', boxShadow: '0 8px 15px rgba(45, 106, 79, 0.2)' }}>GO TO HOME</button>
              </div>
            )}
          </div>

          <div className="bottom-nav md:hidden">
            {role === 'Farmer' ? (
              <>
                <NavItem active={tab === 'home'} icon={<Home size={22} />} label={t('HomeTab')} onClick={() => setTab('home')} />
                <NavItem active={tab === 'market'} icon={<TrendingUp size={22} />} label={t('MarketTab')} onClick={() => setTab('home')} />
                <NavItem active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => setTab('sell')} />
                <NavItem active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => setTab('profile')} />
              </>
            ) : (
              <>
                <NavItem active={tab === 'home'} icon={<Home size={22} />} label={t('MarketTab')} onClick={() => setTab('home')} />
                <NavItem active={tab === 'sell'} icon={<PlusCircle size={22} />} label={t('SellTab')} onClick={() => setTab('sell')} />
                <NavItem active={tab === 'cart'} icon={<ShoppingCart size={22} />} label={t('BasketTab')} onClick={() => setTab('cart')} badge={cart.length} />
                <NavItem active={tab === 'orders'} icon={<Package size={22} />} label={t('OrdersTab')} onClick={() => setTab('orders')} />
                <NavItem active={tab === 'profile'} icon={<UserIcon size={22} />} label={t('ProfileTab')} onClick={() => setTab('profile')} />
              </>
            )}
          </div>
          {showUPIModal && pendingOrder && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: '#fff', width: '100%', maxWidth: '350px', borderRadius: '30px', padding: '30px', textAlign: 'center' }}>
                <h2 style={{ color: '#1b4332', fontWeight: 900 }}>Scan to Pay</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Payable Amount: <span style={{ color: '#2d6a4f', fontWeight: 800 }}>₹{pendingOrder.amount}</span></p>
                <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=himanshu62047@upi&pn=SmartAgri&am=${pendingOrder.amount}&cu=INR`} 
                    style={{ width: '100%', borderRadius: '10px' }} 
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '25px' }}>Scan using any UPI App<br/>(PhonePe, Google Pay, Paytm)</p>
                <button 
                  className="btn-primary" 
                  onClick={async () => {
                    const { orderData, amount, orderId } = pendingOrder;
                    const verifyRes = await fetch(`${API_URL}/verify-payment`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        razorpay_order_id: orderData.id,
                        razorpay_payment_id: "pay_mock_" + Date.now(),
                        razorpay_signature: "mock_sign",
                        order_id: orderId,
                        amount: amount
                      })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                      setShowUPIModal(false);
                      setCheckoutStep(2);
                      setCart([]);
                      setIsPaying(false);
                    }
                  }}
                >
                  I HAVE PAID
                </button>
                <button 
                  style={{ marginTop: '15px', background: 'none', border: 'none', color: '#ff4d4d', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => { setShowUPIModal(false); setIsPaying(false); }}
                >
                  CANCEL PAYMENT
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick, badge, desktop }) => (
  <div className={`nav-item flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${active ? (desktop ? 'bg-white/10 text-white' : 'active text-[#2d6a4f]') : (desktop ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-[#bbb]')}`} onClick={onClick}>
     <div className={`${desktop ? '' : (active ? '-translate-y-1' : '')} transition-transform`}>{icon}</div>
     <span className={`${desktop ? 'text-base font-semibold' : 'text-[11px] font-extrabold mt-1 tracking-wide'}`}>{label}</span>
     {badge > 0 && <span className={`bg-[#ff6b6b] text-white font-black rounded-lg ${desktop ? 'px-2 py-0.5 text-xs ml-auto' : 'absolute top-0 right-[20%] text-[9px] px-1.5 py-0.5 border-2 border-white'}`}>{badge}</span>}
  </div>
);

const ProfileLink = ({ icon, label, onClick }) => (
  <div style={{ padding: '20px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #f9f9f9', transition: '0.2s' }} onClick={onClick}>
     <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ background: '#f0f7f0', padding: '8px', borderRadius: '10px' }}>{icon}</div>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>{label}</span>
     </div>
     <ChevronRight size={18} color="#ddd" />
  </div>
);

export default App;
