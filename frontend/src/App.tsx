import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, FestivalProvider } from './context';
import { ProtectedLayout, AdminProtectedLayout } from './layouts';
import { ROUTES } from './utils/constants';
import {
  HomePage,
  TeamsPage,
  LeaderboardPage,
  LoginPage,
  PlaceholderPage,
  AdminDashboardPage,
  TeamManagementPage,
  IndividualManagementPage,
  AttendanceManagementPage,
  QrAttendancePage,
  TeamScoreEntryPage,
  IndividualScoreEntryPage,
  PenaltyManagementPage,
  AnnouncementsManagementPage,
  MaterialsManagementPage,
  RewardsManagementPage,
} from './pages';
import {
  MyProfilePage,
  MyScoresPage,
  MyTeamPage,
  RewardsPage,
  MaterialsPage,
  AnnouncementsPage,
  AttendancePage,
} from './pages';
import QrScanPage from './pages/user/QrScanPage';

function App() {
  return (
    <AuthProvider>
      <FestivalProvider>
        <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          <Route element={<ProtectedLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.TEAMS} element={<TeamsPage />} />
          <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />

          <Route path={ROUTES.MATERIALS} element={<MaterialsPage />} />
          <Route path={ROUTES.REWARDS} element={<RewardsPage />} />
           <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
           <Route path={ROUTES.PROFILE} element={<MyProfilePage />} />

          <Route path={ROUTES.MY_SCORES} element={<MyScoresPage />} />
          <Route path={ROUTES.MY_TEAM} element={<MyTeamPage />} />
          <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.QR_SCAN} element={<QrScanPage />} />

  <Route path={ROUTES.QUIZZES} element={<PlaceholderPage title="Quizzes" />} />
</Route>

          <Route element={<AdminProtectedLayout />}>
            <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
            <Route path={ROUTES.ADMIN_TEAMS} element={<TeamManagementPage />} />
            <Route path={ROUTES.ADMIN_INDIVIDUALS} element={<IndividualManagementPage />} />
            <Route path={ROUTES.ADMIN_ATTENDANCE} element={<AttendanceManagementPage />} />
            <Route path={ROUTES.ADMIN_QR_SESSIONS} element={<QrAttendancePage />} />
            <Route path={ROUTES.ADMIN_TEAM_SCORES} element={<TeamScoreEntryPage />} />
            <Route path={ROUTES.ADMIN_INDIVIDUAL_SCORES} element={<IndividualScoreEntryPage />} />
            <Route path={ROUTES.ADMIN_PENALTIES} element={<PenaltyManagementPage />} />
            <Route path={ROUTES.ADMIN_ANNOUNCEMENTS} element={<AnnouncementsManagementPage />} />
            <Route path={ROUTES.ADMIN_MATERIALS} element={<MaterialsManagementPage />} />
            <Route path={ROUTES.ADMIN_REWARDS} element={<RewardsManagementPage />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </FestivalProvider>
    </AuthProvider>
  );
}

export default App;
