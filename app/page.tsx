import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PlacementOverview from "@/components/landing/PlacementOverview";
import OverallStats2025 from "@/components/landing/OverallStats2025";
import DepartmentPlacements from "@/components/landing/DepartmentPlacements";
import PlacedStudents from "@/components/landing/PlacedStudents";
import TnpTeam from "@/components/landing/TnpTeam";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas">
      <Navbar />
      <Hero />
      <PlacementOverview />
      <OverallStats2025 />
      <DepartmentPlacements />
      <PlacedStudents />
      <TnpTeam />
      <Footer />
    </main>
  );
}
