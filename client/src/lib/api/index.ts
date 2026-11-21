import { createMockApi } from "@/lib/api/mock";

/**
 * The active backend. Replace with the Supabase implementation in the
 * next step; nothing else in the app needs to change.
 */
export const api = createMockApi();

export type { Api } from "@/lib/api/types";
