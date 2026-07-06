import { useState, useEffect, useCallback } from "react";
import { Team, esportApi } from "../lib/esportApi";

export const useTeams = () => {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await esportApi.fetchTeams();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const refetch = useCallback(async () => {
    await fetchTeams();
  }, [fetchTeams]);

  return { data, loading, error, refetch };
};