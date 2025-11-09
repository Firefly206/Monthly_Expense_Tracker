import { useContext } from "react";
import { DatabaseContext } from "../providers/DatabaseProvider";

export function useDatabase() {
  const ctx = useContext(DatabaseContext);
  if (!ctx)
    throw new Error(
      "DatabaseContext missing. Wrap your app with <DatabaseProvider>."
    );
  return ctx;
}
