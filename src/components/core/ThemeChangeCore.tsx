"use client";

import { useEffect, useState } from "react";
import { ThemeChange } from "./ThemeChange";

const ThemeChangeComponent = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeChange />;
};

export default ThemeChangeComponent;
