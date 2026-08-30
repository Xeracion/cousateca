
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderSearchProps {
  className?: string;
  onSearch?: () => void;
}

export const HeaderSearch = ({ className = "", onSearch }: HeaderSearchProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/productos?search=${encodeURIComponent(trimmed)}` : "/productos");
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar productos"
        className="pl-9"
      />
    </form>
  );
};
