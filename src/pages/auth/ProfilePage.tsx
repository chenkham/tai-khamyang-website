import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { databases, DICTIONARY_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useTheme } from '@/hooks/useTheme';

const ADMIN_EMAILS = ['chenkhamchowlu@gmail.com', 'taihub20@gmail.com'];

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [savedWords, setSavedWords] = useState<any[]>([]);
  const [loadingWords, setLoadingWords] = useState(true);

  // Admin states
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const [pendingWords, setPendingWords] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

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
          [Query.equal('userId', user.$id), Query.limit(1000)]
        );
        
        const wordIds = response.documents.map(d => d.wordId);
        if (wordIds.length > 0 && DICTIONARY_COLLECTION_ID) {
          const wordsResponse = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            DICTIONARY_COLLECTION_ID,
            [Query.equal('$id', wordIds.slice(0, 100))]
          );
          setSavedWords(wordsResponse.documents.map(doc => ({
            ...doc,
            savedDocId: response.documents.find(d => d.wordId === doc.$id)?.$id
          })));
        } else {
          setSavedWords([]);
        }
      } catch (err) {
        console.error('Failed to fetch saved words', err);
      } finally {
        setLoadingWords(false);
      }
    }
    fetchSavedWords();
  }, [user]);

  useEffect(() => {
    if (isAdmin && DICTIONARY_COLLECTION_ID) {
      const fetchPending = async () => {
        try {
          const res = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            DICTIONARY_COLLECTION_ID,
            [Query.equal('status', 'pending'), Query.orderDesc('$createdAt')]
          );
          setPendingWords(res.documents);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingPending(false);
        }
      };
      fetchPending();
    }
  }, [isAdmin]);

  const removeSavedWord = async (savedDocId: string) => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_SAVED_WORDS_COLLECTION_ID,
        savedDocId
      );
      setSavedWords(prev => prev.filter(w => w.savedDocId !== savedDocId));
    } catch(err) {
      console.error('Failed to remove word', err);
    }
  };

  const approveWord = async (docId: string) => {
    try {
      await databases.updateDocument(
         import.meta.env.VITE_APPWRITE_DATABASE_ID,
         DICTIONARY_COLLECTION_ID,
         docId,
         { status: 'approved' }
      );
      setPendingWords(prev => prev.filter(w => w.$id !== docId));
    } catch(err) { console.error(err); }
  };

  const rejectWord = async (docId: string) => {
    try {
      if (confirm('Are you sure you want to delete this submission forever?')) {
        await databases.deleteDocument(
           import.meta.env.VITE_APPWRITE_DATABASE_ID,
           DICTIONARY_COLLECTION_ID,
           docId
        );
        setPendingWords(prev => prev.filter(w => w.$id !== docId));
      }
    } catch(err) { console.error(err); }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const cardStyle = {
    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.4)',
    borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto w-full relative z-10">
      
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
          className="px-6 py-2.5 rounded-full border text-sm font-semibold transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 shrink-0"
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

            <div className="flex flex-col gap-3">
              <Link 
                to="/contribute"
                className="inline-block px-4 py-3 text-center rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: isLight ? '#007722' : '#CCFF00', color: isLight ? '#fff' : '#000' }}
              >
                + Contribute a Word
              </Link>
              <Link 
                to="/forgot-password"
                className="inline-block px-4 py-2 text-center rounded-xl border text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Reset Password
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          
          {/* Admin Dashboard */}
          {isAdmin && (
            <div className="p-6 md:p-8 rounded-3xl border backdrop-blur-md" style={{ ...cardStyle, borderColor: isLight ? '#007722' : '#CCFF00', borderWidth: '2px' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  Admin Dashboard: Pending Words
                </h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-xs rounded-full">
                  {pendingWords.length} pending
                </span>
              </div>

              {loadingPending ? (
                 <div className="text-sm opacity-50">Loading submissions...</div>
              ) : pendingWords.length === 0 ? (
                 <div className="text-sm opacity-50 italic">No pending word submissions! You're all caught up.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingWords.map(word => (
                    <div key={word.$id} className="p-4 rounded-xl border bg-black/5 dark:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{word.romanized_word}</h4>
                          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-[#CCFF00]">{word.english_word}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveWord(word.$id)} className="w-8 h-8 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-500/40" title="Approve">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                          <button onClick={() => rejectWord(word.$id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-500/40" title="Reject">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-xs opacity-70 grid grid-cols-2 gap-1 mt-3">
                        <p><strong>Assamese:</strong> {word.assamese_word}</p>
                        <p><strong>Category:</strong> {word.category}</p>
                        <p className="col-span-2"><strong>Submitter:</strong> {word.contributorName} ({word.contributorEmail})</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Words Section */}
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
                {savedWords.map((item) => (
                  <li key={item.$id} className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: 'var(--border-color)', backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>{item.romanized_word}</span>
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-70" style={{ color: 'var(--text-primary)' }}>{item.english_word}</span>
                    </div>
                    <button onClick={() => removeSavedWord(item.savedDocId)} className="text-xs font-semibold text-red-500 hover:underline">
                      Remove
                    </button>
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
