import type { HistoryMessage, MessagesPage } from '../types';
import { minutesAgoIso } from '../utils/time';

const DEFAULT_PAGE_SIZE = 10;

interface FetchDummyMessagesPageArgs {
  userId: string;
  application: string;
  agentId: string;
  page?: number;
  pageSize?: number;
}

function buildConversationId(application: string, agentId: string): string {
  return `conv-mock-${application}-${agentId}`;
}

/**
 * Dummy multi-page history (oldest → newest).
 * Page 1 = most recent messages (matches POST /history/conversations/messages).
 */
function buildAllMessages(conversationId: string): HistoryMessage[] {
  const older: HistoryMessage[] = Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    const isUser = n % 2 === 0;
    return {
      id: `hist-${conversationId}-${n}`,
      conversationId,
      role: isUser ? 'user' : 'assistant',
      content: isUser
        ? `Earlier question #${n}: Can you check related tickets from last week?`
        : `Earlier reply #${n}: I found a few matching tickets. Want me to summarize them?`,
      createdAt: minutesAgoIso(400 - n * 12),
    };
  });

  const newest: HistoryMessage[] = [
    {
      id: `hist-${conversationId}-welcome`,
      conversationId,
      role: 'assistant',
      content: "Hello! I'm your AI Assistant. How can I help you today?",
      createdAt: minutesAgoIso(12),
    },
    {
      id: `hist-${conversationId}-q1`,
      conversationId,
      role: 'user',
      content: 'Why is my sales_report showing lower numbers yesterday?',
      createdAt: minutesAgoIso(8),
    },
    {
      id: `hist-${conversationId}-status`,
      conversationId,
      role: 'status',
      content: "I'll analyze this for you using the Ticket Intelligence agent.",
      createdAt: minutesAgoIso(7),
    },
    {
      id: `hist-${conversationId}-progress`,
      conversationId,
      role: 'progress',
      content: '',
      progress: 72,
      progressLabel: 'Ticket Intelligence · Analyzing ticket',
      createdAt: minutesAgoIso(6),
    },
    {
      id: `hist-${conversationId}-result`,
      conversationId,
      role: 'result',
      content:
        'The drop looks tied to a late ETL job for the sales_report pipeline.',
      bullets: [
        'ETL job finished 47 minutes late',
        'Yesterday’s partition was partially loaded',
        'Similar pattern seen on 3 prior incidents',
      ],
      followUp: 'Want me to open a follow-up ticket with the pipeline owner?',
      actions: [
        { label: 'Open ticket', variant: 'primary' },
        { label: 'Show similar tickets', variant: 'link' },
      ],
      createdAt: minutesAgoIso(4),
    },
  ];

  return [...older, ...newest];
}

const cache = new Map<string, HistoryMessage[]>();

function messagesFor(application: string, agentId: string): HistoryMessage[] {
  const conversationId = buildConversationId(application, agentId);
  let list = cache.get(conversationId);
  if (!list) {
    list = buildAllMessages(conversationId);
    cache.set(conversationId, list);
  }
  return list;
}

/**
 * Simulates POST /history/conversations/messages with page-based pagination.
 */
export async function fetchDummyMessagesPage(
  args: FetchDummyMessagesPageArgs,
): Promise<MessagesPage> {
  const pageSize = args.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = args.page ?? 1;
  const all = messagesFor(args.application, args.agentId);
  const conversationId = buildConversationId(args.application, args.agentId);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));

  const end = all.length - (safePage - 1) * pageSize;
  const start = Math.max(0, end - pageSize);
  const items = all.slice(start, end);
  const hasMore = safePage < totalPages;

  await new Promise((r) => setTimeout(r, 450));

  return {
    items,
    conversationId,
    page: safePage,
    pageSize,
    totalMessages: all.length,
    nextPage: hasMore ? safePage + 1 : null,
    hasMore,
  };
}
