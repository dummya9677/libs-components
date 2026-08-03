import type { AgentDefinition } from '../../data/agents';
import { getAgentTheme } from '../../data/agents';
import { getAgentLucideIcon } from '../../utils/agentIcons';
import { cn } from '../../utils/cn';

interface AgentIconProps {
  agent: AgentDefinition;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const sizeStyles = {
  sm: {
    container: 'h-7 w-7',
    icon: 'h-3.5 w-3.5',
    strokeWidth: 1.75,
  },
  md: {
    container: 'h-9 w-9',
    icon: 'h-4 w-4',
    strokeWidth: 1.75,
  },
  lg: {
    container: 'h-10 w-10 sm:h-12 sm:w-12',
    icon: 'h-5 w-5 sm:h-6 sm:w-6',
    strokeWidth: 1.5,
  },
} as const;

export function AgentIcon({
  agent,
  size = 'md',
  shape = 'circle',
  className,
}: AgentIconProps) {
  const theme = getAgentTheme(agent.colorKey);
  const Icon = getAgentLucideIcon(agent);
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center',
        shape === 'circle' ? 'rounded-full shadow-sm' : 'rounded-xl shadow-card sm:rounded-2xl',
        styles.container,
        className,
      )}
      style={{
        backgroundColor: theme.heroIcon,
        color: '#FFFFFF',
      }}
    >
      <Icon className={styles.icon} strokeWidth={styles.strokeWidth} />
    </div>
  );
}
