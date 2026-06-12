import { useState, useEffect } from 'react';
import WordReveal from '@/components/WordReveal';
import ScrollReveal from '@/components/ScrollReveal';

// Articles to fetch from Wikipedia
const WIKI_ARTICLES = [
  { id: 'Tai_Khamyangs', title: 'Tai Khamyang People' },
  { id: 'Theravada', title: 'Theravada Buddhism' },
  { id: 'Ahom_people', title: 'Ahom People (Related Tai group)' },
  { id: 'Assam', title: 'Assam (Region)' },
];

interface WikiData {
  title: string;
  extract: string;
}

export default function ReadMorePage() {
  const [articlesData, setArticlesData] = useState<Record<string, WikiData>>({});
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllWiki = async () => {
      setLoading(true);
      const newData: Record<string, WikiData> = {};
      
      try {
        await Promise.all(
          WIKI_ARTICLES.map(async (article) => {
            const response = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${article.id}&format=json&origin=*`
            );
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            
            if (pageId !== '-1') {
              newData[article.id] = {
                title: article.title,
                extract: pages[pageId].extract,
              };
            }
          })
        );
        setArticlesData(newData);
      } catch (error) {
        console.error("Failed to fetch Wikipedia data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWiki();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen pt-[calc(var(--navbar-height)+4rem)] pb-20 relative z-10 flex flex-col items-center">
      <div className="wm-container w-full max-w-4xl px-5">
        
        <WordReveal text="READ MORE" className="h2 text-center mb-6" />
        
        <ScrollReveal delay={0.2}>
          <p className="text-base md:text-lg text-center mb-16 max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Dive deeper into the history, religion, and geography of the Tai Khamyang community through live Wikipedia articles.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="w-full p-8 rounded-3xl border border-gray-700 animate-pulse bg-gray-900/20">
                <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6"></div>
              </div>
            ) : (
              WIKI_ARTICLES.map((article) => {
                const data = articlesData[article.id];
                const isOpen = openAccordion === article.id;
                
                return (
                  <div 
                    key={article.id}
                    className="rounded-3xl border transition-all duration-500 relative z-10"
                    style={{ 
                      borderColor: isOpen ? '#CCFF00' : 'var(--border-color)',
                      backgroundColor: 'var(--bg-card)'
                    }}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(article.id)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                        {article.title}
                      </h3>
                      
                      {/* Chevron Icon */}
                      <div 
                        className="w-10 h-10 shrink-0 rounded-full border flex items-center justify-center transition-transform duration-500"
                        style={{ 
                          borderColor: isOpen ? '#CCFF00' : 'var(--border-color)', 
                          color: isOpen ? '#CCFF00' : 'var(--text-primary)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <div 
                      className="grid transition-all duration-500 ease-in-out"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-8 pb-8 pt-2">
                        {data ? (
                          <div 
                            className="wiki-content prose prose-invert max-w-none text-base md:text-lg leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                            dangerouslySetInnerHTML={{ __html: data.extract }}
                          />
                        ) : (
                          <p style={{ color: 'var(--text-secondary)' }}>Article could not be loaded.</p>
                        )}
                        
                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                          <a 
                            href={`https://en.wikipedia.org/wiki/${article.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                            style={{ color: '#CCFF00' }}
                          >
                            Read full article on Wikipedia
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
