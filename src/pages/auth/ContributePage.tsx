import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { databases, DICTIONARY_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useTheme } from '@/hooks/useTheme';
import WordReveal from '@/components/WordReveal';

export default function ContributePage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [romanizedWord, setRomanizedWord] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [assameseWord, setAssameseWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!romanizedWord || !englishWord || !assameseWord) {
      setError('Please fill in the required fields: Tai Khamyang, English, and Assamese.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!DICTIONARY_COLLECTION_ID) throw new Error('Database not configured properly.');
      
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        DICTIONARY_COLLECTION_ID,
        ID.unique(),
        {
          romanized_word: romanizedWord,
          english_word: englishWord,
          assamese_word: assameseWord,
          pronunciation: pronunciation,
          category: category,
          status: 'pending',
          contributorName: user?.name || 'Unknown',
          contributorEmail: user?.email || 'Unknown'
        }
      );
      setSuccess(true);
      setRomanizedWord('');
      setEnglishWord('');
      setAssameseWord('');
      setPronunciation('');
      setCategory('general');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const inputStyle = {
    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.4)',
    borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    color: 'var(--text-primary)'
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-3xl mx-auto w-full relative z-10">
      <div className="mb-10 text-center">
        <WordReveal text="CONTRIBUTE" className="h2 mb-4" />
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Help us grow the dictionary! Submit a new word below.
        </p>
      </div>

      <div className="p-8 rounded-3xl border backdrop-blur-md shadow-2xl" style={{ backgroundColor: isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)', borderColor: 'var(--border-color)' }}>
        {success && (
          <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 font-bold text-center">
            Word submitted successfully! It is now pending admin approval.
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Tai Khamyang Word *</label>
            <input type="text" value={romanizedWord} onChange={e => setRomanizedWord(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 transition-colors" style={inputStyle} placeholder="e.g. Mai Sung" required />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>English Translation *</label>
            <input type="text" value={englishWord} onChange={e => setEnglishWord(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 transition-colors" style={inputStyle} placeholder="e.g. Hello" required />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Assamese Translation *</label>
            <input type="text" value={assameseWord} onChange={e => setAssameseWord(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 transition-colors" style={inputStyle} placeholder="e.g. মাই চুং" required />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Pronunciation (Optional)</label>
            <input type="text" value={pronunciation} onChange={e => setPronunciation(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 transition-colors" style={inputStyle} placeholder="e.g. /mai sʊŋ/" />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 transition-colors" style={inputStyle}>
              <option value="general">General</option>
              <option value="greetings">Greetings</option>
              <option value="nature">Nature</option>
              <option value="family">Family</option>
              <option value="food">Food</option>
              <option value="numbers">Numbers</option>
              <option value="actions">Actions</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: isLight ? '#007722' : '#CCFF00', color: isLight ? '#ffffff' : '#000000' }}
          >
            {loading ? 'Submitting...' : 'Submit Word'}
          </button>
        </form>
      </div>
    </div>
  );
}
