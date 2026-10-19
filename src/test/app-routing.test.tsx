import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches a page for /login and /profile", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const loginMatches = router.matchRoutes("/login");
    expect(loginMatches.at(-1)?.routeId).toBe("/login");

    const profileMatches = router.matchRoutes("/profile");
    expect(profileMatches.at(-1)?.routeId).toBe("/profile");
  });

  it("matches legal and contact routes", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    expect(router.matchRoutes("/privacy-policy").at(-1)?.routeId).toBe("/privacy-policy");
    expect(router.matchRoutes("/shipping-policy").at(-1)?.routeId).toBe("/shipping-policy");
    expect(router.matchRoutes("/terms-and-conditions").at(-1)?.routeId).toBe("/terms-and-conditions");
    expect(router.matchRoutes("/contact").at(-1)?.routeId).toBe("/contact");
    expect(router.matchRoutes("/checkout").at(-1)?.routeId).toBe("/checkout");
  });
});
