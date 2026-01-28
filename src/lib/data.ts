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
    name: "Dr. Sarah Chen",
    title: "Clinical Psychologist · 12 years experience",
    bio: "Specializing in anxiety, depression, and relationship issues. I provide a safe, non-judgmental space for healing and personal growth. Certified CBT practitioner with extensive experience in mindfulness-based therapy.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Available today",
    rating: 4.9,
    reviewCount: 127,
    services: [
      { type: "call", label: "Video Call", price: 120, duration: "60 min" },
      { type: "chat", label: "Text Chat", price: 45, duration: "30 min" },
      { type: "email", label: "Email Consultation", price: null, duration: "Response within 24h" },
    ],
    specialties: ["Anxiety", "Depression", "Relationships", "CBT"],
    languages: ["English", "Mandarin"],
  },
  {
    id: "2",
    name: "James Mitchell",
    title: "Financial Advisor · Certified Planner",
    bio: "Helping individuals and families achieve financial freedom through personalized planning. CFP® certified with expertise in retirement planning, investment strategies, and tax optimization.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Next slot: 2pm",
    rating: 4.8,
    reviewCount: 89,
    services: [
      { type: "call", label: "Strategy Call", price: 150, duration: "45 min" },
      { type: "chat", label: "Quick Chat", price: null, duration: "15 min" },
      { type: "email", label: "Portfolio Review", price: 75, duration: "Detailed report" },
    ],
    specialties: ["Retirement", "Investments", "Tax Planning", "Estate Planning"],
    languages: ["English"],
  },
  {
    id: "3",
    name: "Maria Santos",
    title: "Immigration Attorney · Bilingual",
    bio: "Dedicated immigration lawyer with 15+ years helping families navigate the complex immigration system. Fluent in Spanish and English, I understand the unique challenges facing immigrant communities.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: false,
    availabilityText: "Available tomorrow",
    rating: 4.9,
    reviewCount: 203,
    services: [
      { type: "call", label: "Legal Consultation", price: 200, duration: "60 min" },
      { type: "chat", label: "Case Review", price: 80, duration: "30 min" },
      { type: "email", label: "Document Review", price: 50, duration: "Per document" },
    ],
    specialties: ["Visas", "Green Cards", "Citizenship", "Asylum"],
    languages: ["English", "Spanish"],
  },
  {
    id: "4",
    name: "David Park",
    title: "Career Coach · Tech Industry Expert",
    bio: "Former hiring manager at top tech companies. I help professionals land their dream jobs through resume optimization, interview prep, and career strategy. Specialized in tech and startup roles.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    verified: false,
    available: true,
    availabilityText: "Available now",
    rating: 4.7,
    reviewCount: 64,
    services: [
      { type: "call", label: "Career Strategy", price: 85, duration: "45 min" },
      { type: "chat", label: "Quick Questions", price: null, duration: "Unlimited" },
      { type: "email", label: "Resume Review", price: 40, duration: "Detailed feedback" },
    ],
    specialties: ["Tech Careers", "Resume Writing", "Interview Prep", "Salary Negotiation"],
    languages: ["English", "Korean"],
  },
  {
    id: "5",
    name: "Emily Rodriguez",
    title: "Nutrition Consultant · Holistic Health",
    bio: "Registered dietitian focused on sustainable, whole-food nutrition. I create personalized plans that fit your lifestyle, helping you achieve lasting health without restrictive dieting.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: true,
    availabilityText: "Available today",
    rating: 4.9,
    reviewCount: 156,
    services: [
      { type: "call", label: "Nutrition Consult", price: 95, duration: "50 min" },
      { type: "chat", label: "Meal Planning Help", price: 35, duration: "30 min" },
      { type: "email", label: "Quick Questions", price: null, duration: "3 questions" },
    ],
    specialties: ["Weight Management", "Gut Health", "Sports Nutrition", "Plant-Based"],
    languages: ["English", "Spanish"],
  },
  {
    id: "6",
    name: "Michael Thompson",
    title: "Business Consultant · Startup Mentor",
    bio: "Serial entrepreneur with 3 successful exits. I advise startups on go-to-market strategy, fundraising, and scaling operations. Let me help you avoid the mistakes I made early in my journey.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    verified: true,
    available: false,
    availabilityText: "Offline",
    rating: 4.8,
    reviewCount: 112,
    services: [
      { type: "call", label: "Strategy Session", price: 250, duration: "60 min" },
      { type: "chat", label: "Pitch Feedback", price: 100, duration: "45 min" },
      { type: "email", label: "Business Plan Review", price: 150, duration: "Comprehensive" },
    ],
    specialties: ["Fundraising", "GTM Strategy", "Scaling", "Leadership"],
    languages: ["English"],
  },
];

export function formatPrice(price: number | null): string {
  if (price === null) return "Free";
  return `$${price}`;
}
