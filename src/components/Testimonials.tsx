import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReviewCard from "./reviews/ReviewCard";
import ReviewForm from "./reviews/ReviewForm";
const Testimonials = () => {
  const {
    toast
  } = useToast();
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
  return;
};
export default Testimonials;