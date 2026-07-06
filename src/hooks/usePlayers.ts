import { useState, useEffect, useCallback } from "react";
import { Player, esportApi } from "../lib/esportApi";

export const usePlayers = () => {
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await esportApi.fetchPlayers();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const refetch = useCallback(async () => {
    await fetchPlayers();
  }, [fetchPlayers]);

  return { data, loading, error, refetch };
};