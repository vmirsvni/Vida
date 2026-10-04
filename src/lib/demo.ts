/* Three presentation demos live side by side:
     /demo-2  soft rose & black (Beauty Center style)
     /demo-3  paper & espresso (Nue Studio style)
     /demo-4  white & lilac AI-scan (Nuvé style)
   Shared components build links from the current demo's base path. */

export type DemoId = "demo-2" | "demo-3" | "demo-4";
export const D2 = "/demo-2";
export const D3 = "/demo-3";
export const D4 = "/demo-4";

export function demoFromPath(pathname: string): DemoId {
  if (pathname.startsWith(D4)) return "demo-4";
  if (pathname.startsWith(D3)) return "demo-3";
  return "demo-2";
}
