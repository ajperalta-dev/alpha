import { useState } from 'react';
import { useSectionReveal } from './hooks/useSectionReveal';
import { FaqSection } from './components/common/FaqSection';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/hero/Hero';
import { BrandIntro } from './components/intro/BrandIntro';
import { ServicesSection } from './components/services/ServicesSection';
import { CaseStudiesSection } from './components/caseStudies/CaseStudiesSection';
import { MethodologySection } from './components/methodology/MethodologySection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/common/Footer';
import { BookingModal } from './components/booking/BookingModal';
import { WhatsAppWidget } from './components/whatsapp/WhatsAppWidget';
import { ChatbotWidget } from './components/chat/ChatbotWidget';
import { useLanguage } from './context/language';

export function AppContent() {
  useSectionReveal();
  const { lang } = useLanguage();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const [initialBookingNotes, setInitialBookingNotes] = useState('');

  const handleOpenBooking = (service?: string, notes?: string) => {
    if (service) setPreselectedService(service);
    else setPreselectedService('');

    if (notes) setInitialBookingNotes(notes);
    else setInitialBookingNotes('');

    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedService('');
    setInitialBookingNotes('');
  };

  return (
    <div className="alpha-site">
      <BrandIntro />
      
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <a href="#main" className="skip-link">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
      <main id="main">
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <ServicesSection onSelectServiceForBooking={(service) => handleOpenBooking(service)} />
        <CaseStudiesSection onOpenBooking={() => handleOpenBooking()} />
        <MethodologySection />
        <FaqSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Booking Modal */}
      {isBookingOpen && <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedService={preselectedService}
        initialNotes={initialBookingNotes}
      />}

      {/* Floating Interactive Widgets */}
      <WhatsAppWidget />
      <ChatbotWidget onOpenBooking={() => handleOpenBooking()} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
