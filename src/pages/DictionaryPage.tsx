import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { databases, DATABASE_ID, DICTIONARY_COLLECTION_ID } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { useNavigate } from 'react-router';
import WordReveal from '@/components/WordReveal';
import ScrollReveal from '@/components/ScrollReveal';

export interface DictionaryWord {
  id: string; // Changed to string for Appwrite Document ID
  english: string;
  khamyang: string;
  assamese: string;
  pronunciation: string;
  category: string;
  partOfSpeech: string;
  sentence?: string;
  khamyang_letter_word?: string;
}

// Temporary fallback mock data to prevent errors while DB is empty or fetching
const mockDictionaryDB: DictionaryWord[] = [
  { id: '1', english: 'Hello', khamyang: 'Mai Sung', assamese: 'মাই চুং', pronunciation: '/mai sʊŋ/', category: 'greetings', partOfSpeech: 'greeting' },
  { id: '2', english: 'Thank You', khamyang: 'Khop Chai', assamese: 'খোপ চ্য়াই', pronunciation: '/kʰɔp tɕai/', category: 'greetings', partOfSpeech: 'phrase' },
  { id: '3', english: 'Water', khamyang: 'Nam', assamese: 'নাম', pronunciation: '/nam/', category: 'nature', partOfSpeech: 'noun' },
  { id: '4', english: 'Sun', khamyang: 'Kang Wen', assamese: 'কাং ৱেন', pronunciation: '/kaŋ wɛn/', category: 'nature', partOfSpeech: 'noun' },
  { id: '5', english: 'Moon', khamyang: 'Duean', assamese: 'ডুৱন', pronunciation: '/dɯən/', category: 'nature', partOfSpeech: 'noun' },
  { id: '6', english: 'House', khamyang: 'Ruen', assamese: 'ৰুৱন', pronunciation: '/rɯən/', category: 'family', partOfSpeech: 'noun' },
  { id: '7', english: 'Eat', khamyang: 'Kin', assamese: 'কিন', pronunciation: '/kin/', category: 'actions', partOfSpeech: 'verb' },
  { id: '8', english: 'Rice', khamyang: 'Khao', assamese: 'খাও', pronunciation: '/kʰau/', category: 'food', partOfSpeech: 'noun' },
  { id: '9', english: 'Mother', khamyang: 'Mae', assamese: 'মে', pronunciation: '/mɛ/', category: 'family', partOfSpeech: 'noun' },
  { id: '10', english: 'Father', khamyang: 'Po', assamese: 'প\'', pronunciation: '/pɔ/', category: 'family', partOfSpeech: 'noun' },
  { id: '11', english: 'Fire', khamyang: 'Fai', assamese: 'ফাই', pronunciation: '/fai/', category: 'nature', partOfSpeech: 'noun' },
  { id: '12', english: 'Earth', khamyang: 'Din', assamese: 'দিন', pronunciation: '/din/', category: 'nature', partOfSpeech: 'noun' },
  { id: '13', english: 'Tree', khamyang: 'Ton Mai', assamese: 'তন মাই', pronunciation: '/ton mai/', category: 'nature', partOfSpeech: 'noun' },
  { id: '14', english: 'Flower', khamyang: 'Dok Mai', assamese: 'ডক মাই', pronunciation: '/dok mai/', category: 'nature', partOfSpeech: 'noun' },
  { id: '15', english: 'Star', khamyang: 'Dao', assamese: 'দাও', pronunciation: '/dau/', category: 'nature', partOfSpeech: 'noun' },
  { id: '16', english: 'Sky', khamyang: 'Fa', assamese: 'ফা', pronunciation: '/fa/', category: 'nature', partOfSpeech: 'noun' },
  { id: '17', english: 'Wind', khamyang: 'Lom', assamese: 'লম', pronunciation: '/lom/', category: 'nature', partOfSpeech: 'noun' },
  { id: '18', english: 'Go', khamyang: 'Pai', assamese: 'পাই', pronunciation: '/pai/', category: 'actions', partOfSpeech: 'verb' },
  { id: '19', english: 'Come', khamyang: 'Ma', assamese: 'মা', pronunciation: '/ma/', category: 'actions', partOfSpeech: 'verb' },
  { id: '20', english: 'Good', khamyang: 'Di', assamese: 'দি', pronunciation: '/di/', category: 'adjectives', partOfSpeech: 'adjective' },
  { id: '21', english: 'Beautiful', khamyang: 'Ngam', assamese: 'ঙাম', pronunciation: '/ŋam/', category: 'adjectives', partOfSpeech: 'adjective' },
  { id: '22', english: 'One', khamyang: 'Neung', assamese: 'নুং', pronunciation: '/nɯŋ/', category: 'numbers', partOfSpeech: 'numeral' },
  { id: '23', english: 'Two', khamyang: 'Song', assamese: 'ছং', pronunciation: '/sɔŋ/', category: 'numbers', partOfSpeech: 'numeral' },
  { id: '24', english: 'Three', khamyang: 'Sam', assamese: 'ছাম', pronunciation: '/sam/', category: 'numbers', partOfSpeech: 'numeral' },
  { id: '25', english: 'Four', khamyang: 'Si', assamese: 'ছি', pronunciation: '/si/', category: 'numbers', partOfSpeech: 'numeral' },
  { id: '26', english: 'Five', khamyang: 'Ha', assamese: 'হা', pronunciation: '/ha/', category: 'numbers', partOfSpeech: 'numeral' },
  { id: '27', english: 'Big', khamyang: 'Luang', assamese: 'লুৱাং', pronunciation: '/luaŋ/', category: 'adjectives', partOfSpeech: 'adjective' },
  { id: '28', english: 'Small', khamyang: 'Noi', assamese: 'নয়', pronunciation: '/nɔi/', category: 'adjectives', partOfSpeech: 'adjective' },
  { id: '29', english: 'Cat', khamyang: 'Meu', assamese: 'মিউ', pronunciation: '/mɯː/', category: 'nature', partOfSpeech: 'noun' },
  { id: '30', english: 'Fish', khamyang: 'Pa', assamese: 'পা', pronunciation: '/paː/', category: 'nature', partOfSpeech: 'noun' }
];

