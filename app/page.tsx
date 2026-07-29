import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Rankings from "@/components/landing/Rankings";
import NewsTicker from "@/components/landing/NewsTicker";
import PlacementOverview from "@/components/landing/PlacementOverview";
import OverallStats2025 from "@/components/landing/OverallStats2025";
import SalarySpectrum from "@/components/landing/SalarySpectrum";
import DepartmentPlacements from "@/components/landing/DepartmentPlacements";
import YearWiseTrends from "@/components/landing/YearWiseTrends";
import RecruitersGrid from "@/components/landing/RecruitersGrid";
import PlacedStudents from "@/components/landing/PlacedStudents";
import AlumniAchievements from "@/components/landing/AlumniAchievements";
import WhyRecruit from "@/components/landing/WhyRecruit";
import DirectorMessage from "@/components/landing/DirectorMessage";
import TnpTeam from "@/components/landing/TnpTeam";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas">
      <Navbar />
      <Hero />
      <Rankings />
      <NewsTicker />
      <PlacementOverview />
      <OverallStats2025 />
      <SalarySpectrum />
      <DepartmentPlacements />
      <YearWiseTrends />
      <RecruitersGrid />
      <PlacedStudents />
      <AlumniAchievements />
      <WhyRecruit />
      <DirectorMessage />
      <TnpTeam />
      <Footer />
    </main>
  );
}
