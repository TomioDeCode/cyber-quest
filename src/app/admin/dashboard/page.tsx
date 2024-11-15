"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome to admin dashboard</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
