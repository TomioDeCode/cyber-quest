"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateSoalDialog } from "@/components/common/CreateSoalDialog";
import { DeleteSoalDialog } from "@/components/common/DeleteSoalDialog";
import { SoalCard } from "../core/SoalCard";
import { Soal, UpdateMessage } from "@/types/SoalsData";

const SoalManager: React.FC = () => {
  const [soals, setSoals] = useState<Soal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<string>("");
  const [updateMessage, setUpdateMessage] = useState<UpdateMessage>({
    type: "",
    message: "",
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchSoals();
  }, []);

  const fetchSoals = async () => {
    try {
      const response = await fetch("/api/soals");
      const data = await response.json();

      if (data.success) {
        setSoals(data.data);
      } else {
        console.log(data.message);
        if (data.message !== "No soals found") {
          setError(data.message);
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message,
            duration: 3000,
          });
        }
      }
    } catch (err) {
      setError("Failed to fetch soals");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch soals",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void | null> => {
    try {
      const response = await fetch(`/api/soals/${id}/delete`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setSoals(soals.filter((soal) => soal.id !== id));
        setDeleteError(null);
        toast({
          title: "Success",
          description: "Soal deleted successfully",
          duration: 3000,
        });
      } else {
        setDeleteError(data.error || "Failed to delete soal");
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to delete soal",
          duration: 3000,
        });
      }
    } catch (err) {
      setDeleteError("An error occurred while deleting the soal");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the soal",
        duration: 3000,
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleEdit = (soal: Soal) => {
    setEditingId(soal.id);
    setEditUrl(soal.url || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUrl("");
    setUpdateMessage({ type: "", message: "" });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/soals/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: editUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setUpdateMessage({
          type: "success",
          message: "URL updated successfully",
        });
        setSoals(
          soals.map((soal) =>
            soal.id === id ? { ...soal, url: editUrl } : soal
          )
        );
        toast({
          title: "Success",
          description: "URL updated successfully",
          duration: 3000,
        });
        setTimeout(() => {
          setEditingId(null);
          setUpdateMessage({ type: "", message: "" });
        }, 2000);
      } else {
        setUpdateMessage({ type: "error", message: data.message });
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update URL",
          duration: 3000,
        });
      }
    } catch (err) {
      setUpdateMessage({ type: "error", message: "Failed to update URL" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update URL",
        duration: 3000,
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSoals();
    setRefreshing(false);
  };

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
          <CardTitle className="text-3xl font-bold tracking-tight">
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
