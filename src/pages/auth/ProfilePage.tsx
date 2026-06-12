import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useTheme } from '@/hooks/useTheme';

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [loadingWords, setLoadingWords] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchSavedWords() {
      if (!user) return;
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_SAVED_WORDS_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );
        // We only have the wordId in saved_words, we need to fetch the actual word details
        // In a real app we might do an aggregation or multiple queries
        // For now, we'll just store the raw wordId records and maybe fetch dictionary entries if needed.
        setSavedWords(response.documents);
      } catch (err) {
        console.error('Failed to fetch saved words', err);
      } finally {
        setLoadingWords(false);
      }
    }
    fetchSavedWords();
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const cardStyle = {
    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.4)',
    borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
            PROFILE
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Manage your account and saved words.
          </p>
        </div>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="px-6 py-2.5 rounded-full border text-sm font-semibold transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          LOG OUT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Account Details Sidebar */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="p-6 rounded-3xl border backdrop-blur-md" style={cardStyle}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-color)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{user.name || 'User'}</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>

            <Link 
              to="/forgot-password"
              className="inline-block text-sm font-semibold hover:underline"
              style={{ color: isLight ? '#007722' : '#CCFF00' }}
            >
              Reset Password
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="p-6 md:p-8 rounded-3xl border backdrop-blur-md min-h-[400px]" style={cardStyle}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Saved Words
              </h3>
              <span className="text-sm font-medium px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                {savedWords.length} Words
              </span>
            </div>

            {loadingWords ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: isLight ? '#007722' : '#CCFF00', borderTopColor: 'transparent' }} />
              </div>
            ) : savedWords.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {savedWords.map((item, idx) => (
                  <li key={idx} className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: 'var(--border-color)', backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Word ID: {item.wordId}</span>
                    <button className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No saved words yet</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Explore the dictionary and save words to practice.</p>
                <Link to="/dictionary" className="mt-4 px-6 py-2 rounded-full border font-semibold text-sm transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  Browse Dictionary
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
