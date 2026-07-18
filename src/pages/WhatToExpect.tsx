import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeaderBlock from '../components/blocks/HeaderBlock';
import CaseStudyGridBlock from '../components/blocks/CaseStudyGridBlock';

export default function WhatToExpect() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('what-to-expect')
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
          case 'case_study_grid':
            return <CaseStudyGridBlock key={block.id} content={block.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
