import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminMaterials } from '../../hooks';
import { MaterialCategory, MaterialType } from '../../domain';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminFormField,
  AdminInput,
  AdminListRow,
  AdminMessage,
  AdminPageHeader,
  AdminSecondaryButton,
  AdminSelect,
  AdminSubmitButton,
  AdminTextarea,
} from './components';
import { formatDate, formatEnumLabel } from './adminUtils';

function MaterialsManagementPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const materialsResult = useAdminMaterials();

  console.log('MATERIALS =', materialsResult);

  const materials = Array.isArray(materialsResult?.data)
    ? materialsResult.data
    : [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>(
    MaterialType.Pdf
  );
  const [category, setCategory] = useState<MaterialCategory>(
    MaterialCategory.General
  );
  const [fileUrl, setFileUrl] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sorted = useMemo(
    () =>
      [...materials].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [materials]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user || !title.trim() || !fileUrl.trim())
      return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.uploadMaterial({
        title: title.trim(),
        description:
          description.trim() || title.trim(),
        type,
        category,
        fileUrl: fileUrl.trim(),
        uploadedById: user.id,
      });

      setMessage({
        type: 'success',
        text: 'Material uploaded successfully.',
      });

      setTitle('');
      setDescription('');
      setFileUrl('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to upload.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(id: string) {
    await admin.publishMaterial(id);

    setMessage({
      type: 'success',
      text: 'Material published.',
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Materials Management"
        description="Upload and publish festival materials."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Upload Material" delay={0.1}>
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

            <AdminFormField label="Description">
              <AdminTextarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
              />
            </AdminFormField>

            <AdminFormField label="Type">
              <AdminSelect
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as MaterialType
                  )
                }
              >
                {Object.values(MaterialType).map(
                  (t) => (
                    <option key={t} value={t}>
                      {formatEnumLabel(t)}
                    </option>
                  )
                )}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="Category">
              <AdminSelect
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as MaterialCategory
                  )
                }
              >
                {Object.values(MaterialCategory).map(
                  (c) => (
                    <option key={c} value={c}>
                      {formatEnumLabel(c)}
                    </option>
                  )
                )}
              </AdminSelect>
            </AdminFormField>

            <AdminFormField label="File URL">
              <AdminInput
                value={fileUrl}
                onChange={(e) =>
                  setFileUrl(e.target.value)
                }
                placeholder="/materials/example.pdf"
                required
              />
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton disabled={submitting}>
              {submitting
                ? 'Uploading...'
                : 'Upload Material'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`All Materials (${sorted.length})`}
          delay={0.15}
        >
          {sorted.length === 0 ? (
            <AdminEmptyState message="No materials yet." />
          ) : (
            sorted.map((item) => (
              <AdminListRow
                key={item.id}
                actions={
                  !item.isPublished ? (
                    <AdminSecondaryButton
                      onClick={() =>
                        handlePublish(item.id)
                      }
                    >
                      Publish
                    </AdminSecondaryButton>
                  ) : undefined
                }
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.title}
                  </div>

                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {item.downloadCount} downloads ·{' '}
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <AdminBadge>
                    {formatEnumLabel(item.type)}
                  </AdminBadge>

                  <AdminBadge
                    variant={
                      item.isPublished
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {item.isPublished
                      ? 'Published'
                      : 'Draft'}
                  </AdminBadge>
                </div>
              </AdminListRow>
            ))
          )}
        </AdminCard>
      </div>
    </div>
  );
}

export default MaterialsManagementPage;