import {
  Award,
  BadgeCheck,
  Gift,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMyProfileData } from '../../hooks';

function MyProfilePage() {
  const { data: profile, loading } = useMyProfileData();

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-500">No profile data found for your account.</p>
      </div>
    );
  }

  const { member, team, rank, attendancePercentage, rewardsRedeemed, earnedBadges, recentActivities } = profile;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-500">Your festival stats and achievements.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {member.displayName.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{member.displayName}</h2>
            <p className="text-gray-500">{member.grade} · {team?.name ?? 'No team'}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Star} label="Total Points" value={member.totalPoints.toString()} color="text-blue-600" />
          <StatCard icon={TrendingUp} label="Rank" value={`#${rank}`} color="text-purple-600" />
          <StatCard icon={Users} label="Attendance" value={`${attendancePercentage}%`} color="text-green-600" />
          <StatCard icon={Gift} label="Rewards Redeemed" value={rewardsRedeemed.toString()} color="text-pink-600" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Earned Badges</h2>
          </div>
          {earnedBadges.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No badges earned yet.</div>
          ) : (
            <div className="divide-y">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-sm text-gray-500">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
          </div>
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No recent activity.</div>
          ) : (
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="font-medium text-gray-800">{activity.label}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

export default MyProfilePage;
