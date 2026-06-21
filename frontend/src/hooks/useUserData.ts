import { useMemo } from 'react';
import { useAsync } from './useAsync';
import { useDataVersion, useServices } from '../context/FestivalContext';
import { useAuth } from '../context/AuthContext';
import {
  useAdminMembers,
  useAdminIndividualScores,
  useAdminAttendance,
  useAdminTeamScores,
  useAdminTeams,
} from './useAdminData';
import {
  buildTopPerformers,
  buildTeamLeaderboard,
  filterMembersByTeam,
  rankByPoints,
  sortAnnouncementsByPriority,
  summarizeAttendance,
  filterAttendanceByMember,
  getCategoryLabel,
} from '../domain';
import type { TeamMember } from '../domain';

export function useCurrentMember(): TeamMember | null {
  const { user } = useAuth();
  const { data: membersData } = useAdminMembers();
  const members = Array.isArray(membersData) ? membersData : [];

  return useMemo(() => {
    if (!user) return null;
    return members.find((m) => m.userId === user.id) ?? null;
  }, [members, user]);
}

export function usePublishedMaterials() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.getPublishedMaterials(), [admin, version]);
}

export function useActiveRewards() {
  const { admin } = useServices();
  const version = useDataVersion();
  return useAsync(() => admin.getActiveRewards(), [admin, version]);
}

export function usePublishedAnnouncements() {
  const { admin } = useServices();
  const version = useDataVersion();
  const currentMember = useCurrentMember();

  return useAsync(
    async () => {
      const announcements = await admin.getPublishedAnnouncements(currentMember?.teamId);
      return sortAnnouncementsByPriority(announcements);
    },
    [admin, version, currentMember?.teamId],
  );
}

export function useMyAttendance() {
  const currentMember = useCurrentMember();
  const { data: attendanceData } = useAdminAttendance();
  const records = Array.isArray(attendanceData) ? attendanceData : [];

  return useMemo(() => {
    if (!currentMember) {
      return { records: [], summary: null };
    }
    const mine = filterAttendanceByMember(records, currentMember.id).sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime(),
    );
    return {
      records: mine,
      summary: mine.length > 0 ? summarizeAttendance(mine) : null,
    };
  }, [records, currentMember]);
}

export function useMyProfileData() {
  const currentMember = useCurrentMember();
  const { data: membersData } = useAdminMembers();
  const { data: scoresData } = useAdminIndividualScores();
  const { data: teamsData } = useAdminTeams();
  const { records: attendanceRecords } = useMyAttendance();
  const { badges, rewards } = useServices();
  const version = useDataVersion();

  const members = Array.isArray(membersData) ? membersData : [];
  const scores = Array.isArray(scoresData) ? scoresData : [];
  const teams = Array.isArray(teamsData) ? teamsData : [];

  return useAsync(async () => {
    if (!currentMember) return null;

    const [memberBadges, redemptions] = await Promise.all([
      badges.getMemberBadges(currentMember.id),
      rewards.getRedemptionsByMember(currentMember.id),
    ]);

    const allBadges = await badges.getAll();
    const earnedBadges = allBadges.filter((b) =>
      memberBadges.some((mb) => mb.badgeId === b.id),
    );

    const myScores = scores.filter((s) => s.memberId === currentMember.id);
    const team = teams.find((t) => t.id === currentMember.teamId) ?? null;
    const teamLeaderboard = buildTeamLeaderboard(teams);
    const teamRank = teamLeaderboard.find((t) => t.id === currentMember.teamId)?.rank ?? 0;

    const rankedMembers = rankByPoints(
      members.map((m) => ({ id: m.id, totalPoints: m.totalPoints })),
    );
    const rank = rankedMembers.find((m) => m.id === currentMember.id)?.rank ?? 0;

    const attendanceSummary = attendanceRecords.length > 0
      ? summarizeAttendance(attendanceRecords)
      : null;

    const recentActivities = [
      ...myScores.map((s) => ({
        id: s.id,
        date: s.createdAt,
        label: s.isPenalty
          ? `Penalty: ${s.description}`
          : `+${s.points} ${getCategoryLabel(s.category)}`,
        type: s.isPenalty ? ('penalty' as const) : ('score' as const),
      })),
      ...attendanceRecords.slice(0, 5).map((r) => ({
        id: r.id,
        date: r.sessionDate,
        label: `Attendance: ${r.sessionType} (${r.status})`,
        type: 'attendance' as const,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    return {
      member: currentMember,
      team,
      rank,
      teamRank,
      attendancePercentage: attendanceSummary?.attendanceRate ?? 0,
      rewardsRedeemed: redemptions.length,
      earnedBadges,
      recentActivities,
    };
  }, [
    currentMember,
    members,
    scores,
    teams,
    attendanceRecords,
    badges,
    rewards,
    version,
  ]);
}

export function useMyTeamData() {
  const currentMember = useCurrentMember();
  const { data: membersData } = useAdminMembers();
  const { data: teamsData } = useAdminTeams();
  const { data: teamScoresData } = useAdminTeamScores();

  const members = Array.isArray(membersData) ? membersData : [];
  const teams = Array.isArray(teamsData) ? teamsData : [];
  const teamScores = Array.isArray(teamScoresData) ? teamScoresData : [];

  return useMemo(() => {
    if (!currentMember) return null;

    const team = teams.find((t) => t.id === currentMember.teamId) ?? null;
    if (!team) return null;

    const teamMembers = filterMembersByTeam(members, team.id);
    const leaderboard = buildTopPerformers(teamMembers);
    const teamLeaderboard = buildTeamLeaderboard(teams);
    const teamRank = teamLeaderboard.find((t) => t.id === team.id)?.rank ?? 0;
    const scores = teamScores.filter((s) => s.teamId === team.id);

    return {
      team,
      teamRank,
      leaderboard,
      categoryPoints: team.categoryPoints,
      scoreHistory: scores.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  }, [currentMember, members, teams, teamScores]);
}
