"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UserDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
