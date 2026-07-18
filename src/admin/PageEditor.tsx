import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Image as ImageIcon,
  AlignLeft,
  List as ListIcon,
  Heading1,
  LogOut,
  Sparkles,
  LayoutGrid,
  BarChart3,
  ExternalLink,
  Layers,
  Megaphone,
  LayoutList,
  StickyNote,
  BadgeCheck,
  Contact,
  BookMarked,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  getPageBlocks,
  updateBlockContent,
  deleteBlock,
  createBlock,
  reorderBlocks,
  type PageBlock,
  type BlockType,
} from '../lib/pages';
import HeaderBlockEditor from './blocks/HeaderBlockEditor';
import PhotoBlockEditor from './blocks/PhotoBlockEditor';
import BioBlockEditor from './blocks/BioBlockEditor';
import ListBlockEditor from './blocks/ListBlockEditor';
import CredentialsPanelBlockEditor from './blocks/CredentialsPanelBlockEditor';
import HeroBlockEditor from './blocks/HeroBlockEditor';
import ValueCardsBlockEditor from './blocks/ValueCardsBlockEditor';
import StatBarBlockEditor from './blocks/StatBarBlockEditor';
import LinkPreviewBlockEditor from './blocks/LinkPreviewBlockEditor';
import FrameworkSectionBlockEditor from './blocks/FrameworkSectionBlockEditor';
import CtaBannerBlockEditor from './blocks/CtaBannerBlockEditor';
import ServiceGridBlockEditor from './blocks/ServiceGridBlockEditor';
import PricingNotesBlockEditor from './blocks/PricingNotesBlockEditor';
import ContactSidebarBlockEditor from './blocks/ContactSidebarBlockEditor';
import CaseStudyGridBlockEditor from './blocks/CaseStudyGridBlockEditor';

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'how-we-work', label: 'How We Work' },
  { key: 'services', label: 'Services' },
  { key: 'contact', label: 'Contact' },
  { key: 'what-to-expect', label: 'What to Expect' },
];

const BLOCK_TYPE_INFO: Record<BlockType, { label: string; icon: typeof ImageIcon; defaultContent: Record<string, unknown>; pages: string[] }> = {
  header: { label: 'Header block', icon: Heading1, defaultContent: { title: '', intro: '' }, pages: ['about', 'how-we-work', 'services', 'contact', 'what-to-expect'] },
  photo: { label: 'Photo block', icon: ImageIcon, defaultContent: { image_url: '', alt: '', badges: [] }, pages: ['about'] },
  bio: { label: 'Bio block', icon: AlignLeft, defaultContent: { name: '', title: '', quote: '', paragraphs: [''], footnote: '' }, pages: ['about'] },
  list: { label: 'List block', icon: ListIcon, defaultContent: { title: '', icon: 'Award', items: [''], footnote: '' }, pages: ['about'] },
  credentials_panel: { label: 'Credentials panel block', icon: BadgeCheck, defaultContent: { panels: [] }, pages: ['about'] },
  hero: { label: 'Hero block', icon: Sparkles, defaultContent: { background_image_url: '', badge_text: '', headline: '', subheadline: '', quote: '', buttons: [], floating_stats: [] }, pages: ['home'] },
  value_cards: { label: 'Value cards block', icon: LayoutGrid, defaultContent: { title: '', subtitle: '', cards: [] }, pages: ['home'] },
  stat_bar: { label: 'Stat bar block', icon: BarChart3, defaultContent: { label: '', stats: [] }, pages: ['home'] },
  link_preview: { label: 'Link preview block', icon: ExternalLink, defaultContent: { title: '', body: '', link_text: '', link: '/about' }, pages: ['home'] },
  framework_section: { label: 'Process section block', icon: Layers, defaultContent: { icon: 'Shield', heading: '', subtitle: '', body: '', pillars: [], download_label: '', download_url: '', variant: 'light' }, pages: ['how-we-work'] },
  cta_banner: { label: 'CTA banner block', icon: Megaphone, defaultContent: { body: '', button_label: '', button_link: '/contact' }, pages: ['how-we-work'] },
  service_grid: { label: 'Service grid block', icon: LayoutList, defaultContent: { services: [] }, pages: ['services'] },
  pricing_notes: { label: 'Pricing notes block', icon: StickyNote, defaultContent: { heading: '📌 Pricing Notes', items: [], framework_note: '' }, pages: ['services'] },
  contact_sidebar: { label: 'Contact sidebar block', icon: Contact, defaultContent: { heading: 'Direct Contact', channels: [], response_time: '' }, pages: ['contact'] },
  case_study_grid: { label: 'What-to-expect grid block', icon: BookMarked, defaultContent: { intro_note: '', studies: [] }, pages: ['what-to-expect'] },
};

