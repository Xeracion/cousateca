import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Preguntas Frecuentes</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Resolvemos las dudas más habituales sobre cómo funciona la Cousateca. Si no encuentras
              lo que buscas, escríbenos y te ayudamos.
            </p>
            <Link to="/como-funciona">
              <Button size="lg" className="bg-white text-rental-500 hover:bg-gray-100">
                Ver cómo funciona paso a paso
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((category) => (
                <div key={category.title}>
                  <h2 className="text-2xl font-bold mb-4 text-rental-700">{category.title}</h2>
                  <Accordion type="single" collapsible className="bg-gray-50 rounded-lg px-6">
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
