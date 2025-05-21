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
            <p className="text-gray-400 mb-4">
              Alquila productos de alta calidad para cualquier ocasión. Ofrecemos una amplia 
              selección de artículos a precios asequibles con opciones convenientes de entrega y recogida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rental-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rental-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rental-300">
                <Instagram size={20} />
              </a>
            </div>
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
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-rental-300">
                  Panel de Administrador
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

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Boletín</h3>
            <p className="text-gray-400 mb-4">
              Suscríbete para recibir ofertas especiales, sorteos gratuitos y actualizaciones.
            </p>
            <form className="flex flex-col space-y-2">
              <input type="email" placeholder="Tu dirección de email" className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rental-500" />
              <button type="submit" className="bg-rental-500 hover:bg-rental-600 text-white py-2 px-4 rounded-md transition duration-200">
                Suscribirse
              </button>
            </form>
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