export default function PageEditor() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('about');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const load = async (page: string) => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getPageBlocks(page);
      setBlocks(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load page content');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(activePage);
  }, [activePage]);

  const handleContentChange = (id: string, content: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const handleSaveBlock = async (block: PageBlock) => {
    setSavingId(block.id);
    setSaveMessage('');
    try {
      await updateBlockContent(block.id, block.content);
      setSaveMessage('Saved.');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save block');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (block: PageBlock) => {
    const confirmed = window.confirm('Remove this block from the page? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteBlock(block.id);
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete block');
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const next = [...blocks];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setBlocks(next); // optimistic reorder in the UI

    try {
      await reorderBlocks(activePage, next.map((b) => b.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reorder blocks');
      load(activePage); // revert to server state on failure
    }
  };

  const handleAddBlock = async (type: BlockType) => {
    setShowAddMenu(false);
    try {
      const created = await createBlock({
        page: activePage,
        type,
        content: BLOCK_TYPE_INFO[type].defaultContent,
      });
      setBlocks((prev) => [...prev, created]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add block');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-charcoal-500 px-6 py-5 md:px-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-4">
            {saveMessage && <span className="font-arial text-xs text-charcoal-200">{saveMessage}</span>}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center gap-2 mb-6">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`px-4 py-2 rounded-lg font-arial text-sm font-semibold transition-colors ${
                activePage === p.key
                  ? 'bg-charcoal-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-charcoal-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="font-arial text-gray-500 text-sm py-12 text-center">Loading…</p>}
        {loadError && <p className="font-arial text-sage-400 text-sm py-4">{loadError}</p>}

        {!isLoading && !loadError && (
          <div className="space-y-3">
            {blocks.map((block, index) => {
              const info = BLOCK_TYPE_INFO[block.type];
              const Icon = info?.icon ?? AlignLeft;

              return (
                <div key={block.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-arial uppercase tracking-wide">
                      <Icon size={14} /> {info?.label ?? block.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="p-1.5 text-gray-400 hover:text-charcoal-500 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={index === blocks.length - 1}
                        title="Move down"
                        className="p-1.5 text-gray-400 hover:text-charcoal-500 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(block)}
                        title="Delete block"
                        className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {block.type === 'header' && (
                    <HeaderBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'photo' && (
                    <PhotoBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'bio' && (
                    <BioBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'list' && (
                    <ListBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'credentials_panel' && (
                    <CredentialsPanelBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'hero' && (
                    <HeroBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'value_cards' && (
                    <ValueCardsBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'stat_bar' && (
                    <StatBarBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'link_preview' && (
                    <LinkPreviewBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'framework_section' && (
                    <FrameworkSectionBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'cta_banner' && (
                    <CtaBannerBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'service_grid' && (
                    <ServiceGridBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'pricing_notes' && (
                    <PricingNotesBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'contact_sidebar' && (
                    <ContactSidebarBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}
                  {block.type === 'case_study_grid' && (
                    <CaseStudyGridBlockEditor
                      content={block.content}
                      onChange={(c) => handleContentChange(block.id, c)}
                    />
                  )}

                  <button
                    onClick={() => handleSaveBlock(block)}
                    disabled={savingId === block.id}
                    className="mt-3 px-4 py-1.5 bg-charcoal-500 text-white rounded-lg font-arial text-xs font-semibold hover:bg-charcoal-600 transition-colors disabled:opacity-50"
                  >
                    {savingId === block.id ? 'Saving…' : 'Save block'}
                  </button>
                </div>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setShowAddMenu((s) => !s)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-500 hover:border-charcoal-300 hover:text-charcoal-500 transition-colors font-arial text-sm"
              >
                <Plus size={16} /> Add a block
              </button>

              {showAddMenu && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {(Object.keys(BLOCK_TYPE_INFO) as BlockType[])
                    .filter((type) => BLOCK_TYPE_INFO[type].pages.includes(activePage))
                    .map((type) => {
                    const info = BLOCK_TYPE_INFO[type];
                    const Icon = info.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddBlock(type)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors font-arial text-sm text-gray-700"
                      >
                        <Icon size={16} className="text-charcoal-400" /> {info.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
