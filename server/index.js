import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';

const app = express();
const port = 3001;
const client = new OAuth2Client();

// MongoDB connection is established below after schemas; do not connect here

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  picture: String,
  role: { type: String, default: 'user', enum: ['user', 'admin', 'provider'] },
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const servicePricingSchema = new mongoose.Schema({
  type: String,
  label: String,
  price: Number, // Null handled as generic object or check frontend
  duration: String
});

const professionalSchema = new mongoose.Schema({
  id: String, // Keeping string ID for compatibility/uniqueness from seed
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Links provider user to this profile
  name: String,
  title: String,
  bio: String,
  photo: String,
  verified: Boolean,
  available: { type: Boolean, default: true },
  availabilityText: { type: String, default: 'Available' },
  rating: Number,
  reviewCount: Number,
  services: [servicePricingSchema],
  specialties: [String],
  languages: [String],
  email: String,
  content: String
});

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  professionalId: String,
  serviceType: String,
  serviceLabel: String,
  meetLink: String,
  status: { type: String, default: 'confirmed' },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Professional = mongoose.model('Professional', professionalSchema);

// Seed Data
const seedProfessionals = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist · 12 years experience",
    bio: "Specializing in anxiety, depression, and family relationships. I provide a culturally sensitive space for healing. Certified CBT practitioner with extensive experience in mindfulness-based therapy.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Available today",
    rating: 4.9,
    reviewCount: 127,
    services: [
      { type: "call", label: "Video Call", price: 1200, duration: "60 min" },
      { type: "chat", label: "Text Chat", price: 500, duration: "30 min" },
      { type: "email", label: "Email Consultation", price: null, duration: "Response within 24h" },
    ],
    specialties: ["Anxiety", "Depression", "Family Therapy", "CBT"],
    languages: ["English", "Hindi"],
  },
  {
    id: "2",
    name: "Rajesh Verma",
    title: "Financial Advisor · Certified Planner",
    bio: "Helping Indian families achieve financial freedom through personalized planning. Expertise in mutual funds, retirement planning, and tax optimization for the Indian market.",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2d622ca?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Next slot: 2pm",
    rating: 4.8,
    reviewCount: 89,
    services: [
      { type: "call", label: "Strategy Call", price: 1500, duration: "45 min" },
      { type: "chat", label: "Quick Chat", price: null, duration: "15 min" },
      { type: "email", label: "Portfolio Review", price: 800, duration: "Detailed report" },
    ],
    specialties: ["Retirement", "SIPs & Mutual Funds", "Tax Planning", "Insurance"],
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    id: "3",
    name: "Aditi Iyer",
    title: "Legal Consultant · Family Law Expert",
    bio: "Dedicated lawyer with 15+ years helping families navigate complex legal systems. Fluent in Tamil and English, I understand the unique challenges facing families.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: false,
    availabilityText: "Available tomorrow",
    rating: 4.9,
    reviewCount: 203,
    services: [
      { type: "call", label: "Legal Consultation", price: 2000, duration: "60 min" },
      { type: "chat", label: "Case Review", price: 800, duration: "30 min" },
      { type: "email", label: "Document Review", price: 500, duration: "Per document" },
    ],
    specialties: ["Property Law", "Family Law", "Startups", "Contracts"],
    languages: ["English", "Tamil", "Hindi"],
  },
  {
    id: "4",
    name: "Vikram Malhotra",
    title: "Career Coach · Tech Industry Expert",
    bio: "Former hiring manager at top tech companies in Bangalore and abroad. I help professionals land their dream jobs through resume optimization and interview prep.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    verified: false,
    available: true,
    availabilityText: "Available now",
    rating: 4.7,
    reviewCount: 64,
    services: [
      { type: "call", label: "Career Strategy", price: 1000, duration: "45 min" },
      { type: "chat", label: "Quick Questions", price: null, duration: "Unlimited" },
      { type: "email", label: "Resume Review", price: 500, duration: "Detailed feedback" },
    ],
    specialties: ["Tech Careers", "Resume Writing", "Interview Prep", "Salary Negotiation"],
    languages: ["English", "Hindi"],
  },
  {
    id: "5",
    name: "Dr. Anjali Desai",
    title: "Ayurvedic Nutritionist · Holistic Health",
    bio: "Combining modern nutrition with Ayurvedic principles. I create personalized plans that fit your lifestyle, helping you achieve lasting health through balanced diet and lifestyle changes.",
    photo: "https://images.unsplash.com/photo-1614607242094-b1b2cfffa855?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Available today",
    rating: 4.9,
    reviewCount: 156,
    services: [
      { type: "call", label: "Nutrition Consult", price: 950, duration: "50 min" },
      { type: "chat", label: "Meal Planning Help", price: 350, duration: "30 min" },
      { type: "email", label: "Quick Questions", price: null, duration: "3 questions" },
    ],
    specialties: ["Weight Management", "Ayurveda", "Gut Health", "Plant-Based"],
    languages: ["English", "Gujarati", "Hindi"],
  },
  {
    id: "6",
    name: "Arjun Singh",
    title: "Startup Mentor · Business Consultant",
    bio: "Serial entrepreneur with 3 successful exits in the Indian startup ecosystem. I advise startups on go-to-market strategy, fundraising, and scaling operations.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: false,
    availabilityText: "Offline",
    rating: 4.8,
    reviewCount: 112,
    services: [
      { type: "call", label: "Strategy Session", price: 2500, duration: "60 min" },
      { type: "chat", label: "Pitch Feedback", price: 1000, duration: "45 min" },
      { type: "email", label: "Business Plan Review", price: 1500, duration: "Comprehensive" },
    ],
    specialties: ["Fundraising", "GTM Strategy", "Scaling", "Leadership"],
    languages: ["English", "Hindi"],
  },
];

