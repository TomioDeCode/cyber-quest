"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Star, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Soal {
  id: string;
  soal: string;
  url?: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface FavoriteCardProps {
  soal: Soal;
}

interface ErrorStateProps {
  error: string;
}

const FavoriteCard = ({ soal }: FavoriteCardProps) => (
  <Card className="bg-card border border-border shadow-sm rounded-md">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div className="flex justify-between items-center w-full">
            <h3 className="font-medium text-lg text-primary truncate">
              {soal.soal}
            </h3>
            {soal.url && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                <a
                  href={soal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  {soal.url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="flex flex-col items-center gap-2">
      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Loading favorites...</p>
    </div>
  </div>
);

const ErrorState = ({ error }: ErrorStateProps) => (
  <Alert
    variant="destructive"
    className="max-w-4xl mx-auto mt-6 border border-border rounded-md"
  >
    <div className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      <AlertDescription className="text-sm">{error}</AlertDescription>
    </div>
  </Alert>
);

const EmptyState = () => (
  <div className="flex justify-center items-center py-12 bg-secondary/10 rounded-md">
    <p className="text-muted-foreground text-sm">No favorite soals found.</p>
  </div>
);

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Soal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchFavorites = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch("/api/soals/favorite");
      const data: ApiResponse<Soal[]> = await response.json();

      if (data.success && data.data) {
        setFavorites(data.data);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch favorites");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-background shadow-none border-none">
        <CardHeader className="px-0 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary uppercase">
              Favorite Soals
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 text-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-4">
            {favorites.length > 0 ? (
              favorites.map((soal) => (
                <FavoriteCard key={soal.id} soal={soal} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesPage;
