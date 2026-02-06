export interface ServicePricing {
  type: "call" | "chat" | "email";
  label: string;
  price: number | null; // null = free
  duration?: string; // e.g., "30 min", "per session"
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  verified: boolean;
  available: boolean;
  availabilityText: string;
  rating: number;
  reviewCount: number;
  services: ServicePricing[];
  specialties: string[];
  languages: string[];
}

export const professionals: Professional[] = [
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

export function formatPrice(price: number | null): string {
  if (price === null) return "Free";
  return `₹${price}`;
}
