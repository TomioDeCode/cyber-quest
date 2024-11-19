import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Soal } from "@/types/SoalsData";

interface SoalCardProps {
  soal: Soal;
  editingId: string | null;
  editUrl: string;
  onEdit: (soal: Soal) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => Promise<void>;
  onCancel: () => void;
  onEditUrlChange: (url: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export const SoalCard = ({
  soal,
  editingId,
  editUrl,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  onEditUrlChange,
  onToggleFavorite,
}: SoalCardProps) => {
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd MMM yyyy HH:mm");
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleRedirect = (url: string) => {
    if (validateUrl(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="bg-background/50 hover:bg-background/80 transition-colors duration-200">
      <div className="p-8">
        <div className="flex justify-between items-start gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">Soal Text</h3>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!soal.url}
                  onClick={() => handleRedirect(soal.url || "")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-sm leading-relaxed">
                {soal.soal}
              </p>
            </div>

            <div className="flex items-center gap-8 text-xs text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {formatDate(soal.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {formatDate(soal.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {editingId !== soal.id && (
          <div className="flex justify-between mt-6 gap-3">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(soal)}
                className="gap-2 hover:bg-secondary"
              >
                <Pencil className="h-4 w-4" />
                Edit URL
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(soal.id)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                variant={soal.isFavorite ? "ghost" : "outline"}
                size="sm"
                onClick={() => onToggleFavorite(soal.id, soal.isFavorite)}
                className="gap-2 hover:bg-secondary"
              >
                {soal.isFavorite ? (
                  <Star className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {editingId === soal.id && (
          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <Input
                type="url"
                value={editUrl}
                onChange={(e) => onEditUrlChange(e.target.value)}
                placeholder="Enter new URL"
                className="flex-1 focus-visible:ring-1 bg-background"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => onUpdate(soal.id)}
                disabled={!editUrl || !validateUrl(editUrl)}
                className="gap-2 px-4"
              >
                <CheckCircle2 className="h-4 w-4" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="gap-2 px-4"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>

            {!validateUrl(editUrl) && editUrl && (
              <p className="text-xs text-destructive mt-2">
                Invalid URL format
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
