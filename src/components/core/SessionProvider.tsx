"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";

interface Auth {
  children: React.ReactNode;
}

export function SessionsProvider({ children }: Auth) {
  return <SessionProvider>{children}</SessionProvider>;
}
