import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { useDataVersion, useServices } from '../context/FestivalContext';
import type { HomePageData, LeaderboardData, AdminDashboardData } from '../application/view-models';
import type { Team } from '../types';

export function useHomePageData() {
  const { festival } = useServices();
  const version = useDataVersion();

  return useAsync(
    () => festival.getHomePageData(),
    [festival, version],
  );
}

export function useLeaderboardData() {
  const { festival } = useServices();
  const version = useDataVersion();

  return useAsync(
    () => festival.getLeaderboardData(),
    [festival, version],
  );
}

export function useTeamsData() {
  const { teams } = useServices();
  const version = useDataVersion();

  return useAsync(
    () => teams.getTeamsForDisplay(),
    [teams, version],
  );
}

export function useAdminDashboard() {
  const { admin } = useServices();
  const version = useDataVersion();

  return useAsync(
    () => admin.getDashboardData(),
    [admin, version],
  );
}

export function useFestivalStats() {
  const { festival } = useServices();
  const version = useDataVersion();

  return useAsync(
    () => festival.getStats(),
    [festival, version],
  );
}

export function useAdminActions() {
  const { admin } = useServices();

  return useCallback(() => admin, [admin]);
}

export type { HomePageData, LeaderboardData, AdminDashboardData, Team };
