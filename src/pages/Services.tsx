import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeaderBlock from '../components/blocks/HeaderBlock';
import ServiceGridBlock from '../components/blocks/ServiceGridBlock';
import PricingNotesBlock from '../components/blocks/PricingNotesBlock';

export default function Services() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('services')
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
          case 'service_grid':
            return <ServiceGridBlock key={block.id} content={block.content} />;
          case 'pricing_notes':
            return <PricingNotesBlock key={block.id} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
