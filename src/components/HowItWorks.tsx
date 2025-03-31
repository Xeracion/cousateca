
import React from "react";
import { Search, Calendar, Truck, ThumbsUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-rental-500" />,
      title: "Browse & Select",
      description: "Search through our catalog of high-quality products and choose what you need."
    },
    {
      icon: <Calendar className="h-10 w-10 text-rental-500" />,
      title: "Choose Rental Period",
      description: "Select your desired rental dates and review pricing options."
    },
    {
      icon: <Truck className="h-10 w-10 text-rental-500" />,
      title: "Delivery & Pickup",
      description: "We'll deliver the items to your location and pick them up when you're done."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-rental-500" />,
      title: "Enjoy & Return",
      description: "Use the products and return them in good condition when your rental ends."
    }
  ];
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">How RentMart Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Renting high-quality products has never been easier. 
            Our simple process gets you what you need, when you need it.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-rental-50 p-4 rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute mt-10 ml-56">
                  <div className="h-0.5 w-12 bg-rental-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
