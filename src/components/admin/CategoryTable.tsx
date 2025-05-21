
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/hooks/useCategoriesManagement";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ 
  categories,
  onEdit,
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length > 0 ? (
          categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.nombre_es}</TableCell>
              <TableCell>{category.descripcion_es || ''}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              No hay categorías disponibles
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
