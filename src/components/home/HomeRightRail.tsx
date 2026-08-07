import { env } from '../../utils/env';
import {
  PromoGradientCard,
  promoImages,
} from '../promo/PromoGradientCard';
import { HomeInsightsCards } from './HomeInsightsCards';

export function HomeRightRail() {
  return (
    <aside className="flex h-full min-h-0 w-home-rail shrink-0 flex-col overflow-hidden border-l border-app-border bg-surface/60">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scrollbar-thin">
        <HomeInsightsCards />
      </div>

      <div className="mt-auto shrink-0 p-2.5 pt-2">
        <PromoGradientCard
          variant="rail"
          title="Multi-Agent Intelligence"
          description={`${env.appName} orchestrates multiple AI agents to analyze, correlate and resolve your issues faster.`}
          imageUrl={promoImages.multiAgent}
          imageAlt="Multi-agent intelligence illustration"
          placeholderLabel="Add PNG to public/images/multi-agent-promo.png"
        />
      </div>
    </aside>
  );
}
