import { useState } from 'react';
import { Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminActions, useActiveRewards, useCurrentMember } from '../../hooks';
import { formatEnumLabel } from '../admin/adminUtils';

function RewardsPage() {
  const { user } = useAuth();
  const currentMember = useCurrentMember();
  const admin = useAdminActions()();
  const { data: rewards, loading } = useActiveRewards();
  const items = Array.isArray(rewards) ? rewards : [];

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  async function handleRedeem(rewardId: string) {
    if (!user || !currentMember) return;

    setRedeeming(rewardId);
    setMessage(null);

    try {
      await admin.redeemReward(rewardId, currentMember.id, user.id);
      setMessage({ type: 'success', text: 'Reward redeemed successfully!' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Redemption failed.',
      });
    } finally {
      setRedeeming(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Rewards Store</h1>
      <p className="text-gray-500 mb-2">Redeem your points for festival prizes.</p>
      {currentMember && (
        <p className="text-blue-600 font-semibold mb-6">
          Your balance: {currentMember.totalPoints} points
        </p>
      )}

      {message && (
        <div
          className={`mb-4 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
          No rewards available at this time.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((reward) => {
            const canAfford = (currentMember?.totalPoints ?? 0) >= reward.requiredPoints;
            const inStock = reward.stock > 0;
            const canRedeem = canAfford && inStock && !!currentMember;

            return (
              <div key={reward.id} className="bg-white rounded-2xl shadow-md p-5 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{reward.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1">{reward.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Required</span>
                    <span className="font-bold text-purple-600">{reward.requiredPoints} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stock</span>
                    <span className={inStock ? 'text-green-600' : 'text-red-600'}>
                      {inStock ? reward.stock : 'Out of stock'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{formatEnumLabel(reward.category)}</div>
                  <button
                    type="button"
                    disabled={!canRedeem || redeeming === reward.id}
                    onClick={() => handleRedeem(reward.id)}
                    className={`w-full mt-2 py-2 rounded-xl text-sm font-medium transition-colors ${
                      canRedeem
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeeming === reward.id
                      ? 'Redeeming...'
                      : !inStock
                        ? 'Out of Stock'
                        : !canAfford
                          ? 'Insufficient Points'
                          : 'Redeem'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RewardsPage;
