import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import {
  Trophy, Users, Calendar, Bell, ChevronRight, TrendingUp, Star, Zap,
  Target, Award, Gift, HelpCircle, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { ROUTES } from '../utils/constants';
import {
  useHomePageData,
  useAdminMembers,
  useAdminTeams,
} from '../hooks';

function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, minutes: 32, seconds: 45 });
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, isAdmin } = useAuth();
  const { data } = useHomePageData();
  const { data: membersData } = useAdminMembers();
const { data: teamsData } = useAdminTeams();

const members = Array.isArray(membersData) ? membersData : [];
const teams = Array.isArray(teamsData) ? teamsData : [];

const currentMember =
  user && user.role === 'child'
    ? members.find((m) => m.userId === user.id)
    : null;

const currentTeam =
  currentMember
    ? teams.find((t) => t.id === currentMember.teamId)
    : null;

  const userName = user?.name ?? 'Friend';
  const appStats = data?.stats ?? { totalUsers: 0, totalTeams: 0, totalPoints: 0, activities: 0 };
  const mockTeams = data?.topTeams ?? [];
  const mockTopPerformers = data?.topPerformers ?? [];
  const mockAnnouncements = data?.announcements ?? [];
  const mockActivities = data?.activities ?? [];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show confetti on load
  useEffect(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  return (
    <div className="space-y-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {isAdmin && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
              <p className="text-sm text-gray-500">Manage teams, scores, attendance, and festival content.</p>
            </div>
          </div>
          <Link
            to={ROUTES.ADMIN}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Open Dashboard
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.section>
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 lg:p-12 text-white shadow-2xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/10"
              style={{
                left: `${(i * 15) % 100}%`,
                top: `${(i * 20) % 100}%`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-4"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Church Festival 2024</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-6xl font-bold mb-4"
          >
            Welcome, {userName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl"
          >
            Join teams, compete in activities, earn points, and celebrate together! Let the adventure begin!
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-4 gap-3 lg:gap-6 max-w-lg"
          >
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/20 backdrop-blur rounded-xl p-3 lg:p-5 text-center"
              >
                <motion.div
                  key={item.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl lg:text-5xl font-bold"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.div>
                <div className="text-xs lg:text-sm text-white/70 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-lg transition-shadow flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Join a Team</span>
            </button>
            <button className="px-6 py-3 bg-white/20 backdrop-blur rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Take a Quiz</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {currentMember && (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      My Progress
    </h2>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="text-sm text-gray-500">Name</div>
        <div className="text-xl font-bold text-blue-700">
          {currentMember.displayName}
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl p-4">
        <div className="text-sm text-gray-500">Team</div>
        <div className="text-xl font-bold text-purple-700">
          {currentTeam?.name ?? 'No Team'}
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        <div className="text-sm text-gray-500">Grade</div>
        <div className="text-xl font-bold text-green-700">
          {currentMember.grade}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="text-sm text-gray-500">Points</div>
        <div className="text-2xl font-bold text-yellow-700">
          {currentMember.totalPoints}
        </div>
      </div>
    </div>
  </motion.section>
)}

      {/* Stats Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Users, label: 'Participants', value: appStats.totalUsers, color: 'from-blue-500 to-cyan-500' },
          { icon: Target, label: 'Teams', value: appStats.totalTeams, color: 'from-purple-500 to-pink-500' },
          { icon: TrendingUp, label: 'Total Points', value: appStats.totalPoints.toLocaleString(), color: 'from-green-500 to-emerald-500' },
          { icon: Calendar, label: 'Activities', value: appStats.activities, color: 'from-orange-500 to-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* Top Teams & Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Teams */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-500" />
              <span>Top Teams</span>
            </h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockTeams.slice(0, 5).map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center space-x-4 cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                >
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.split(' ')[1]?.charAt(0) || team.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{team.name}</p>
                  <p className="text-sm text-gray-500">{team.memberCount} members</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{team.totalPoints.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Performers */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Top Performers</span>
            </h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockTopPerformers.map((performer, index) => (
              <motion.div
                key={performer.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center space-x-4 cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                >
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {performer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{performer.name}</p>
                  <p className="text-sm text-gray-500">{performer.team.name} | {performer.grade}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{performer.totalPoints}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Latest News */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Bell className="w-6 h-6 text-blue-500" />
            <span>Latest News</span>
          </h2>
          <Link
            to={ROUTES.ANNOUNCEMENTS}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {mockAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className="p-4 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  announcement.type === 'important' ? 'bg-red-100' :
                  announcement.type === 'competition' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {announcement.type === 'important' ? (
                    <Zap className="w-5 h-5 text-red-600" />
                  ) : announcement.type === 'competition' ? (
                    <Trophy className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Activities */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-green-500" />
          <span>Upcoming Activities</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  activity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {activity.status}
                </span>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-sm">{activity.points} pts</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{activity.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{activity.description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(activity.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Award, label: 'My Progress', color: 'from-blue-500 to-cyan-500', to: ROUTES.PROFILE },
            { icon: Gift, label: 'Rewards Store', color: 'from-pink-500 to-rose-500', to: ROUTES.REWARDS },
            { icon: HelpCircle, label: 'Take Quiz', color: 'from-purple-500 to-violet-500', to: ROUTES.QUIZZES },
            { icon: Trophy, label: 'Leaderboard', color: 'from-yellow-500 to-orange-500', to: ROUTES.LEADERBOARD },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-gray-700">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-8 text-gray-400 text-sm"
      >
        <p>Church Festival Management Platform</p>
        <p className="mt-1">Grade 5 & Grade 6</p>
      </motion.footer>
    </div>
  );
}

export default HomePage;
