import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Transparency from "@/components/Transparency";

const TransparencyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Transparency />
      </main>
      <Footer />
    </div>
  );
};

export default TransparencyPage;
