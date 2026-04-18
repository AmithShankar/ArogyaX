import { fetchCurrentUser } from "@/lib/server-api";
import { User } from "@/types";
import { cache } from "react";

export const getUser = cache(async (): Promise<User | null> => {
  return fetchCurrentUser();
});
