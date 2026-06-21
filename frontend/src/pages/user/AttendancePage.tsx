import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AttendanceStatus } from '../../domain';
import { useMyAttendance } from '../../hooks';
import { ROUTES } from '../../utils/constants';
import { formatEnumLabel } from '../admin/adminUtils';

function AttendancePage() {
  const { records, summary } = useMyAttendance();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Attendance</h1>
          <p className="text-gray-500">Your session history and attendance rate.</p>
        </div>
        <Link
          to={ROUTES.QR_SCAN}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          Scan QR Code
        </Link>
      </div>

      {summary && (
        <div className="grid sm:grid-cols-4 gap-4">
          <StatBox label="Total Sessions" value={summary.totalSessions} />
          <StatBox label="Present" value={summary.presentCount} color="text-green-600" />
          <StatBox label="Absent" value={summary.absentCount} color="text-red-600" />
          <StatBox label="Attendance %" value={`${summary.attendanceRate}%`} color="text-blue-600" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Attendance History</h2>
        </div>
        {records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendance records yet. Scan a QR code at your next session.
          </div>
        ) : (
          <div className="divide-y">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {record.status === AttendanceStatus.Present ||
                  record.status === AttendanceStatus.Late ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{formatEnumLabel(record.sessionType)}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.sessionDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    record.status === AttendanceStatus.Present
                      ? 'bg-green-100 text-green-700'
                      : record.status === AttendanceStatus.Late
                        ? 'bg-yellow-100 text-yellow-700'
                        : record.status === AttendanceStatus.Excused
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                  }`}
                >
                  {formatEnumLabel(record.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color = 'text-gray-800',
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

export default AttendancePage;
