import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, LogOut, Eye, LayoutTemplate, ImageUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAllArticlesForAdmin, deleteArticle, type Article } from '../lib/articles';

export default function Dashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (article: Article) => {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This can't be undone.`
    );
    if (!confirmed) return;

    setDeletingId(article.id);
    try {
      await deleteArticle(article.id);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-charcoal-500 px-6 py-5 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-garamond text-white text-xl md:text-2xl font-bold">
              Your posts
            </h1>
            <p className="font-arial text-charcoal-200 text-xs mt-1">
              Tigwire Services — writing area
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/admin/pages"
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LayoutTemplate size={16} /> Site pages
            </Link>
            <Link
              to="/admin/work"
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <ImageUp size={16} /> Work photos
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="font-arial text-sm text-gray-500">
            {articles.length} {articles.length === 1 ? 'post' : 'posts'}
          </p>
          <Link
            to="/admin/new"
            className="flex items-center gap-2 bg-sage-400 text-white px-5 py-2.5 rounded-lg font-arial text-sm font-semibold hover:bg-sage-500 transition-colors"
          >
            <Plus size={16} /> New post
          </Link>
        </div>

        {isLoading && (
          <p className="font-arial text-gray-500 text-sm py-12 text-center">Loading your posts…</p>
        )}

        {loadError && (
          <p className="font-arial text-sage-400 text-sm py-4">{loadError}</p>
        )}

        {!isLoading && !loadError && articles.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg py-16 text-center">
            <p className="font-garamond text-charcoal-500 text-xl font-bold mb-2">
              Nothing here yet
            </p>
            <p className="font-arial text-gray-500 text-sm mb-6">
              Write your first post and publish it straight to the Insights page.
            </p>
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-2 bg-sage-400 text-white px-5 py-2.5 rounded-lg font-arial text-sm font-semibold hover:bg-sage-500 transition-colors"
            >
              <Plus size={16} /> New post
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={article.status} />
                  <h3 className="font-garamond text-charcoal-500 font-bold truncate">
                    {article.title || 'Untitled'}
                  </h3>
                </div>
                <p className="font-arial text-xs text-gray-400">
                  {article.status === 'published' && article.published_at
                    ? `Published ${formatDate(article.published_at)}`
                    : `Last edited ${formatDate(article.updated_at)}`}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {article.status === 'published' && (
                  <a
                    href={`/insights/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live"
                    className="p-2 text-gray-400 hover:text-charcoal-500 transition-colors"
                  >
                    <Eye size={16} />
                  </a>
                )}
                <Link
                  to={`/admin/edit/${article.id}`}
                  title="Edit"
                  className="p-2 text-gray-400 hover:text-charcoal-500 transition-colors"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(article)}
                  disabled={deletingId === article.id}
                  title="Delete"
                  className="p-2 text-gray-400 hover:text-sage-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' }) {
  if (status === 'published') {
    return (
      <span className="inline-block bg-green-50 text-green-700 text-[10px] font-arial font-semibold uppercase tracking-wide px-2 py-0.5 rounded">
        Published
      </span>
    );
  }
  return (
    <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-arial font-semibold uppercase tracking-wide px-2 py-0.5 rounded">
      Draft
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
