import {
  Sparkles,
  Search,
  Shield,
  Layers,
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import type { AgentCapability } from '@/data/agents';

const iconMap: Record<AgentCapability['icon'], LucideIcon> = {
  sparkles: Sparkles,
  search: Search,
  shield: Shield,
  layers: Layers,
  book: BookOpen,
  target: Target,
  zap: Zap,
  check: CheckCircle2,
};

export function CapabilityIcon({
  name,
  className,
}: {
  name: AgentCapability['icon'];
  className?: string;
}) {
  const Icon = iconMap[name];
  return <Icon className={className} strokeWidth={1.75} />;
}
