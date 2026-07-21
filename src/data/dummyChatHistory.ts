import type { GetMessagesArgs, HistoryMessage, MessagesPage } from '../types';
import { minutesAgoIso } from '../utils/time';

const PAGE_SIZE = 8;

/**
 * Dummy multi-page history (oldest → newest).
 * Page 0 = oldest, last page = newest (loaded first by the UI).
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

function messagesFor(conversationId: string): HistoryMessage[] {
  let list = cache.get(conversationId);
  if (!list) {
    list = buildAllMessages(conversationId);
    cache.set(conversationId, list);
  }
  return list;
}

/**
 * Simulates `GET /history/:conversationId/messages?cursor=&limit=`
 * Newest page first (no cursor). Older pages via numeric page cursor.
 */
export async function fetchDummyMessagesPage(
  args: GetMessagesArgs,
): Promise<MessagesPage> {
  const limit = args.limit ?? PAGE_SIZE;
  const all = messagesFor(args.conversationId);
  const totalPages = Math.max(1, Math.ceil(all.length / limit));

  // cursor = page index from the end: "0" = newest page, "1" = next older, …
  const pageFromEnd = args.cursor ? Number.parseInt(args.cursor, 10) : 0;
  const safePage = Number.isFinite(pageFromEnd)
    ? Math.max(0, Math.min(pageFromEnd, totalPages - 1))
    : 0;

  const start = Math.max(0, all.length - (safePage + 1) * limit);
  const end = all.length - safePage * limit;
  const items = all.slice(start, end);

  const hasMore = start > 0;
  const nextCursor = hasMore ? String(safePage + 1) : null;

  // Small delay so the “Loading older…” UI is visible in demo mode
  await new Promise((r) => setTimeout(r, 450));

  return { items, nextCursor, hasMore };
}
