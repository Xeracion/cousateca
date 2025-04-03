
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Calendar, CreditCard, Truck, ThumbsUp, ArrowRight, CheckCircle } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [{
    icon: <Search className="h-12 w-12 text-rental-500" />,
    title: "Buscar y Seleccionar",
    description: "Explora nuestro catálogo de productos de alta calidad y selecciona los artículos que necesitas para tu proyecto, evento o uso temporal.",
    details: ["Filtra productos por categoría, precio y disponibilidad", "Visualiza especificaciones detalladas e imágenes", "Lee opiniones de otros clientes", "Compara diferentes opciones"]
  }, {
    icon: <Calendar className="h-12 w-12 text-rental-500" />,
    title: "Elegir Período de Alquiler",
    description: "Selecciona las fechas de alquiler deseadas y revisa nuestras opciones de precios flexibles para alquileres diarios, semanales o mensuales.",
    details: ["Selecciona fechas de inicio y fin en nuestro calendario interactivo", "Comprueba la disponibilidad en tiempo real", "Visualiza precios transparentes basados en la duración", "Modifica las fechas según sea necesario antes de finalizar"]
  }, {
    icon: <CreditCard className="h-12 w-12 text-rental-500" />,
    title: "Pago Seguro",
    description: "Completa tu pedido con nuestro proceso de pago seguro, incluyendo depósito de seguridad reembolsable y opciones de entrega.",
    details: ["Proporciona información de entrega", "Paga depósito de seguridad (totalmente reembolsable)", "Elige franjas horarias de entrega que te convengan", "Recibe confirmación y recibo instantáneos"]
  }, {
    icon: <Truck className="h-12 w-12 text-rental-500" />,
    title: "Entrega y Recogida",
    description: "Entregaremos tus artículos alquilados en la ubicación especificada y los recogeremos cuando finalice tu período de alquiler.",
    details: ["Recibe notificaciones SMS sobre el estado de la entrega", "Equipo de entrega profesional que se encarga de la instalación si es necesario", "Ventanas de entrega flexibles para adaptarse a tu horario", "Programa la recogida según tu conveniencia"]
  }, {
    icon: <ThumbsUp className="h-12 w-12 text-rental-500" />,
    title: "Disfrutar y Devolver",
    description: "Utiliza tus artículos alquilados sin preocupaciones, sabiendo que el desgaste normal está cubierto. Devuélvelos cuando hayas terminado.",
    details: ["Acceso a atención al cliente durante todo el período de alquiler", "Opción de extender tu alquiler si es necesario", "Proceso de devolución simple con nuestro servicio de recogida", "Reembolso rápido del depósito de seguridad tras la devolución"]
  }];
  
  const faqs = [{
    question: "¿Qué sucede si necesito extender mi período de alquiler?",
    answer: "Puedes extender fácilmente tu alquiler a través del panel de control de tu cuenta o contactando con nuestro equipo de atención al cliente. Las extensiones están sujetas a disponibilidad."
  }, {
    question: "¿Cómo funciona el depósito de seguridad?",
    answer: "Cobramos un depósito de seguridad en el momento del pago que es totalmente reembolsable cuando los artículos se devuelven en su estado original, permitiendo el desgaste normal. Tu depósito será reembolsado dentro de 3-5 días hábiles después de la devolución."
  }, {
    question: "¿Qué pasa si algo se daña?",
    answer: "El desgaste menor es esperado y está cubierto. Para daños significativos, una parte del depósito de seguridad puede ser retenida. Evaluamos cada situación individualmente y mantenemos una comunicación transparente."
  }, {
    question: "¿Puedo cancelar o modificar mi pedido de alquiler?",
    answer: "Sí, los pedidos pueden ser modificados o cancelados hasta 24 horas antes de la hora de entrega programada con un reembolso completo. Los cambios realizados con menos de 24 horas pueden incurrir en una pequeña tarifa."
  }, {
    question: "¿Entregáis en todas partes?",
    answer: "Actualmente entregamos en la mayoría de las áreas metropolitanas principales. Introduce tu código postal durante el pago para confirmar la disponibilidad en tu área."
  }, {
    question: "¿En qué estado están los artículos de alquiler?",
    answer: "Todos nuestros artículos de alquiler son mantenidos profesionalmente y desinfectados entre alquileres. Solo ofrecemos productos que cumplen con nuestros altos estándares de calidad."
  }];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-rental-500 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Cómo funciona la Cousateca</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Alquilar productos de alta calidad nunca ha sido tan fácil.
              Nuestro proceso simple asegura que obtengas lo que necesitas, cuando lo necesitas.
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">
                Encuentra la Cousa que estabas buscando
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="mb-16 last:mb-0">
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
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-rental-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Arrow connector between steps */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-8">
                      <ArrowRight className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-rental-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar a alquilar?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Explora nuestra extensa colección de productos de alta calidad y encuentra exactamente lo que necesitas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto">
                  Explorar Productos
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-rental-600 w-full sm:w-auto">
                  Ver Categorías
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
