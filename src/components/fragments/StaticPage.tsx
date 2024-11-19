"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import UserStatisticsDashboard from "@/components/core/StatiticUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Completion {
  soalId: string;
  soalName: string;
  completedAt: string;
}

interface DailyStats {
  date: string;
  count: number;
}

interface Statistics {
  totalChallenges: number;
  completedChallenges: number;
  completionPercentage: string;
  recentCompletions: Completion[];
  favoriteChallengesCompleted: number;
  dailyCompletionStats: DailyStats[];
}

const UserStatisticsPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = pathname.split("/").pop() || searchParams.get("userId");

  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setError("User ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/statistics/user/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user statistics");
        }

        const data: Statistics = await response.json();
        setStatistics(data);
      } catch (err) {
        console.error("Error fetching user statistics:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatistics();
  }, [userId]);

  const LoadingSkeleton = () => (
    <div className="p-4 space-y-6">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[400px] w-full" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Unable to load user statistics"}
        </AlertDescription>
      </Alert>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  if (!statistics) return <ErrorState />;

  return <UserStatisticsDashboard statistics={statistics} />;
};

export default UserStatisticsPage;
