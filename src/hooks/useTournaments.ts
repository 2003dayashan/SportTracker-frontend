import { useState, useEffect, useCallback } from "react";
import { Tournament, esportApi } from "../lib/esportApi";

export const useTournaments = () => {
  const [data, setData] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await esportApi.fetchTournaments();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const refetch = useCallback(async () => {
    await fetchTournaments();
  }, [fetchTournaments]);

  return { data, loading, error, refetch };
};