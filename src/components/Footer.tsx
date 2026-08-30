import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

const EUStar = ({ angle }: {
  angle: number;
}) => {
  const cx = 405;
  const cy = 270;
  const orbit = 180;
  const outerR = 30;
  const innerR = outerR * 0.381966;
  const starCx = cx + orbit * Math.sin(angle);
  const starCy = cy - orbit * Math.cos(angle);
  const points = Array.from({
    length: 10
  }, (_, i) => {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    return `${starCx + r * Math.cos(a)},${starCy + r * Math.sin(a)}`;
  }).join(" ");
  return <polygon points={points} fill="#FFCC00" />;
};

const EUFundedLogo = () => {
  const stars = Array.from({
    length: 12
  }, (_, i) => i * (Math.PI * 2 / 12));
  return <div className="flex flex-col items-center">
      <svg viewBox="0 0 810 540" className="w-24 h-auto mb-2" role="img" aria-label="Bandera de la Unión Europea">
        <rect width="810" height="540" fill="#003399" />
        {stars.map((angle, i) => <EUStar key={i} angle={angle} />)}
      </svg>
      <p className="text-gray-400 text-sm text-center">
        Cofinanciado por la Unión Europea
      </p>
    </div>;
};

const Footer = () => {
  return <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-rental-300">Cousateca</h3>
            <p className="text-gray-400 mb-4">Una iniciativa de Xeración para un Ferrol más sostenible.</p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-rental-300">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/transparencia" className="text-gray-400 hover:text-rental-300">
                  Transparencia
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-gray-400 hover:text-rental-300">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/preguntas-frecuentes" className="text-gray-400 hover:text-rental-300">
                  Cómo Funciona y Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-rental-300 flex-shrink-0" />
                <span className="text-gray-400">Almendra 9, Ferrol</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-rental-300 flex-shrink-0" />
                <span className="text-gray-400">(+34) 684 126 167</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-rental-300 flex-shrink-0" />
                <span className="text-gray-400">info@cousateca.com</span>
              </li>
            </ul>
          </div>

          {/* EU Flag Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Con el apoyo de</h3>
            <EUFundedLogo />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Cousateca. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacidad" className="text-gray-400 hover:text-rental-300 text-sm">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-rental-300 text-sm">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;