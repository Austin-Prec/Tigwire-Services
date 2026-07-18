import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Linkedin, Mail } from 'lucide-react';
import { Sparkles, Droplets, Leaf, Building2 } from 'lucide-react';
import { getPublishedArticleBySlug, type Article as ArticleType } from '../lib/articles';

const ICONS: Record<string, typeof Sparkles> = { Sparkles, Droplets, Leaf, Building2 };
const getIcon = (name: string) => ICONS[name] ?? Sparkles;

export default function Article() {
  const { slug } = useParams();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [article, setArticle] = useState<ArticleType | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    getPublishedArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setArticle(null));
  }, [slug]);

  // Update meta tags immediately when article loads
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Tigwire Services`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.excerpt);

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', article.title);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', article.excerpt);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', currentUrl);

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      // Use the post's own cover image when it has one, otherwise fall back
      // to the site logo so shared links still show something on-brand.
      // TODO: replace this fallback URL once Tigwire has a real domain and
      // a logo file hosted on it (see the matching note for /tigwire-logo.png
      // in public/ and the og:image note in index.html). Until then this
      // points at a placeholder path, not a real Austin Phiri Advisory URL.
      ogImage.setAttribute(
        'content',
        article.cover_image_url || '/tigwire-logo.png'
      );
    }
  }, [article, currentUrl]);

  if (article === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-arial text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-garamond text-2xl mb-4">Article not found</h1>
          <Link to="/insights" className="text-sage-400 hover:underline">← Back to Insights</Link>
        </div>
      </div>
    );
  }

  const IconComponent = getIcon(article.icon);

  return (
    <div>
      {/* Article Header */}
      <section className="bg-navy-500 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-main px-6 lg:px-20">
          <Link to="/insights" className="inline-flex items-center gap-2 text-navy-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Insights
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <IconComponent size={32} className="text-sage-400" />
              <span className="text-sage-400 text-sm uppercase tracking-wider">{article.category}</span>
            </div>
            <h1 className="font-garamond text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-navy-200 text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{article.read_time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {article.cover_image_url && (
        <div className="bg-white">
          <div className="container-main px-6 lg:px-20 -mt-10 md:-mt-14 relative z-10">
            <img
              src={article.cover_image_url}
              alt=""
              className="w-full max-h-[420px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-main px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div
                className="prose prose-lg max-w-none font-arial text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share Section */}
              <div className="border-t border-gray-100 mt-8 pt-6">
                <h4 className="font-arial text-sm font-semibold mb-3">Share this article</h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0077b5] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-[#006699] transition-colors"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(currentUrl)}`}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-700 transition-colors"
                  >
                    <Mail size={16} /> Email
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar - Author Bio */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-28">
                <h3 className="font-garamond text-navy-500 text-lg font-bold mb-3">About Tigwire Services</h3>
                <p className="font-arial text-gray-600 text-sm leading-relaxed mb-3">
                  <strong>Tigwire Services</strong> is a Malawian-owned cleaning company serving homes, offices, schools, hotels, and banks, with a commitment to reliable, affordable, and environmentally responsible service.
                </p>
                <Link to="/about" className="text-sage-400 text-sm hover:underline inline-flex items-center gap-1">
                  Read full bio →
                </Link>
              </div>
            </div>
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
