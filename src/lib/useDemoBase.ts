"use client";

import { usePathname } from "next/navigation";
import { demoFromPath } from "./demo";

/** Base path of the demo the user is in ("/demo-2", "/demo-3" or "/demo-4"). */
export function useDemoBase(): string {
  return `/${demoFromPath(usePathname() ?? "")}`;
}
