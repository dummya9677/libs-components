import type { ApplicationWithAgents } from '../types';

/** Demo list used when VITE_MOCK_API=true — mirrors GET /applications shape. */
export const mockApplications: ApplicationWithAgents[] = [
  {
    id: 'GBICC',
    name: 'GBICC',
    agents: [
      {
        id: 'agent_dq',
        name: 'Data Quality Intelligence',
        conversationId: 'conv-gbicc-dq',
      },
      {
        id: 'agent_bau',
        name: 'BAU Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_ticket',
        name: 'Ticket Intelligence',
        conversationId: 'conv-gbicc-ticket',
      },
      {
        id: 'agent_data',
        name: 'Data Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_impact',
        name: 'Impact Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_kb',
        name: 'Knowledge Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_cost',
        name: 'Cost Intelligence',
        conversationId: null,
      },
    ],
  },
  {
    id: 'SMART EU',
    name: 'SMART EU',
    agents: [
      {
        id: 'agent_dq',
        name: 'Data Quality Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_bau',
        name: 'BAU Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_ticket',
        name: 'Ticket Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_data',
        name: 'Data Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_impact',
        name: 'Impact Intelligence',
        conversationId: null,
      },
      {
        id: 'agent_kb',
        name: 'Knowledge Intelligence',
        conversationId: 'conv-smart-eu-kb',
      },
      {
        id: 'agent_cost',
        name: 'Cost Intelligence',
        conversationId: null,
      },
    ],
  },
];
