"use client";

import UserDetailsView from "@/components/core/UserDetailsView";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession();

  if (!session.data?.user.id) {
    return;
  }
  return <UserDetailsView userId={session.data?.user.id} />;
};

export default page;
