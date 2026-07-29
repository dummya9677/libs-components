import type { ReactNode } from 'react';

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-bold-${index}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${keyPrefix}-text-${index}`}>{part}</span>;
  });
}

interface FormattedMessageContentProps {
  text: string;
  className?: string;
}

/**
 * Renders assistant/user text with basic formatting: paragraphs, line breaks, **bold**.
 */
export function FormattedMessageContent({
  text,
  className,
}: FormattedMessageContentProps) {
  const paragraphs = text.split(/\n{2,}/).filter((paragraph) => paragraph.trim());

  if (paragraphs.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split('\n');

        return (
          <p
            key={`paragraph-${paragraphIndex}`}
            className={paragraphIndex > 0 ? 'mt-2.5' : undefined}
          >
            {lines.map((line, lineIndex) => (
              <span key={`line-${paragraphIndex}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderInlineMarkdown(line, `p${paragraphIndex}-l${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
