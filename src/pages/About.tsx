import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeaderBlock from '../components/blocks/HeaderBlock';
import PhotoBlock from '../components/blocks/PhotoBlock';
import BioBlock from '../components/blocks/BioBlock';
import ListBlock from '../components/blocks/ListBlock';
import CredentialsPanelBlock from '../components/blocks/CredentialsPanelBlock';

export default function About() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('about')
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

  const headerBlock = blocks.find((b) => b.type === 'header');
  const photoBlock = blocks.find((b) => b.type === 'photo');
  const bioBlock = blocks.find((b) => b.type === 'bio');
  const listBlocks = blocks.filter((b) => b.type === 'list');
  const credentialsPanelBlocks = blocks.filter((b) => b.type === 'credentials_panel');

  return (
    <div>
      {headerBlock && <HeaderBlock content={headerBlock.content} />}

      {/* Photo and bio share one grid section, matching the original layout
          where the photo occupies 1 of 3 columns and the bio occupies 2.
          When there's no photo (e.g. Tigwire has none to seed yet), the
          grid collapses to a single column so the bio isn't stranded at
          2/3 width with empty space beside it — see BioBlock.tsx's
          lg:col-span-2, which assumes a 3-column grid is always present. */}
      {(photoBlock || bioBlock) && (
        <section className="bg-white section-padding">
          <div className="container-main px-6 lg:px-20">
            <div className={photoBlock ? 'grid grid-cols-1 lg:grid-cols-3 gap-12' : 'grid grid-cols-1'}>
              {photoBlock && <PhotoBlock content={photoBlock.content} />}
              {bioBlock && <BioBlock content={bioBlock.content} fullWidth={!photoBlock} />}
            </div>
          </div>
        </section>
      )}

      {listBlocks.map((block) => (
        <ListBlock key={block.id} content={block.content} />
      ))}

      {credentialsPanelBlocks.map((block) => (
        <CredentialsPanelBlock key={block.id} content={block.content} />
      ))}
    </div>
  );
}
