"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateSoalDialog } from "@/components/common/CreateSoalDialog";
import { DeleteSoalDialog } from "@/components/common/DeleteSoalDialog";
import { SoalCard } from "../core/SoalCard";
import { Soal, UpdateMessage } from "@/types/SoalsData";
import Cookies from "js-cookie";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const SoalManager = () => {
  const [soals, setSoals] = useState<Soal[]>(() => {
    if (typeof window !== "undefined") {
      const savedSoals = localStorage.getItem("soals");
      if (savedSoals) {
        const parsedSoals = JSON.parse(savedSoals);
        return parsedSoals.map((soal: Soal) => ({
          ...soal,
          isFavorite: Cookies.get(`favorite_${soal.id}`) === "true",
        }));
      }
      return [];
    }
    return [];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("editingId");
    }
    return null;
  });

  const [editUrl, setEditUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("editUrl") || "";
    }
    return "";
  });

  const [updateMessage, setUpdateMessage] = useState<UpdateMessage>({
    type: "",
    message: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("soals", JSON.stringify(soals));
    }
  }, [soals]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (editingId) {
        localStorage.setItem("editingId", editingId);
      } else {
        localStorage.removeItem("editingId");
      }
    }
  }, [editingId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (editUrl) {
        localStorage.setItem("editUrl", editUrl);
      } else {
        localStorage.removeItem("editUrl");
      }
    }
  }, [editUrl]);

  const fetchSoals = useCallback(async () => {
    try {
      const response = await fetch("/api/soals");
      const data: ApiResponse<Soal[]> = await response.json();

      if (data.success && data.data) {
        const soalsWithFavorites = data.data.map((soal) => ({
          ...soal,
          isFavorite: Cookies.get(`favorite_${soal.id}`) === "true",
        }));
        setSoals(soalsWithFavorites);
        setError(null);
      } else if (data.message !== "No soals found") {
        throw new Error(data.message || "Failed to fetch soals");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch soals";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleToggleFavorite = useCallback(
    async (id: string, currentStatus: boolean) => {
      const previousSoals = [...soals];

      const updatedSoals = soals.map((soal) => {
        if (soal.id === id) {
          const newFavoriteStatus = !currentStatus;

          if (newFavoriteStatus) {
            Cookies.set(`favorite_${id}`, "true", { expires: 7 });
          } else {
            Cookies.remove(`favorite_${id}`);
          }

          return { ...soal, isFavorite: newFavoriteStatus };
        }
        return soal;
      });

      setSoals(updatedSoals);

      try {
        const response = await fetch(`/api/soals/${id}/favorite/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: !currentStatus,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to update favorite status"
          );
        }

        const data = await response.json();
        if (data.success && data.data) {
          const newSoals = soals.map((soal) => {
            if (soal.id === id) {
              const newFavoriteStatus = data.data.isFavorite;

              if (newFavoriteStatus) {
                Cookies.set(`favorite_${id}`, "true", { expires: 7 });
              } else {
                Cookies.remove(`favorite_${id}`);
              }

              return { ...soal, isFavorite: newFavoriteStatus };
            }
            return soal;
          });
          setSoals(newSoals);
        }
      } catch (error) {
        setSoals(previousSoals);
        if (!currentStatus) {
          Cookies.remove(`favorite_${id}`);
        } else {
          Cookies.set(`favorite_${id}`, "true", { expires: 7 });
        }

        console.error("Error updating favorite status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update favorite status",
          duration: 3000,
        });
      }
    },
    [soals, toast]
  );

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      try {
        const response = await fetch(`/api/soals/${id}/delete`, {
          method: "DELETE",
        });
        const data: ApiResponse<void> = await response.json();

        if (data.success) {
          Cookies.remove(`favorite_${id}`);
          setSoals((prev) => prev.filter((soal) => soal.id !== id));
          setDeleteError(null);
          toast({
            title: "Success",
            description: "Soal deleted successfully",
            duration: 3000,
          });
        } else {
          throw new Error(data.error || "Failed to delete soal");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while deleting the soal";
        setDeleteError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
          duration: 3000,
        });
      } finally {
        setDeleteDialogOpen(false);
        setDeletingId(null);
      }
    },
    [toast]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/soals/${id}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: editUrl }),
        });

        const data: ApiResponse<void> = await response.json();

        if (data.success) {
          const updatedSoals = soals.map((soal) =>
            soal.id === id ? { ...soal, url: editUrl } : soal
          );
          setSoals(updatedSoals);

          setUpdateMessage({
            type: "success",
            message: "URL updated successfully",
          });
          toast({
            title: "Success",
            description: "URL updated successfully",
            duration: 3000,
          });

          setTimeout(() => {
            setEditingId(null);
            setEditUrl("");
            setUpdateMessage({ type: "", message: "" });
          }, 2000);
        } else {
          throw new Error(data.message || "Failed to update URL");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update URL";
        setUpdateMessage({ type: "error", message: errorMessage });
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
          duration: 3000,
        });
      }
    },
    [editUrl, soals, toast]
  );

  const handleEdit = useCallback((soal: Soal) => {
    setEditingId(soal.id);
    setEditUrl(soal.url || "");
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditUrl("");
    setUpdateMessage({ type: "", message: "" });
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSoals();
    setRefreshing(false);
  }, [fetchSoals]);

  useEffect(() => {
    fetchSoals();
  }, [fetchSoals]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Loading soals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-8 shadow-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Card className="bg-background shadow-none border-none">
        <CardHeader className="px-0 flex flex-row items-center justify-between space-y-0 pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight uppercase">
            Soal Management
          </CardTitle>
          <div className="flex gap-4">
            <CreateSoalDialog onSoalCreated={fetchSoals} />
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 font-medium hover:bg-secondary/80"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-8">
            {deleteError && (
              <Alert variant="destructive" className="shadow-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-6">
              {soals.map((soal) => (
                <SoalCard
                  key={soal.id}
                  soal={soal}
                  editingId={editingId}
                  editUrl={editUrl}
                  onEdit={handleEdit}
                  onDelete={(id) => {
                    setDeletingId(id);
                    setDeleteDialogOpen(true);
                    setDeleteError(null);
                  }}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                  onEditUrlChange={setEditUrl}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
            {soals.length === 0 && (
              <div className="flex justify-center items-center py-16 bg-secondary/30 rounded-lg">
                <p className="text-muted-foreground text-lg">No soals found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <DeleteSoalDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => {
          if (deletingId) {
            await handleDelete(deletingId);
          }
        }}
      />
    </div>
  );
};

export default SoalManager;
