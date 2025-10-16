import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";
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
                <Link to="/products" className="text-gray-400 hover:text-rental-300">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-rental-300">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-rental-300">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-rental-300">
                  Preguntas Frecuentes
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
            <div className="flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png" alt="Bandera de la Unión Europea" className="w-20 h-auto mb-2" />
              <p className="text-gray-400 text-sm text-center">
                Proyecto financiado por la Unión Europea
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Cousateca. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-rental-300 text-sm">
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