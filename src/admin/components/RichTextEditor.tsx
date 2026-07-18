import { useCallback, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { uploadArticleImage } from '../../lib/articles';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// Paste from Word, Google Docs, or other sites brings along a lot of markup
// (inline styles, spans, classes, comments) that would make posts inconsistent
// with the rest of the site's design. We keep only the tags that the public
// Article page already knows how to style via its prose classes, and strip
// everything else down to plain text or these structural tags.
const ALLOWED_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'A', 'UL', 'OL', 'LI',
  'H2', 'H3', 'H4', 'BLOCKQUOTE', 'IMG',
]);

// Known-harmless container tags: we don't want to keep the tag itself (it's
// not in ALLOWED_TAGS), but it's safe to keep processing its children, since
// this is exactly what wraps plain text and nested formatting when pasting
// from Word, Google Docs, or a normal web page.
const UNWRAP_AND_CONTINUE = new Set([
  'DIV', 'SPAN', 'FONT', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN',
  'HTML', 'BODY', 'TBODY', 'TABLE', 'TR', 'TD', 'TH', 'THEAD',
]);

// Everything NOT in ALLOWED_TAGS or UNWRAP_AND_CONTINUE — including tags we
// didn't anticipate (svg, math, template, custom elements, and anything
// future browsers might add) — is dropped entirely, tag and contents both.
// This is deliberately a safe-by-default allowlist rather than a blocklist
// of specific dangerous tags: an unrecognized tag is treated as unsafe until
// shown otherwise, not trusted by default.

// Only allow the URL schemes a normal link or image src should ever need.
// Blocks javascript:, data: (except data:image, needed for some pasted
// inline images), and anything else that isn't a plain link.
function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('data:image/')) return true;
  return /^(https?:|mailto:|tel:|\/|#)/.test(trimmed);
}

function sanitizeNode(node: Node): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.cloneNode();
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as HTMLElement;

  if (!ALLOWED_TAGS.has(el.tagName)) {
    if (!UNWRAP_AND_CONTINUE.has(el.tagName)) {
      // Unrecognized tag: drop it and everything inside it. Safer default
      // than assuming an unknown tag's children are harmless text.
      return null;
    }
    // Known-harmless wrapper: keep processing children, drop the tag itself.
    const fragment = document.createDocumentFragment();
    el.childNodes.forEach((child) => {
      const cleaned = sanitizeNode(child);
      if (cleaned) fragment.appendChild(cleaned);
    });
    return fragment;
  }

  const clean = document.createElement(el.tagName);

  if (el.tagName === 'A') {
    const href = el.getAttribute('href');
    if (href && isSafeUrl(href)) clean.setAttribute('href', href);
    clean.setAttribute('target', '_blank');
    clean.setAttribute('rel', 'noopener noreferrer');
  }

  if (el.tagName === 'IMG') {
    const src = el.getAttribute('src');
    if (src && isSafeUrl(src)) clean.setAttribute('src', src);
    clean.setAttribute('alt', el.getAttribute('alt') || '');
    return clean;
  }

  el.childNodes.forEach((child) => {
    const cleaned = sanitizeNode(child);
    if (cleaned) clean.appendChild(cleaned);
  });

  return clean;
}

function sanitizeHtml(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;
  const fragment = document.createDocumentFragment();
  container.childNodes.forEach((child) => {
    const cleaned = sanitizeNode(child);
    if (cleaned) fragment.appendChild(cleaned);
  });
  const wrapper = document.createElement('div');
  wrapper.appendChild(fragment);
  return wrapper.innerHTML;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const runCommand = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');

      if (html) {
        const clean = sanitizeHtml(html);
        document.execCommand('insertHTML', false, clean);
      } else {
        document.execCommand('insertText', false, text);
      }
      emitChange();
    },
    [emitChange]
  );

  const insertImageAtCursor = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files can be added to a post.');
        return;
      }
      setUploadError('');
      setIsUploading(true);
      try {
        const url = await uploadArticleImage(file);
        editorRef.current?.focus();
        document.execCommand(
          'insertHTML',
          false,
          `<img src="${url}" alt="" />`
        );
        emitChange();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Image upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [emitChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        insertImageAtCursor(file);
      }
    },
    [insertImageAtCursor]
  );

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImageAtCursor(file);
    e.target.value = '';
  };

  const handleLink = () => {
    const url = window.prompt('Paste the link URL');
    if (url) runCommand('createLink', url);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2">
        <ToolbarButton label="Bold" onClick={() => runCommand('bold')}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => runCommand('italic')}>
          <Italic size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Heading" onClick={() => runCommand('formatBlock', '<h2>')}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Subheading" onClick={() => runCommand('formatBlock', '<h3>')}>
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => runCommand('formatBlock', '<blockquote>')}>
          <Quote size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bullet list" onClick={() => runCommand('insertUnorderedList')}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => runCommand('insertOrderedList')}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Add link" onClick={handleLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Add photo"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <ImageIcon size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Undo" onClick={() => runCommand('undo')}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => runCommand('redo')}>
          <Redo size={16} />
        </ToolbarButton>

        {isUploading && (
          <span className="ml-2 text-xs text-gray-500 font-arial">Adding photo…</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFilePick}
      />

      {/* Editable body */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[400px] max-h-[70vh] overflow-y-auto px-6 py-5 font-arial text-gray-700 leading-relaxed focus:outline-none prose prose-lg max-w-none"
          style={{ fontFamily: 'inherit' }}
          onInput={emitChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          dangerouslySetInnerHTML={{ __html: value }}
        />

        {value === '' && (
          <p className="pointer-events-none absolute left-6 top-5 text-gray-400 font-arial">
            Start writing, or paste in content from anywhere. Drag a photo in to add it.
          </p>
        )}

        {isDraggingOver && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-500/5 border-2 border-dashed border-navy-300 rounded">
            <p className="font-arial text-sm font-semibold text-navy-500 bg-white px-4 py-2 rounded-lg shadow">
              Drop the photo to add it here
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="px-6 py-2 text-sm text-sage-400 font-arial border-t border-gray-100">
          {uploadError}
        </p>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded text-gray-600 hover:bg-navy-50 hover:text-navy-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-300 mx-1" />;
}
