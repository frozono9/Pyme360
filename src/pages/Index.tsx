
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ModulesSection from "@/components/ModulesSection";
import CertificationSystem from "@/components/CertificationSystem";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ModulesSection />
        <CertificationSystem />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
