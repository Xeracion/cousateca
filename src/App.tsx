
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";

// Pages
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetail from "./pages/CategoryDetail";
import HowItWorksPage from "./pages/HowItWorksPage";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PrivacyPage from "./pages/PrivacyPage";
import TransparencyPage from "./pages/TransparencyPage";
import FaqPage from "./pages/FaqPage";

const queryClient = new QueryClient();

// Redirecciones de rutas antiguas con parámetros dinámicos a las nuevas rutas en español
const LegacyProductRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/producto/${id}`} replace />;
};

const LegacyCategoryRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/categoria/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/categoria/:id" element={<CategoryDetail />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/acceso" element={<AuthPage />} />
            <Route path="/perfil" element={<UserProfilePage />} />
            <Route path="/pago/exito" element={<PaymentSuccessPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/transparencia" element={<TransparencyPage />} />
            <Route path="/preguntas-frecuentes" element={<FaqPage />} />

            {/* Redirecciones desde las rutas antiguas en inglés para no romper enlaces existentes */}
            <Route path="/products" element={<Navigate to="/productos" replace />} />
            <Route path="/product/:id" element={<LegacyProductRedirect />} />
            <Route path="/cart" element={<Navigate to="/carrito" replace />} />
            <Route path="/categories" element={<Navigate to="/categorias" replace />} />
            <Route path="/category/:id" element={<LegacyCategoryRedirect />} />
            <Route path="/how-it-works" element={<Navigate to="/como-funciona" replace />} />
            <Route path="/auth" element={<Navigate to="/acceso" replace />} />
            <Route path="/profile" element={<Navigate to="/perfil" replace />} />
            <Route path="/payment/success" element={<Navigate to="/pago/exito" replace />} />
            <Route path="/privacy" element={<Navigate to="/privacidad" replace />} />
            <Route path="/faq" element={<Navigate to="/preguntas-frecuentes" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
