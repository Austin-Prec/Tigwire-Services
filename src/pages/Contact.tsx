import { useEffect, useState } from 'react';
import { getPageBlocks, type PageBlock } from '../lib/pages';
import HeaderBlock from '../components/blocks/HeaderBlock';
import ContactForm from '../components/blocks/ContactForm';
import ContactSidebarBlock from '../components/blocks/ContactSidebarBlock';

export default function Contact() {
  const [blocks, setBlocks] = useState<PageBlock[] | null>(null);

  useEffect(() => {
    getPageBlocks('contact')
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
  const sidebarBlock = blocks.find((b) => b.type === 'contact_sidebar');

  return (
    <div>
      {headerBlock && <HeaderBlock content={headerBlock.content} />}

      <section className="bg-white section-padding">
        <div className="container-main px-6 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* The form is a fixed component, not editable block content —
                it carries real client-side state and a live submission
                endpoint, the same distinction applied to the blog editor
                elsewhere in this project. */}
            <ContactForm />

            {sidebarBlock && <ContactSidebarBlock content={sidebarBlock.content} />}
          </div>
        </div>
      </section>
    </div>
  );
}
