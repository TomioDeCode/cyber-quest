"use client";

import UserStatisticsDashboard from "@/components/core/StatiticUser";
import UserProfile from "@/components/core/user-profile";
import UserStatisticsPage from "@/components/fragments/StaticPage";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const session = useSession();

  if (!session.data?.user.id) {
    return;
  }

  return (
    <div>
      <div className="">
        <UserProfile userId={session.data?.user.id} />
      </div>
      <div className="">
        <UserStatisticsPage />
      </div>
    </div>
  );
};

export default page;
