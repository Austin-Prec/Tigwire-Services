import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Sparkles, Droplets, Leaf, Building2 } from 'lucide-react';
import { getPublishedArticles, type Article } from '../lib/articles';

const ICONS: Record<string, typeof Sparkles> = { Sparkles, Droplets, Leaf, Building2 };
const getIcon = (name: string) => ICONS[name] ?? Sparkles;

export default function Insights() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    getPublishedArticles()
      .then(setArticles)
      .catch(() => setLoadError('Could not load articles right now. Please try again shortly.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="bg-charcoal-500 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-main px-6 lg:px-20">
          <h1 className="font-garamond text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Insights
          </h1>
          <p className="font-arial text-charcoal-100 text-base md:text-lg leading-relaxed max-w-3xl">
            Cleaning tips, hygiene guidance, and updates from the Tigwire
            Services team.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-white section-padding">
        <div className="container-main px-6 lg:px-20">
          {isLoading && (
            <p className="font-arial text-gray-400 text-sm text-center py-12">Loading articles…</p>
          )}

          {loadError && (
            <p className="font-arial text-sage-400 text-sm text-center py-12">{loadError}</p>
          )}

          {!isLoading && !loadError && articles.length === 0 && (
            <p className="font-arial text-gray-400 text-sm text-center py-12">
              New articles are on the way. Check back soon.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const IconComponent = getIcon(article.icon);
              return (
                <div
                  key={article.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-charcoal-300 flex flex-col"
                >
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url}
                      alt=""
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-charcoal-50 flex items-center justify-center">
                      <IconComponent size={32} className="text-sage-400" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block bg-charcoal-50 text-charcoal-500 text-xs font-semibold px-2 py-1 rounded mb-3 w-fit">
                      {article.category}
                    </span>

                    <h3 className="font-garamond text-charcoal-500 text-xl font-bold mb-2">
                      {article.title}
                    </h3>

                    <p className="font-arial text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{article.author.split(' ')[0]}</span>
                      </div>
                      <span>{article.read_time}</span>
                    </div>

                    <Link
                      to={`/insights/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sage-400 text-sm font-semibold hover:text-sage-500 transition-colors"
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscribe Section */}
          <div className="mt-16 bg-charcoal-50 rounded-lg p-8 text-center">
            <h3 className="font-garamond text-charcoal-500 text-2xl font-bold mb-3">
              Subscribe to Insights
            </h3>
            <p className="font-arial text-gray-600 text-sm mb-6 max-w-lg mx-auto">
              Get the latest articles and thought leadership delivered to your inbox.
            </p>
            
            {/* TODO: replace with Tigwire Services' own Formspree endpoint
                (or another form backend) before launch -- this placeholder
                ID does not point to a real account, so submissions will
                fail until it's swapped in. This is a second, separate
                endpoint from the one in ContactForm.tsx; each needs its
                own real form created at https://formspree.io. */}
            <form 
              action="https://formspree.io/f/REPLACE_WITH_TIGWIRE_NEWSLETTER_FORM_ID" 
              method="POST"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal-400"
              />
              <button
                type="submit"
                className="bg-charcoal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-charcoal-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="font-arial text-gray-400 text-xs mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
