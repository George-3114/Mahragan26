import { FormEvent, useState } from 'react';
import { QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../context/FestivalContext';
import { useCurrentMember } from '../../hooks';

function QrScanPage() {
  const { user } = useAuth();
  const currentMember = useCurrentMember();
  const { admin } = useServices();

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !currentMember || !code.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const session = await admin.qrSessions.checkInByCode(
        code.trim(),
        currentMember.id,
        user.id,
      );
      setMessage({
        type: 'success',
        text: `Checked in successfully to "${session?.title ?? 'session'}"!`,
      });
      setCode('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Check-in failed.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">QR Check-in</h1>
        <p className="text-gray-500">Enter the code from your session QR to record attendance.</p>
      </div>

      {!currentMember ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
          No participant profile linked to your account.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="qr-code" className="block text-sm font-medium text-gray-700 mb-2">
              Session Code
            </label>
            <input
              id="qr-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. QR-LIT001"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-lg uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Checking in...' : 'Check In'}
          </button>
        </form>
      )}
    </div>
  );
}

export default QrScanPage;
