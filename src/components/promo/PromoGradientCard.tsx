import { cn } from '../../utils/cn';
import { clientBrandGradient } from '../../config/clientColors';
import { env } from '../../utils/env';
import multiAgentImage from '../../assets/multi-agent-intelligence.png';
import sidebarRobotImage from '../../assets/robot.png';

export type PromoGradientVariant = 'sidebar' | 'rail';

export interface PromoGradientCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  placeholderLabel?: string;
  variant?: PromoGradientVariant;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const cardHeights: Record<PromoGradientVariant, string> = {
  sidebar: 'min-h-[160px]',
  rail: 'min-h-[180px]',
};

const gradientStyle = {
  background: clientBrandGradient,
} as const;

/**
 * Client-brand gradient promo card with optional transparent PNG artwork.
 */
export function PromoGradientCard({
  title,
  description,
  imageUrl,
  imageAlt = 'Promotional illustration',
  placeholderLabel = 'PNG artwork',
  variant = 'sidebar',
  className,
  action,
}: PromoGradientCardProps) {
  const isRail = variant === 'rail';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl text-white shadow-card',
        cardHeights[variant],
        className,
      )}
      style={gradientStyle}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 left-1/3 h-20 w-20 rounded-full opacity-30 blur-xl"
        style={{ backgroundColor: '#68d1ff' }}
        aria-hidden
      />

      <PromoArtwork
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        placeholderLabel={placeholderLabel}
        variant={variant}
      />

      <div
        className={cn(
          'relative z-10 flex flex-col p-3',
          cardHeights[variant],
        )}
      >
        <div className={cn(isRail ? 'max-w-[52%]' : 'text-center')}>
          <p
            className={cn(
              'font-semibold leading-tight text-white',
              isRail ? 'text-[11px]' : 'text-xs',
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'mt-1 leading-relaxed text-white/90',
              isRail ? 'text-[9px]' : 'text-[11px]',
            )}
          >
            {description}
          </p>
        </div>

        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="relative z-20 mt-auto w-full shrink-0 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-client-primary shadow-sm transition hover:bg-white/90"
          >
            {action.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PromoArtwork({
  imageUrl,
  imageAlt,
  placeholderLabel,
}: {
  imageUrl?: string;
  imageAlt: string;
  placeholderLabel: string;
  variant: PromoGradientVariant;
}) {
  if (!imageUrl) {
    return (
      <div
        className="pointer-events-none absolute bottom-2 right-2 z-[1] flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-white/30 bg-white/10"
        aria-hidden
      >
        <span className="px-1 text-center text-[8px] font-medium leading-tight text-white/70">
          {placeholderLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[148px] w-auto max-w-[58%] object-contain object-bottom-right"
    />
  );
}

export const promoImages = {
  sidebarAssistant: env.sidebarPromoImageUrl || sidebarRobotImage,
  multiAgent: env.multiAgentPromoImageUrl || multiAgentImage,
};
