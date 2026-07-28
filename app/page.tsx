import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import NewsTicker from "@/components/landing/NewsTicker";
import PlacementOverview from "@/components/landing/PlacementOverview";
import OverallStats2025 from "@/components/landing/OverallStats2025";
import YearWiseTrends from "@/components/landing/YearWiseTrends";
import DepartmentPlacements from "@/components/landing/DepartmentPlacements";
import RecruitersGrid from "@/components/landing/RecruitersGrid";
import PlacedStudents from "@/components/landing/PlacedStudents";
import DirectorMessage from "@/components/landing/DirectorMessage";
import TnpTeam from "@/components/landing/TnpTeam";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas">
      <Navbar />
      <Hero />
      <NewsTicker />
      <PlacementOverview />
      <OverallStats2025 />
      <YearWiseTrends />
      <DepartmentPlacements />
      <RecruitersGrid />
      <PlacedStudents />
      <DirectorMessage />
      <TnpTeam />
      <Footer />
    </main>
  );
}
