import { useAsync } from './useAsync';
import { useDataVersion, useServices } from '../context/FestivalContext';

function useAdminQuery<T>(loader: () => Promise<T>, deps: unknown[]) {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(loader, [admin, version, ...deps]);
}

export function useAdminTeams() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listTeams(), [admin, version]);
}

export function useAdminMembers() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listMembers(), [admin, version]);
}

export function useAdminAttendance() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listAttendance(), [admin, version]);
}

export function useAdminIndividualScores() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listIndividualScores(), [admin, version]);
}

export function useAdminTeamScores() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listTeamScores(), [admin, version]);
}

export function useAdminAnnouncements() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listAnnouncements(), [admin, version]);
}

export function useAdminMaterials() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listMaterials(), [admin, version]);
}

export function useAdminRewards() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listRewards(), [admin, version]);
}

export function useAdminQrSessions() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.listQrSessions(), [admin, version]);
}

export { useAdminQuery };
