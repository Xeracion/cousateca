import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Responsable del Tratamiento</h2>
              <p className="mb-2">
                El responsable del tratamiento de sus datos personales es:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Asociación Xeración</p>
                <p>Domicilio: Almendra 9, 15402 Ferrol</p>
                <p>Contacto: <a href="mailto:info@xeracion.org" className="text-rental-600 hover:underline">info@xeracion.org</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Finalidad del Tratamiento</h2>
              <p>
                Los datos personales que nos proporcione serán tratados con las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Gestión de su cuenta de usuario</li>
                <li>Procesamiento de reservas y alquileres</li>
                <li>Comunicación relacionada con nuestros servicios</li>
                <li>Cumplimiento de obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Base Legal</h2>
              <p>
                El tratamiento de sus datos se basa en:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>La ejecución del contrato de prestación de servicios</li>
                <li>El consentimiento del interesado</li>
                <li>El cumplimiento de obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Conservación de Datos</h2>
              <p>
                Sus datos personales serán conservados durante el tiempo necesario para cumplir con la finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Sus Derechos</h2>
              <p className="mb-2">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Acceder a sus datos personales</li>
                <li>Solicitar la rectificación de datos inexactos</li>
                <li>Solicitar la supresión de sus datos</li>
                <li>Solicitar la limitación del tratamiento de sus datos</li>
                <li>Oponerse al tratamiento de sus datos</li>
                <li>Solicitar la portabilidad de sus datos</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, puede contactarnos en <a href="mailto:info@xeracion.org" className="text-rental-600 hover:underline">info@xeracion.org</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Seguridad</h2>
              <p>
                Asociación Xeración ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de sus datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cambios en la Política de Privacidad</h2>
              <p>
                Nos reservamos el derecho a modificar esta política de privacidad para adaptarla a novedades legislativas o jurisprudenciales. Le recomendamos que revise periódicamente esta página.
              </p>
            </section>

            <section className="pt-8 border-t">
              <p className="text-sm text-gray-600">
                Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
