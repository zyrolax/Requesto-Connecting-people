import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileDetail } from "@/components/ProfileDetail";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { professionals, type Professional } from "@/lib/data";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      const matchesSearch =
        searchQuery === "" ||
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesVerified = !showVerifiedOnly || pro.verified;
      const matchesAvailable = !showAvailableOnly || pro.available;

      return matchesSearch && matchesVerified && matchesAvailable;
    });
  }, [searchQuery, showVerifiedOnly, showAvailableOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full">
        <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <FilterBar
          showVerifiedOnly={showVerifiedOnly}
          showAvailableOnly={showAvailableOnly}
          onVerifiedToggle={() => setShowVerifiedOnly(!showVerifiedOnly)}
          onAvailableToggle={() => setShowAvailableOnly(!showAvailableOnly)}
        />
        
        <section className="px-4 py-6">
          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfessionals.map((professional) => (
                <ProfileCard
                  key={professional.id}
                  professional={professional}
                  onSelect={setSelectedProfessional}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </main>
      
      <Footer />
      
      <ProfileDetail
        professional={selectedProfessional}
        open={!!selectedProfessional}
        onClose={() => setSelectedProfessional(null)}
      />
    </div>
  );
};

export default Index;
