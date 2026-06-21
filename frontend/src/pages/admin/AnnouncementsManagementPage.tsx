import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminAnnouncements } from '../../hooks';
import { AnnouncementPriority, AnnouncementType } from '../../domain';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminInput,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSelect,
  AdminSubmitButton,
  AdminTextarea,
} from './components';
import { formatDate, formatEnumLabel } from './adminUtils';

function AnnouncementsManagementPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const announcementsResult = useAdminAnnouncements();

  console.log('ANNOUNCEMENTS =', announcementsResult);

  const announcements = Array.isArray(
    announcementsResult?.data
  )
    ? announcementsResult.data
    : [];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<AnnouncementType>(
    AnnouncementType.News
  );
  const [priority, setPriority] =
    useState<AnnouncementPriority>(
      AnnouncementPriority.Normal
    );

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const sorted = useMemo(
    () =>
      [...announcements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [announcements]
  );

  function priorityVariant(
    p: AnnouncementPriority
  ) {
    if (p === AnnouncementPriority.Urgent)
      return 'danger' as const;

    if (p === AnnouncementPriority.High)
      return 'warning' as const;

    return 'default' as const;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !user ||
      !title.trim() ||
      !content.trim()
    )
      return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.publishAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type,
        priority,
        authorId: user.id,
      });

      setMessage({
        type: 'success',
        text: 'Announcement published successfully.',
      });

      setTitle('');
      setContent('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to publish.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Announcements Management"
        description="Publish and manage festival announcements."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard
          title="Publish Announcement"
          delay={0.1}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <AdminFormField label="Title">
              <AdminInput
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />
            </AdminFormField>

            <AdminFormField label="Content">
              <AdminTextarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                rows={4}
                required
              />
            </AdminFormField>

            <AdminFormField label="Type">
              <AdminSelect
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as AnnouncementType
                  )
                }
              >
                {Object.values(
                  AnnouncementType
                ).map((t) => (
                  <option key={t} value={t}>
                    {formatEnumLabel(t)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Priority">
              <AdminSelect
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as AnnouncementPriority
                  )
                }
              >
                {Object.values(
                  AnnouncementPriority
                ).map((p) => (
                  <option key={p} value={p}>
                    {formatEnumLabel(p)}
                  </option>
                ))}
              </AdminSelect>
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton disabled={submitting}>
              {submitting
                ? 'Publishing...'
                : 'Publish Announcement'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`All Announcements (${sorted.length})`}
          delay={0.15}
        >
          {sorted.length === 0 ? (
            <AdminEmptyState message="No announcements yet." />
          ) : (
            sorted.map((item) => (
              <AdminListRow key={item.id}>
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.title}
                  </div>

                  <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {item.content}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <AdminBadge>
                    {formatEnumLabel(item.type)}
                  </AdminBadge>

                  <AdminBadge
                    variant={priorityVariant(
                      item.priority
                    )}
                  >
                    {formatEnumLabel(
                      item.priority
                    )}
                  </AdminBadge>

                  {item.isPublished && (
                    <AdminBadge variant="success">
                      Published
                    </AdminBadge>
                  )}
                </div>
              </AdminListRow>
            ))
          )}
        </AdminCard>
      </div>
    </div>
  );
}

export default AnnouncementsManagementPage;