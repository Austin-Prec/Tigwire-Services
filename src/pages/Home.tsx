import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeroBlock from '../components/blocks/HeroBlock';
import WorkGalleryBlock from '../components/blocks/WorkGalleryBlock';
import ValueCardsBlock from '../components/blocks/ValueCardsBlock';
import StatBarBlock from '../components/blocks/StatBarBlock';
import LinkPreviewBlock from '../components/blocks/LinkPreviewBlock';

export default function Home() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('home')
      .then(setBlocks)
      .catch(() => setBlocks([]));
  }, []);

  if (blocks === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-arial text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      {blocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return (
              <div key={block.id}>
                <HeroBlock content={block.content} />
                {/* WorkGalleryBlock is fixed UI, not editable block content
                    — it carries real drag/touch interaction state, the
                    same distinction applied to ContactForm elsewhere in
                    this project. Rendered right after the hero regardless
                    of migration content, since it isn't part of the
                    page_blocks data for 'home'. */}
                <WorkGalleryBlock />
              </div>
            );
          case 'value_cards':
            return <ValueCardsBlock key={block.id} content={block.content} />;
          case 'stat_bar':
            return <StatBarBlock key={block.id} content={block.content} />;
          case 'link_preview':
            return <LinkPreviewBlock key={block.id} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
