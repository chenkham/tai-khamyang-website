import WordReveal from '@/components/WordReveal';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen pt-[calc(var(--navbar-height)+4rem)] pb-20 relative z-10 flex flex-col items-center">
      <div className="wm-container w-full max-w-4xl px-5">
        
        <WordReveal text="ABOUT TAI KHAMYANG" className="h2 text-center mb-6" />
        
        <ScrollReveal delay={0.2}>
          <p className="text-base md:text-lg text-center mb-16 max-w-[600px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover the vibrant history, deep spiritual roots, and the urgent journey to preserve a critically endangered language.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-12 md:gap-20">
          
          {/* Section 1 */}
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3 shrink-0">
                <h3 className="text-3xl font-bold uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  Origins &<br/>Migration
                </h3>
              </div>
              <div className="md:w-2/3 prose prose-invert text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="mb-4">
                  The Tai Khamyang (also known as Khamjang or Shyam) trace their origins to the Tai people of Southeast Asia. Their name is historically linked to the Khamjang region of present-day Myanmar, from where they began their migration centuries ago.
                </p>
                <p>
                  Over generations, they migrated across the rugged Patkai hills and settled in the lush valleys of Assam and parts of Arunachal Pradesh. Today, they form a small but culturally rich community that continues to honor its deep Southeast Asian roots while actively participating in the modern Indian landscape.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="h-px w-full opacity-20" style={{ backgroundColor: 'var(--text-secondary)' }} />

          {/* Section 2 */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3 shrink-0">
                <h3 className="text-3xl font-bold uppercase text-[#CCFF00]" style={{ fontFamily: 'var(--font-heading)' }}>
                  A Language<br/>In Peril
                </h3>
              </div>
              <div className="md:w-2/3 prose prose-invert text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="mb-4">
                  The Tai Khamyang language belongs to the Southwestern branch of the Kra-Dai language family. Historically, it was the primary language of the community, carrying the weight of their oral traditions, poetry, and daily interactions.
                </p>
                <p>
                  Today, the language is classified as <strong>critically endangered</strong>. Through assimilation and the passage of time, the majority of the population has shifted to using Assamese. However, in certain villages like Powaimukh, the language miraculously survives. Dedicated elders and linguists are now racing against time to document the language and revitalize its use among the youth before it is lost forever.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="h-px w-full opacity-20" style={{ backgroundColor: 'var(--text-secondary)' }} />

          {/* Section 3 */}
          <ScrollReveal delay={0.5}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3 shrink-0">
                <h3 className="text-3xl font-bold uppercase" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  Faith &<br/>Tradition
                </h3>
              </div>
              <div className="md:w-2/3 prose prose-invert text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="mb-4">
                  The Tai Khamyang are devout followers of <strong>Theravada Buddhism</strong>. Religion is the anchor of their community life. Every Tai Khamyang village is centered around a beautifully constructed <em>vihara</em> (monastery) or pagoda.
                </p>
                <p>
                  The monks serve as spiritual guides, educators, and the custodians of ancient Pali and Tai manuscripts. Annual festivals, vibrant rituals, and traditional weaving practices are deeply intertwined with their religious calendar, creating a living, breathing tapestry of faith that connects them directly to their ancestors.
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
