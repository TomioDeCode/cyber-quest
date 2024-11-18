"use client"

import UserProfile from "@/components/core/user-profile";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession();

  if (!session.data?.user.id) {
    return
  }

  return (
    <div>
      <UserProfile userId={session.data?.user.id} />
    </div>
  );
};

export default page;