async function seedDB() {
  const count = await Professional.countDocuments();
  if (count === 0) {
    console.log('Seeding professionals...');
    await Professional.insertMany(seedProfessionals);
    console.log('Professionals seeded');
  }
}

// Single MongoDB connection and seed
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/connect';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDB();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exitCode = 1;
  });


app.use(cors());
app.use(express.json());

app.post('/api/auth/google', async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Verify the access token by fetching user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to verify access token');
    }

    const payload = await userInfoResponse.json();

    // Find or create user in MongoDB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      // Check if this is the first user to make them admin
      const count = await User.countDocuments();
      user = new User({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: count === 0 ? 'admin' : 'user'
      });
      await user.save();
    }

    // Check if user is banned
    if (user.banned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned. Please contact support.'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        banned: user.banned
      },
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

app.post('/api/book-service', async (req, res) => {
  const { professionalId, serviceType, serviceLabel, userId } = req.body; // Expect userId now

  console.log(`Received booking request: Professional ${professionalId}, Service ${serviceType}, User ${userId}`);

  const bookingId = uuidv4();
  const response = {
    success: true,
    bookingId: bookingId,
    message: 'Booking confirmed',
    type: serviceType,
    details: {}
  };

  let meetLink = null;
  if (serviceType === 'call' || serviceLabel?.toLowerCase().includes('video')) {
    const meetId = uuidv4();
    meetLink = `https://meet.jit.si/${meetId}`;
    response.meetLink = meetLink;
    response.details.link = response.meetLink;
    response.message = 'Booking confirmed! Video call link generated.';
  }

  // Save to DB (if userId is valid)
  if (userId) {
    try {
      const booking = new Booking({
        bookingId,
        userId, // Assuming frontend sends the MongoDB _id
        professionalId,
        serviceType,
        serviceLabel,
        meetLink
      });
      await booking.save();
    } catch (dbError) {
      console.error('Error saving booking:', dbError);
      // Continue, don't fail the request for the user if just DB fails? Or fail?
      // For now, log and continue, as it works standalone too.
    }
  }

  res.json(response);
});

