
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  id: string;
  nombre: string;
  comentario: string;
  valoracion: number;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("producto_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para dejar una reseña");
      return;
    }
    if (!comment.trim() || !name.trim()) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        producto_id: productId,
        usuario_id: user.id,
        nombre: name,
        comentario: comment,
        valoracion: rating,
      });

      if (error) throw error;
      toast.success("¡Gracias por tu reseña!");
      setComment("");
      setName("");
      setRating(5);
      fetchReviews();
    } catch (error: any) {
      toast.error("Error al enviar la reseña: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.valoracion, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Opiniones de clientes</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold">{avgRating}</span>
          <span className="text-muted-foreground">({reviews.length} reseña{reviews.length !== 1 ? "s" : ""})</span>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <p className="text-muted-foreground">Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-5 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.nombre}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${s <= review.valoracion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), "d MMM yyyy", { locale: es })}
                </span>
              </div>
              <p className="text-gray-700">{review.comentario}</p>
            </div>
          ))
        )}
      </div>

      <Separator className="my-8" />

      {/* Review form */}
      <div className="max-w-xl">
        <h3 className="text-xl font-semibold mb-4">Deja tu opinión</h3>
        {!user ? (
          <p className="text-muted-foreground">Inicia sesión para dejar una reseña.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Valoración *</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comentario *</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-rental-500 hover:bg-rental-600">
              {isSubmitting ? "Enviando..." : "Enviar reseña"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
