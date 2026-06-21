import { FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useAdminRewards } from '../../hooks';
import { RewardCategory } from '../../domain';
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
import { formatEnumLabel } from './adminUtils';

function RewardsManagementPage() {
  const { user } = useAuth();
  const admin = useAdminActions()();

  const rewardsResult = useAdminRewards();

  console.log('REWARDS =', rewardsResult);

  const rewards = Array.isArray(rewardsResult?.data)
    ? rewardsResult.data
    : [];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredPoints, setRequiredPoints] = useState('100');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState<RewardCategory>(
    RewardCategory.Stationery
  );
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sorted = useMemo(
    () =>
      [...rewards].sort(
        (a, b) => a.requiredPoints - b.requiredPoints
      ),
    [rewards]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user || !name.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await admin.createReward({
        name: name.trim(),
        description:
          description.trim() || name.trim(),
        requiredPoints:
          parseInt(requiredPoints, 10) || 100,
        category,
        stock: parseInt(stock, 10) || 0,
        isActive: true,
        isPublished: true,
        publishedAt: new Date().toISOString(),
      });

      setMessage({
        type: 'success',
        text: 'Reward created successfully.',
      });

      setName('');
      setDescription('');
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Failed to create reward.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(
    id: string,
    isActive: boolean
  ) {
    await admin.updateReward(id, {
      isActive: !isActive,
    });

    setMessage({
      type: 'success',
      text: `Reward ${
        isActive ? 'deactivated' : 'activated'
      }.`,
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Rewards Management"
        description="Create and manage the rewards store inventory."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard title="Create Reward" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <AdminFormField label="Name">
              <AdminInput
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
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

            <AdminFormField label="Required Points">
              <AdminInput
                type="number"
                min={0}
                value={requiredPoints}
                onChange={(e) =>
                  setRequiredPoints(e.target.value)
                }
              />
            </AdminFormField>

            <AdminFormField label="Stock">
              <AdminInput
                type="number"
                min={0}
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
              />
            </AdminFormField>

            <AdminFormField label="Category">
              <AdminSelect
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as RewardCategory
                  )
                }
              >
                {Object.values(RewardCategory).map(
                  (c) => (
                    <option key={c} value={c}>
                      {formatEnumLabel(c)}
                    </option>
                  )
                )}
              </AdminSelect>
            </AdminFormField>

            {message && (
              <AdminMessage type={message.type}>
                {message.text}
              </AdminMessage>
            )}

            <AdminSubmitButton disabled={submitting}>
              {submitting
                ? 'Creating...'
                : 'Create Reward'}
            </AdminSubmitButton>
          </form>
        </AdminCard>

        <AdminCard
          title={`All Rewards (${sorted.length})`}
          delay={0.15}
        >
          {sorted.length === 0 ? (
            <AdminEmptyState message="No rewards yet." />
          ) : (
            sorted.map((item) => (
              <AdminListRow
                key={item.id}
                actions={
                  <AdminSecondaryButton
                    onClick={() =>
                      handleToggleActive(
                        item.id,
                        item.isActive
                      )
                    }
                  >
                    {item.isActive
                      ? 'Deactivate'
                      : 'Activate'}
                  </AdminSecondaryButton>
                }
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>

                  <div className="text-sm text-purple-600 font-medium mt-1">
                    {item.requiredPoints} pts ·{' '}
                    {item.stock} in stock
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <AdminBadge>
                    {formatEnumLabel(item.category)}
                  </AdminBadge>

                  <AdminBadge
                    variant={
                      item.isActive
                        ? 'success'
                        : 'default'
                    }
                  >
                    {item.isActive
                      ? 'Active'
                      : 'Inactive'}
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

export default RewardsManagementPage;