// New Endpoint: Get User Bookings
app.get('/api/user/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// New Endpoint: Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const bookings = await Booking.find().populate('userId', 'name email').sort({ date: -1 });
    res.json({ success: true, users, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// **Professional Endpoints**

// GET all professionals (only those with no userId or public listing; optionally filter out draft)
app.get('/api/professionals', async (req, res) => {
  try {
    const pros = await Professional.find();
    res.json(pros);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professionals' });
  }
});

// **Provider-owned profile (for providers to see/edit their listing)**

// GET provider's own profile by userId (finds by userId or email match)
app.get('/api/provider/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let pro = await Professional.findOne({ userId: user._id });
    if (!pro) pro = await Professional.findOne({ email: user.email });
    if (!pro) return res.status(404).json({ success: false, message: 'No provider profile yet' });
    res.json(pro);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching provider profile' });
  }
});

// POST create provider profile (when user becomes provider and has none). Creates new or links existing by email.
app.post('/api/provider/profile', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let existing = await Professional.findOne({ userId: user._id });
    if (!existing) existing = await Professional.findOne({ email: user.email });
    if (existing) {
      if (!existing.userId) {
        existing.userId = user._id;
        if (!existing.email) existing.email = user.email;
        existing.name = existing.name || user.name;
        existing.photo = existing.photo || user.picture;
        await existing.save();
      }
      return res.json({ success: true, professional: existing });
    }

    const newPro = new Professional({
      id: uuidv4(),
      userId: user._id,
      name: user.name || '',
      title: '',
      bio: '',
      photo: user.picture || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
      verified: false,
      available: true,
      availabilityText: 'Available',
      rating: 5,
      reviewCount: 0,
      services: [
        { type: 'call', label: 'Video Call', price: null, duration: '60 min' },
        { type: 'chat', label: 'Chat', price: null, duration: '30 min' },
        { type: 'email', label: 'Email', price: null, duration: '24h' }
      ],
      specialties: [],
      languages: ['English'],
      email: user.email
    });
    await newPro.save();
    res.json({ success: true, professional: newPro });
  } catch (error) {
    console.error('Error creating provider profile:', error);
    res.status(500).json({ success: false, message: 'Error creating provider profile' });
  }
});

// PATCH update provider profile (only owner)
app.patch('/api/provider/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let pro = await Professional.findOne({ userId: user._id });
    if (!pro) pro = await Professional.findOne({ email: user.email });
    if (!pro) return res.status(404).json({ success: false, message: 'No provider profile found' });

    const { name, title, bio, photo, available, availabilityText, services, specialties, languages } = req.body;
    if (name !== undefined) pro.name = name;
    if (title !== undefined) pro.title = title;
    if (bio !== undefined) pro.bio = bio;
    if (photo !== undefined) pro.photo = photo;
    if (typeof available === 'boolean') pro.available = available;
    if (availabilityText !== undefined) pro.availabilityText = availabilityText;
    if (services !== undefined && Array.isArray(services)) pro.services = services;
    if (specialties !== undefined && Array.isArray(specialties)) pro.specialties = specialties;
    if (languages !== undefined && Array.isArray(languages)) pro.languages = languages;

    if (!pro.userId) pro.userId = user._id;
    if (!pro.email) pro.email = user.email;
    await pro.save();
    res.json({ success: true, professional: pro });
  } catch (error) {
    console.error('Error updating provider profile:', error);
    res.status(500).json({ success: false, message: 'Error updating provider profile' });
  }
});

// GET provider's upcoming bookings (sessions where they are the professional)
app.get('/api/provider/bookings/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let pro = await Professional.findOne({ userId: user._id });
    if (!pro) pro = await Professional.findOne({ email: user.email });
    if (!pro) return res.json({ success: true, bookings: [] });
    const bookings = await Booking.find({ professionalId: pro.id }).populate('userId', 'name email').sort({ date: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching provider bookings' });
  }
});

// POST new professional (Admin only - for simplicity we just add, auth check on frontend or middleware ideal)
app.post('/api/professionals', async (req, res) => {
  try {
    const { name, email, title, bio, photo, services, specialties, languages } = req.body;

    // Basic validation
    if (!name || !title) {
      return res.status(400).json({ success: false, message: "Name and title are required" });
    }

    const newPro = new Professional({
      id: uuidv4(),
      name,
      email,
      title,
      bio,
      photo: photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", // Default
      verified: true, // Defaulting to true for admin added
      available: true,
      availabilityText: "Available",
      rating: 5.0, // New pros start high?
      reviewCount: 0,
      services: services || [],
      specialties: specialties || [],
      languages: languages || ["English"]
    });

    await newPro.save();
    res.json({ success: true, professional: newPro });
  } catch (error) {
    console.error("Error creating professional:", error);
    res.status(500).json({ success: false, message: 'Error creating professional' });
  }
});

// **User Management Endpoints**

// PATCH user role (promote/demote)
app.patch('/api/admin/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validation
    if (!['user', 'admin', 'provider'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ success: false, message: 'Error updating user role' });
  }
});

// PATCH user ban status
app.patch('/api/admin/users/:userId/ban', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Toggle ban status
    user.banned = !user.banned;
    await user.save();

    res.json({ success: true, user, banned: user.banned });
  } catch (error) {
    console.error('Error updating ban status:', error);
    res.status(500).json({ success: false, message: 'Error updating ban status' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
