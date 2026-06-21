import { Bell, Zap } from 'lucide-react';
import { AnnouncementPriority } from '../../domain';
import { usePublishedAnnouncements } from '../../hooks';
import { formatEnumLabel } from '../admin/adminUtils';

function priorityStyles(priority: AnnouncementPriority) {
  switch (priority) {
    case AnnouncementPriority.Urgent:
      return 'bg-red-100 text-red-700 border-red-200';
    case AnnouncementPriority.High:
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case AnnouncementPriority.Low:
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}

function AnnouncementsPage() {
  const { data: announcements, loading } = usePublishedAnnouncements();
  const items = Array.isArray(announcements) ? announcements : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Announcements</h1>
      <p className="text-gray-500 mb-6">Latest festival news and updates.</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
          No announcements at this time.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden divide-y">
          {items.map((announcement) => (
            <div key={announcement.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${
                  announcement.priority === AnnouncementPriority.Urgent
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}>
                  {announcement.priority === AnnouncementPriority.Urgent ? (
                    <Zap className="w-5 h-5 text-red-600" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles(announcement.priority)}`}>
                      {formatEnumLabel(announcement.priority)}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {formatEnumLabel(announcement.type)}
                    </span>
                  </div>
                  <p className="text-gray-600">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {announcement.publishedAt
                      ? new Date(announcement.publishedAt).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnouncementsPage;
