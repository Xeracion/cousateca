import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Calendar, CreditCard, Truck, ThumbsUp, ArrowRight, CheckCircle } from "lucide-react";
const HowItWorksPage = () => {
  const steps = [{
    icon: <Search className="h-12 w-12 text-rental-500" />,
    title: "Browse & Select",
    description: "Browse our catalog of high-quality products and select the items you need for your project, event, or temporary use.",
    details: ["Filter products by category, price, and availability", "View detailed product specifications and images", "Read reviews from other customers", "Compare different options"]
  }, {
    icon: <Calendar className="h-12 w-12 text-rental-500" />,
    title: "Choose Rental Period",
    description: "Select your desired rental dates and review our flexible pricing options for daily, weekly, or monthly rentals.",
    details: ["Select start and end dates on our interactive calendar", "See real-time availability for your chosen dates", "View transparent pricing based on rental duration", "Modify dates as needed before checkout"]
  }, {
    icon: <CreditCard className="h-12 w-12 text-rental-500" />,
    title: "Secure Checkout",
    description: "Complete your order with our secure checkout process, including refundable security deposit and delivery options.",
    details: ["Provide delivery information", "Pay security deposit (fully refundable upon return)", "Choose delivery time slots that work for you", "Receive instant confirmation and receipt"]
  }, {
    icon: <Truck className="h-12 w-12 text-rental-500" />,
    title: "Delivery & Pickup",
    description: "We'll deliver your rental items to your specified location and pick them up when your rental period ends.",
    details: ["Receive SMS notifications about delivery status", "Professional delivery team handles setup if needed", "Flexible delivery windows to accommodate your schedule", "Schedule pickup at your convenience"]
  }, {
    icon: <ThumbsUp className="h-12 w-12 text-rental-500" />,
    title: "Enjoy & Return",
    description: "Use your rented items worry-free, knowing that normal wear and tear is covered. Return them when you're done.",
    details: ["Access to customer support throughout your rental period", "Option to extend your rental if needed", "Simple return process with our pickup service", "Quick security deposit refund after return"]
  }];
  const faqs = [{
    question: "What if I need to extend my rental period?",
    answer: "You can easily extend your rental through your account dashboard or by contacting our customer service team. Extensions are subject to availability."
  }, {
    question: "How does the security deposit work?",
    answer: "We collect a security deposit at checkout that is fully refundable when items are returned in their original condition, allowing for normal wear and tear. Your deposit will be refunded within 3-5 business days after return."
  }, {
    question: "What happens if something gets damaged?",
    answer: "Minor wear and tear is expected and covered. For significant damage, a portion of the security deposit may be retained. We assess each situation individually and maintain transparent communication."
  }, {
    question: "Can I cancel or modify my rental order?",
    answer: "Yes, orders can be modified or canceled up to 24 hours before the scheduled delivery time with a full refund. Changes made less than 24 hours may incur a small fee."
  }, {
    question: "Do you deliver everywhere?",
    answer: "We currently deliver to most major metro areas. Enter your zip code during checkout to confirm availability in your area."
  }, {
    question: "What condition are the rental items in?",
    answer: "All our rental items are professionally maintained and sanitized between rentals. We only offer products that meet our high-quality standards."
  }];
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-rental-500 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Como funciona la Cousateca</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Renting high-quality products has never been easier.
              Our simple process ensures you get what you need, when you need it.
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">Encuentra la Cousa que estabas buscando</Button>
            </Link>
          </div>
        </section>
        
        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => <div key={index} className="mb-16 last:mb-0">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="bg-rental-50 p-5 rounded-full flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-rental-100 text-rental-700 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <h2 className="text-2xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-rental-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Arrow connector between steps */}
                  {index < steps.length - 1 && <div className="flex justify-center my-8">
                      <ArrowRight className="h-8 w-8 text-gray-300" />
                    </div>}
                </div>)}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-6">
                {faqs.map((faq, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-rental-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar a alquilar?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Browse our extensive collection of high-quality rental products and find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-rental-600 w-full sm:w-auto">
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default HowItWorksPage;