import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ArchitectureSection from './components/ArchitectureSection';
import FolderStructureSection from './components/FolderStructureSection';
import LibrarySection from './components/LibrarySection';
import GeneratorSection from './components/GeneratorSection';
import BestPracticesSection from './components/BestPracticesSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-200">
      <Navigation />
      <main>
        <HeroSection />
        <ArchitectureSection />
        <FolderStructureSection />
        <LibrarySection />
        <GeneratorSection />
        <BestPracticesSection />
      </main>
      <Footer />
    </div>
  );
}
