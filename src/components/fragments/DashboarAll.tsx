"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

type Soal = {
  id: string;
  soal: string;
  url: string;
};

const Dashboard = () => {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progres, setProgres] = useState<number | any>(0);
  const [leaderboard, setLeaderboard] = useState<number | any>(0);
  const session = useSession();

  const id = session.data?.user.id;
  const name = session.data?.user.name;

  useEffect(() => {
    const fetchSoalList = async () => {
      try {
        const response = await fetch(`/api/soals/random?userId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch soal list");
        }
        const data = await response.json();
        setSoalList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const progresLearn = async () => {
      try {
        const response = await fetch(`/api/soals/completed?userId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch progres");
        }
        const data = await response.json();
        setProgres(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const leaderboardUser = async () => {
      try {
        const response = await fetch(`/api/leaderboard/user?userId=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (session.data?.user.role === "admin") {
      progresLearn();
      fetchSoalList();
    } else {
      leaderboardUser();
      progresLearn();
      fetchSoalList();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 space-y-8">
        <header className="rounded-md">
          <div className="h-10 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="mt-2 h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </header>

        <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-md border border-gray-200 mb-2">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </section>

        <section>
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-secondary p-6 rounded-lg h-[200px] shadow-md flex flex-col justify-between border border-gray-200"
              >
                <div className="space-y-4 flex flex-col justify-center h-full">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4" />
              </div>
            ))}
          </div>
        </section>

        {session.data?.user.role === "user" && (
          <section className="bg-white dark:bg-secondary p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="flex justify-between items-center">
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </section>
        )}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div
      className={`${
        session.data?.user.role === "user" ? "min-h-screen" : "min-h-[90vh]"
      } p-8 space-y-8`}
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <header
        className="rounded-md"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
        }}
      >
        <h1
          className="text-4xl font-bold bg-background"
          style={{ color: "var(--foreground)" }}
        >
          Hello{" "}
          <span className="text-primary dark:text-secondary">{`${name}!`}</span>
        </h1>
        <p
          className="mt-2 text-xl"
          style={{ color: "var(--muted-foreground)" }}
        >
          Come on, solve today's challenge!
        </p>
      </header>

      <section
        className="bg-white dark:bg-secondary p-6 rounded-lg shadow-md border border-gray-200 mb-2"
        style={{
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-semibold uppercase"
            style={{ color: "var(--foreground)" }}
          >
            Progress Statistics
          </h2>
          <div
            className="flex items-center text-xl font-semibold"
            style={{ color: "var(--primary)" }}
          >
            <div className="flex items-center gap-2.5">
              <span>{progres.completedSoalCount}</span>
              <span className="mr-3 uppercase">Problem Solved</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2
          className="text-2xl font-medium"
          style={{ color: "var(--foreground)" }}
        >
          Question List
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {soalList.map((soal) => (
            <div
              key={soal.id}
              className="bg-white dark:bg-secondary p-6 rounded-lg h-[200px] shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 border border-primary"
              style={{
                color: "var(--card-foreground)",
                borderColor: "var(--border)",
              }}
            >
              <div className="space-y-4 flex flex-col justify-center h-full">
                <p
                  className="text-lg font-medium text-start"
                  style={{ color: "var(--foreground)" }}
                >
                  {soal.soal}
                </p>
                <span
                  className="text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {soal.url}
                </span>
              </div>
              <Link href={soal.url} target="_blank">
                <Button
                  variant="outline"
                  className="text-secondary-foreground px-4 py-2 rounded-lg mt-4 w-full hover:bg-primary transition-all duration-300"
                  style={{
                    color: "var(--secondary-foreground)",
                    borderColor: "var(--border)",
                  }}
                >
                  Start
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {session.data?.user.role === "user" && (
        <section
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--card-foreground)",
            borderColor: "var(--border)",
          }}
        >
          <h2
            className="text-2xl font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Leaderboard & Kompetisi
          </h2>
          <div className="flex justify-between items-center">
            <p
              className="text-gray-800"
              style={{ color: "var(--muted-foreground)" }}
            >
              Posisi kamu saat ini:
            </p>
            <p
              className="text-2xl font-semibold"
              style={{ color: "var(--primary)" }}
            >
              #{leaderboard.rank}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

const AppList = () => <Dashboard />;

export default AppList;
