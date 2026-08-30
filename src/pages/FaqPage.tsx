import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Search, Calendar, CreditCard, User, ThumbsUp, ArrowRight, CheckCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const steps = [
  {
    icon: <Search className="h-12 w-12 text-rental-500" />,
    title: "Buscar y Seleccionar",
    description: "Explora nuestro catálogo de productos de alta calidad y selecciona los artículos que necesitas para tu proyecto, evento o uso temporal.",
    details: ["Filtra productos por categoría, precio y disponibilidad", "Visualiza especificaciones detalladas e imágenes", "Lee opiniones de otros clientes", "Compara diferentes opciones"]
  },
  {
    icon: <Calendar className="h-12 w-12 text-rental-500" />,
    title: "Elegir Período de Alquiler",
    description: "Selecciona las fechas de alquiler deseadas y revisa nuestras opciones de precios flexibles para alquileres diarios, semanales o mensuales.",
    details: ["Selecciona fechas de inicio y fin en nuestro calendario interactivo", "Comprueba la disponibilidad en tiempo real", "Visualiza precios transparentes basados en la duración", "Modifica las fechas según sea necesario antes de finalizar"]
  },
  {
    icon: <CreditCard className="h-12 w-12 text-rental-500" />,
    title: "Pago y Fianza",
    description: "Completa tu pedido con nuestro proceso de pago seguro, incluyendo el depósito de fianza.",
    details: ["Proporciona información de contacto", "Paga el alquiler y la fianza", "Elige el método de pago que prefieras", "Recibe confirmación y recibo instantáneos"]
  },
  {
    icon: <User className="h-12 w-12 text-rental-500" />,
    title: "Recogida y Devolución",
    description: "Visita nuestra ubicación física para recoger y devolver los artículos alquilados.",
    details: ["Recibe notificaciones recordatorias sobre fechas de recogida y devolución", "Visítanos en Rúa Almendra 9, Ferrol", "Presenta tu identificación para recoger los productos", "Devuelve los productos en buen estado al finalizar el alquiler"]
  },
  {
    icon: <ThumbsUp className="h-12 w-12 text-rental-500" />,
    title: "¡A disfrutar!",
    description: "Utiliza los artículos alquilados según tus necesidades durante el período establecido.",
    details: ["Acceso a atención al cliente durante todo el período de alquiler", "Opción de extender tu alquiler si es necesario (sujeto a disponibilidad)", "Proceso de devolución simple en nuestra ubicación física", "Contribuye compartiendo tu experiencia"]
  }
];

const faqCategories: FaqCategory[] = [
  {
    title: "Sobre la Cousateca",
    items: [
      {
        question: "¿Qué es la Cousateca?",
        answer: "La Cousateca es una iniciativa de la Asociación Xeración que permite alquilar objetos de uso puntual (herramientas, equipo deportivo, material de eventos y mucho más) en lugar de comprarlos, fomentando un consumo más sostenible en Ferrol."
      },
      {
        question: "¿Quién puede alquilar productos?",
        answer: "Cualquier persona registrada en la web puede alquilar productos. Solo necesitas crear una cuenta con tu email para empezar a reservar."
      },
      {
        question: "¿Dónde está ubicada la Cousateca?",
        answer: "Nuestra ubicación física se encuentra en Rúa Almendra 9, Ferrol. Puedes visitarnos durante nuestro horario de atención para recoger y devolver los productos alquilados."
      }
    ]
  },
  {
    title: "Reservas y alquiler",
    items: [
      {
        question: "¿Cómo alquilo un producto?",
        answer: "Explora nuestro catálogo, elige el producto que necesitas, selecciona las fechas de alquiler y completa el pago junto con la fianza correspondiente. Recibirás una confirmación al instante."
      },
      {
        question: "¿Qué sucede si necesito extender mi período de alquiler?",
        answer: "Puedes extender fácilmente tu alquiler desde tu perfil o contactando con nuestro equipo de atención al cliente. Las extensiones están sujetas a disponibilidad del producto."
      },
      {
        question: "¿Puedo cancelar o modificar mi pedido de alquiler?",
        answer: "Sí, los pedidos pueden modificarse o cancelarse hasta 24 horas antes de la hora de recogida programada con reembolso completo. Los cambios con menos de 24 horas de antelación pueden incurrir en una pequeña tarifa."
      },
      {
        question: "¿En qué estado están los artículos de alquiler?",
        answer: "Todos nuestros artículos se revisan y limpian entre alquileres. Solo ofrecemos productos que cumplen con nuestros estándares de calidad y funcionamiento."
      }
    ]
  },
  {
    title: "Pagos y fianza",
    items: [
      {
        question: "¿Cómo funciona el depósito de fianza?",
        answer: "Cobramos una fianza en el momento del pago que es totalmente reembolsable cuando los artículos se devuelven en su estado original, permitiendo el desgaste normal. La fianza se reembolsa en un plazo de 3-5 días hábiles tras la devolución."
      },
      {
        question: "¿Qué pasa si algo se daña durante el alquiler?",
        answer: "El desgaste menor es esperado y está cubierto. Para daños significativos, puede retenerse una parte de la fianza. Evaluamos cada situación individualmente y mantenemos siempre una comunicación transparente contigo."
      },
      {
        question: "¿Qué métodos de pago aceptáis?",
        answer: "Aceptamos pago con tarjeta a través de nuestra pasarela de pago segura. El importe del alquiler y la fianza se cobran juntos al confirmar la reserva."
      }
    ]
  },
  {
    title: "Recogida y devolución",
    items: [
      {
        question: "¿Cómo recojo y devuelvo los productos?",
        answer: "La recogida y devolución se realizan en nuestra ubicación física, Rúa Almendra 9, Ferrol. Recibirás recordatorios con las fechas correspondientes para que no se te pase ninguna."
      },
      {
        question: "¿Qué necesito llevar para recoger un producto?",
        answer: "Solo necesitas presentar tu identificación y la confirmación de tu reserva. Nuestro equipo te ayudará con la entrega y te explicará el uso del producto si es necesario."
      }
    ]
  }
];

const FaqPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-rental-500 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="h-14 w-14 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Cómo funciona y Preguntas Frecuentes</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Alquilar productos de alta calidad nunca ha sido tan fácil. Descubre el proceso paso a
              paso y resuelve las dudas más habituales sobre la Cousateca.
            </p>
            <Link to="/productos">
              <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">
                Encuentra la Cousa que estabas buscando
              </Button>
            </Link>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona la Cousateca</h2>
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
                        <h3 className="text-2xl font-bold">{step.title}</h3>
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

        {/* FAQ Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((category) => (
                <div key={category.title}>
                  <h2 className="text-2xl font-bold mb-4 text-rental-700">{category.title}</h2>
                  <Accordion type="single" collapsible className="bg-white rounded-lg px-6 shadow-sm">
                    {category.items.map((item, index) => (
                      <AccordionItem key={index} value={`${category.title}-${index}`}>
                        <AccordionTrigger className="text-left text-lg">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-rental-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Tienes alguna otra pregunta?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Escríbenos y nuestro equipo te responderá encantado.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:info@cousateca.com">
                <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto">
                  Contactar por email
                </Button>
              </a>
              <Link to="/productos">
                <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100 w-full sm:w-auto">
                  Explorar Productos
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

export default FaqPage;