export default function DictionaryPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  
  const [dictionaryDB, setDictionaryDB] = useState<DictionaryWord[]>(mockDictionaryDB);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDocs, setFavoriteDocs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch words from Appwrite
  useEffect(() => {
    const fetchWords = async () => {
      try {
        if (!DATABASE_ID || !DICTIONARY_COLLECTION_ID) {
          console.warn('Appwrite not configured yet, using mock data.');
          setDictionaryDB(mockDictionaryDB);
          return;
        }
        const response = await databases.listDocuments(DATABASE_ID, DICTIONARY_COLLECTION_ID, [
          Query.equal('status', 'approved'),
          Query.limit(1000)
        ]);
        const fetchedWords: DictionaryWord[] = response.documents.map((doc) => ({
          id: doc.$id,
          english: doc.english_word,
          khamyang: doc.romanized_word,
          assamese: doc.assamese_word,
          khamyang_letter_word: doc.khamyang_letter_word,
          sentence: doc.sentence,
          pronunciation: doc.pronunciation || '',
          category: doc.category || 'general',
          partOfSpeech: doc.part_of_speech || 'noun',
        }));
        if (fetchedWords.length > 0) {
          setDictionaryDB(fetchedWords);
        }
      } catch (error) {
        console.error('Error fetching dictionary:', error);
      }
    };
    fetchWords();
  }, []);

  // Fetch favorites from Appwrite
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setFavoriteDocs({});
        return;
      }
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_SAVED_WORDS_COLLECTION_ID,
          [Query.equal('userId', user.$id), Query.limit(1000)]
        );
        const faves = response.documents.map(doc => doc.wordId);
        const docs: Record<string, string> = {};
        response.documents.forEach(doc => {
          docs[doc.wordId] = doc.$id;
        });
        setFavorites(faves);
        setFavoriteDocs(docs);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      }
    };
    fetchFavorites();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Pre-load voices for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Handle escape key to close word modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedWord(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Word of the day based deterministically on date
  const wordOfTheDay = useMemo(() => {
    if (dictionaryDB.length === 0) return mockDictionaryDB[0];
    const day = new Date().getDate();
    const index = day % dictionaryDB.length;
    return dictionaryDB[index];
  }, [dictionaryDB]);

  // Handle Favorites toggle
  const toggleFavorite = async (id: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const isSaved = favorites.includes(id);
    try {
      if (isSaved) {
        // Optimistic UI update
        setFavorites(prev => prev.filter(x => x !== id));
        const docId = favoriteDocs[id];
        if (docId) {
          await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_SAVED_WORDS_COLLECTION_ID,
            docId
          );
          setFavoriteDocs(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      } else {
        // Optimistic UI update
        setFavorites(prev => [...prev, id]);
        const doc = await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_SAVED_WORDS_COLLECTION_ID,
          ID.unique(),
          { userId: user.$id, wordId: id }
        );
        setFavoriteDocs(prev => ({ ...prev, [id]: doc.$id }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  // Copy word details to clipboard
  const copyToClipboard = (word: DictionaryWord) => {
    const text = `${word.khamyang} (${word.pronunciation}) - Assamese: ${word.assamese} - English: ${word.english}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(word.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Play audio pronunciation using Web Speech API
  const playSpeech = (word: DictionaryWord) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active speech

      const khamyangUtterance = new SpeechSynthesisUtterance(word.khamyang);
      const voices = window.speechSynthesis.getVoices();
      const asianVoice = voices.find((v) => v.lang.startsWith('th') || v.lang.startsWith('lo'));

      if (asianVoice) {
        khamyangUtterance.voice = asianVoice;
        khamyangUtterance.lang = 'th-TH';
      } else {
        khamyangUtterance.lang = 'en-US';
      }
      khamyangUtterance.rate = 0.85;

      window.speechSynthesis.speak(khamyangUtterance);

      const englishUtterance = new SpeechSynthesisUtterance(`means ${word.english}`);
      englishUtterance.lang = 'en-US';
      englishUtterance.rate = 0.95;
      window.speechSynthesis.speak(englishUtterance);
    }
  };

  // Filter dictionary based on search term and category
  const filteredWords = useMemo(() => {
    return dictionaryDB.filter((item) => {
      const matchesSearch =
        item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.khamyang.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const isSearchActive = searchTerm !== '' || selectedCategory !== null;

  // Categories list (no emojis)
  const categories = [
    { id: 'greetings', label: 'Greetings' },
    { id: 'nature', label: 'Nature' },
    { id: 'family', label: 'Family & Life' },
    { id: 'food', label: 'Food' },
    { id: 'numbers', label: 'Numbers' },
    { id: 'actions', label: 'Actions' },
    { id: 'adjectives', label: 'Adjectives' },
  ];

  // Group filtered words by starting letter
  const groupedWords = useMemo(() => {
    const groups: Record<string, DictionaryWord[]> = {};
    filteredWords.forEach((word) => {
      const firstLetter = word.english.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(word);
    });
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key].sort((a, b) => a.english.localeCompare(b.english));
        return acc;
      }, {} as Record<string, DictionaryWord[]>);
  }, [filteredWords]);

  // Retrieve favorite word objects
  const favoriteWords = useMemo(() => {
    return dictionaryDB.filter((w) => favorites.includes(w.id));
  }, [favorites]);

  return (
    <div className="w-full min-h-screen pt-36 md:pt-44 pb-20 relative overflow-hidden">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-[20%] left-[-15%] w-[50vw] h-[50vw] max-w-[600px] bg-[#CCFF00]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] max-w-[600px] bg-[#004d16]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="wm-container w-full max-w-5xl px-5 relative z-10">
        
        {/* Title & Saved Words Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-center sm:text-left">
            <WordReveal text="TAI KHAMYANG DICTIONARY" className="h2" />
          </div>
          
          <button
            onClick={() => {
              if (!user) setShowLoginPrompt(true);
              else setShowSavedModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md shrink-0"
            style={{
              borderColor: 'var(--border-color)',
              color: isLight ? '#007722' : '#CCFF00',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-sm">★</span>
            <span>Saved ({favoriteWords.length})</span>
          </button>
        </div>
        
        <ScrollReveal delay={0.15}>
          <p className="text-sm md:text-base text-center mb-10 max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Search or select a category below. Click any word to pop up its Assamese and pronunciation details.
          </p>
        </ScrollReveal>

        {/* Search Bar & Category Dropdown (Rectangle with rounded corners) */}
        <div className="mb-14 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-xl mx-auto sticky top-[calc(var(--navbar-height)+1.5rem)] z-40">
            {/* Search Input */}
            <div 
              className="relative flex-1 w-full shadow-2xl rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#CCFF00]/50"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 15, 15, 0.85)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <input
                type="text"
                placeholder="Search English or Tai Khamyang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-12 py-3.5 rounded-2xl bg-transparent focus:outline-none text-base"
                style={{ color: 'var(--text-primary)' }}
              />
              
              {searchTerm ? (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors ${isLight ? 'hover:text-[#007722]' : 'hover:text-[#CCFF00]'}`}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Category Dropdown Selector */}
            <div className="relative w-full sm:w-auto shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border text-sm font-semibold tracking-tight transition-all duration-300 hover:opacity-90 flex items-center justify-between gap-3 shadow-2xl"
                style={{
                  borderColor: 'var(--border-color)',
                  color: selectedCategory ? '#000000' : 'var(--text-primary)',
                  backgroundColor: selectedCategory ? '#CCFF00' : (isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 15, 15, 0.85)'),
                  backdropFilter: 'blur(16px)',
                }}
              >
                <span>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'All Categories'}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 flex flex-col gap-1"
                  style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 15, 0.95)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <button
                    onClick={() => { setSelectedCategory(null); setCategoryDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCategoryDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 rounded-xl text-left text-xs font-semibold hover:bg-[#CCFF00] hover:text-black transition-colors"
                      style={{ 
                        color: selectedCategory === cat.id ? '#000000' : 'var(--text-primary)', 
                        backgroundColor: selectedCategory === cat.id ? '#CCFF00' : 'transparent' 
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* Dynamic Content Switching */}
        {!isSearchActive ? (
          /* Landing Relaxed state - No words shown yet */
          <div className="max-w-xl mx-auto w-full mt-4">
            
            {/* Word of the Day */}
            <ScrollReveal delay={0.3} className="w-full flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-center sm:text-left" style={{ color: 'var(--text-secondary)' }}>
                Word of the Day ✦
              </h3>
              <div 
                onClick={() => setSelectedWord(wordOfTheDay)}
                className="rounded-[2.5rem] border p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-[#CCFF00]/50 transition-colors duration-300 min-h-[280px]"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(10, 10, 10, 0.4)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-[#CCFF00]/10 transition-colors duration-500" />
                
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      {wordOfTheDay.partOfSpeech}
                    </span>
                    <span 
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: isLight ? '#007722' : '#CCFF00' }}
                    >
                      Tap to View Details &rarr;
                    </span>
                  </div>

                  <h2 
                    className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2" 
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                  >
                    {wordOfTheDay.khamyang}
                  </h2>
                </div>

                <div className="flex justify-between items-center mt-12 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <div 
                    className="text-sm uppercase tracking-wider font-bold"
                    style={{ color: isLight ? '#007722' : '#CCFF00' }}
                  >
                    {wordOfTheDay.english}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ) : (
          /* Search active / Category filtered state */
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col gap-12 mt-4">
              {Object.keys(groupedWords).length > 0 ? (
                Object.keys(groupedWords).map((letter) => (
                  <div key={letter} className="flex flex-col md:flex-row gap-6 md:gap-12">
                    
                    {/* Letter Header */}
                    <div className="md:w-32 shrink-0">
                      <div 
                        className="text-6xl md:text-8xl font-black sticky top-[calc(var(--navbar-height)+6.5rem)]" 
                        style={{ color: 'var(--border-color)', fontFamily: 'var(--font-heading)' }}
                      >
                        {letter}
                      </div>
                    </div>

                    {/* Words Cards - Simplified list (Khamyang and English only) */}
                    <div className="flex-1 flex flex-col gap-4">
                      {groupedWords[letter].map((word) => (
                        <div 
                          key={word.id} 
                          onClick={() => setSelectedWord(word)}
                          className="p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:border-[#CCFF00]/50 cursor-pointer flex justify-between items-center"
                          style={{ 
                            borderColor: 'var(--border-color)',
                            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.4)' : 'rgba(10, 10, 10, 0.4)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <h3 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                            {word.khamyang}
                          </h3>
                          <div 
                            className="text-sm md:text-base font-semibold uppercase tracking-wider"
                            style={{ color: isLight ? '#007722' : '#CCFF00' }}
                          >
                            {word.english}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-20 rounded-[2rem] border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  <svg className="w-10 h-10 mx-auto opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg mb-2">No words found for "{searchTerm}"</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                    className="text-sm font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity mt-2"
                    style={{ color: isLight ? '#007722' : '#CCFF00' }}
                  >
                    Clear Filter & Reset
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

      </div>

      {/* POP-UP DETAIL CARD MODAL */}
      {selectedWord && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => setSelectedWord(null)}
        >
          <div 
            className="w-full max-w-md rounded-[2.5rem] border p-8 md:p-10 shadow-2xl relative overflow-hidden"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()} // stop modal close click
          >
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 blur-[40px] rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                {selectedWord.partOfSpeech}
              </span>
              
              <button 
                onClick={() => setSelectedWord(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tai Khamyang (Romanized) */}
            <h2 
              className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-1"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              {selectedWord.khamyang}
            </h2>

            {/* Pronunciation IPA */}
            <span className="text-sm font-mono opacity-50 block mb-6">
              {selectedWord.pronunciation}
            </span>

            {/* Language translations list */}
            <div className="flex flex-col gap-4 py-5 border-t border-b" style={{ borderColor: 'var(--border-color)' }}>
              {/* English Translation */}
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  English
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedWord.english}
                </span>
              </div>
              
              {/* Assamese Script */}
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Assamese (অসমীয়া)
                </span>
                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedWord.assamese}
                </span>
              </div>

              {/* Tai Khamyang Letters (Optional) */}
              {selectedWord.khamyang_letter_word && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Tai Script
                  </span>
                  <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedWord.khamyang_letter_word}
                  </span>
                </div>
              )}

              {/* Sentence (Optional) */}
              {selectedWord.sentence && (
                <div className="flex flex-col gap-1 pt-4 border-t mt-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Example Sentence
                  </span>
                  <span className="text-sm italic" style={{ color: 'var(--text-primary)' }}>
                    "{selectedWord.sentence}"
                  </span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center mt-8 pt-2">
              {/* Left Action: Listen Pronunciation */}
              <button 
                onClick={() => playSpeech(selectedWord)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all hover:bg-neutral-200 dark:hover:bg-neutral-800"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Listen
              </button>

              {/* Right Actions: Copy & Favorite */}
              <div className="flex gap-2.5">
                <button 
                  onClick={() => copyToClipboard(selectedWord)}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  title="Copy details"
                >
                  {copiedId === selectedWord.id ? (
                    <svg 
                      className="w-4.5 h-4.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: isLight ? '#007722' : '#CCFF00' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>

                <button 
                  onClick={() => toggleFavorite(selectedWord.id)}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: favorites.includes(selectedWord.id) ? (isLight ? '#007722' : '#CCFF00') : 'var(--text-primary)',
                    backgroundColor: favorites.includes(selectedWord.id) ? (isLight ? 'rgba(0,119,34,0.1)' : 'rgba(204,255,0,0.1)') : 'transparent'
                  }}
                  title="Favorite"
                >
                  <svg className="w-4.5 h-4.5" fill={favorites.includes(selectedWord.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.57-.372-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SAVED WORDS MODAL */}
      {showSavedModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowSavedModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-[2.5rem] border p-8 md:p-10 shadow-2xl relative overflow-hidden"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/5 blur-[40px] rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Saved Words ({favoriteWords.length})
              </h3>
              
              <button 
                onClick={() => setShowSavedModal(false)}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - List of Favorites */}
            <div className="max-h-[350px] overflow-y-auto pr-2 flex flex-col gap-3">
              {favoriteWords.length > 0 ? (
                favoriteWords.map((word) => (
                  <div 
                    key={word.id}
                    className="p-4 rounded-xl border flex justify-between items-center transition-all hover:border-[#CCFF00]/50"
                    style={{ 
                      borderColor: 'var(--border-color)',
                      backgroundColor: isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div 
                      onClick={() => {
                        setSelectedWord(word);
                        setShowSavedModal(false);
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                        {word.khamyang}
                      </h4>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: isLight ? '#007722' : '#CCFF00' }}>
                        {word.english}
                      </p>
                    </div>

                    {/* Unfavorite Button */}
                    <button 
                      onClick={() => toggleFavorite(word.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-500 transition-colors"
                      title="Remove from saved"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="w-12 h-12 mx-auto opacity-30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.57-.372-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-sm">No saved words yet.</p>
                  <p className="text-xs opacity-60 mt-1 max-w-[250px] mx-auto">Tap the star icon inside any word details popup to save it here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN PROMPT MODAL */}
      {showLoginPrompt && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/70 backdrop-blur-md transition-all duration-300"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl border p-8 shadow-2xl relative overflow-hidden text-center"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 15, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center bg-[#CCFF00]/10">
              <svg className="w-8 h-8 text-[#007722] dark:text-[#CCFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Login Required
            </h3>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              To save words to your personal dictionary, please log in or create a free account.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-3 rounded-full border text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex-1 py-3 rounded-full border text-sm font-bold shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                style={{ 
                  backgroundColor: 'var(--text-primary)', 
                  color: 'var(--bg-primary)',
                  borderColor: isLight ? '#007722' : '#CCFF00'
                }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
