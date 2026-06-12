import { useState } from 'react';
import WordReveal from '@/components/WordReveal';
import ScrollReveal from '@/components/ScrollReveal';

const faqs = [
  { q: 'Who are the Tai Khamyang people?', a: 'The Tai Khamyang (also known as Khamjang or Shyam) are an indigenous Tai-speaking community residing primarily in the Indian states of Assam and parts of Arunachal Pradesh.' },
  { q: 'What is their language status?', a: 'The Tai Khamyang language is critically endangered. While it was once spoken widely within the community, it is now restricted to a very small number of elderly speakers.' },
  { q: 'What is their primary religion?', a: 'The Tai Khamyang are devout followers of Theravada Buddhism. Their villages feature viharas (monasteries) and pagodas that house ancient manuscripts and religious relics.' },
  { q: 'Where do they originate from?', a: 'They trace their origins to the Tai people of Southeast Asia, specifically the Khamjang region of present-day Myanmar, and migrated to Assam over several centuries.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 lg:py-40 relative z-10">
      <div className="wm-container">
        {/* Header */}
        <div className="mb-16">
          <WordReveal text="ABOUT TAI KHAMYANG" className="h2 text-center mb-6" />
          <ScrollReveal delay={0.3}>
            <p className="text-base text-center max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Learn more about this resilient community and their rich heritage.
            </p>
          </ScrollReveal>
        </div>

        {/* Accordion Cards */}
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal stagger={0.08} y={20}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="mb-4 rounded-2xl bg-[var(--bg-card)] shadow-sm border relative z-10"
                  style={{ borderColor: 'var(--border-color)' }}
                  data-state={isOpen ? 'open' : 'closed'}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left gap-4 cursor-pointer transition-colors"
                  >
                    <span
                      className="text-base md:text-lg font-medium"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                    >
                      {faq.q}
                    </span>
                    
                    <div
                      className="w-10 h-10 shrink-0 rounded-full border flex items-center justify-center relative faq-icon transition-transform duration-500"
                      style={{ 
                        borderColor: 'var(--border-color)', 
                        color: 'var(--text-primary)',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                      }}
                    >
                      <div className="w-4 h-px absolute" style={{ backgroundColor: 'currentColor' }} />
                      <div className="h-4 w-px absolute" style={{ backgroundColor: 'currentColor' }} />
                    </div>
                  </button>

                  <div
                    className="grid transition-all duration-500"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-6 pb-6 md:px-8 md:pb-8 text-sm md:text-base leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
