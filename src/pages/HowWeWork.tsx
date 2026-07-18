import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeaderBlock from '../components/blocks/HeaderBlock';
import FrameworkSectionBlock from '../components/blocks/FrameworkSectionBlock';
import CtaBannerBlock from '../components/blocks/CtaBannerBlock';

export default function HowWeWork() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('how-we-work')
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
          case 'header':
            return <HeaderBlock key={block.id} content={block.content} />;
          case 'framework_section':
            return <FrameworkSectionBlock key={block.id} content={block.content} />;
          case 'cta_banner':
            return <CtaBannerBlock key={block.id} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
