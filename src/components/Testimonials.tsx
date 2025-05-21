
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReviewCard from "./reviews/ReviewCard";
import ReviewForm from "./reviews/ReviewForm";

const Testimonials = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  React.useEffect(() => {
    // Instead of fetching from a non-existent table, we'll use local state for now
    // The table will need to be created in Supabase before it can be used
    setRecentReviews([]);

    // This commented code will work once the 'reviews' table is created
    /*
    const fetchRecentReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
         if (error) throw error;
        if (data) setRecentReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchRecentReviews();
    */
  }, []);

  const handleSubmitReview = async (review: {
    name: string;
    role: string;
    comment: string;
    rating: number;
  }) => {
    if (!review.name || !review.comment) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      toast({
        title: "¡Gracias por tu opinión!",
        description: "Tu reseña ha sido recibida correctamente (tabla de reviews pendiente de crear)"
      });
      
      const newReview = {
        id: Date.now().toString(),
        name: review.name,
        role: review.role,
        content: review.comment,
        rating: review.rating,
        created_at: new Date().toISOString()
      };
      
      setRecentReviews([newReview, ...recentReviews].slice(0, 3));
    } catch (error: any) {
      toast({
        title: "Error al enviar la reseña",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros clientes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <ReviewCard 
                key={review.id}
                review={review}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-gray-500">
              Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
            </div>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Comparte tu experiencia</h3>
          <ReviewForm onSubmit={handleSubmitReview} isSubmitting={isSubmitting} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
