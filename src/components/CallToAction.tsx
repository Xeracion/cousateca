
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="bg-rental-500 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to Rent Quality Products?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who save money by renting
          instead of buying. Browse our selection today!
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">
            Browse All Products
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
