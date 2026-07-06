import { useState, useEffect, useCallback } from "react";
import { Match, esportApi } from "../lib/esportApi";

export const useMatches = () => {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await esportApi.fetchMatches();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const refetch = useCallback(async () => {
    await fetchMatches();
  }, [fetchMatches]);

  return { data, loading, error, refetch };
};