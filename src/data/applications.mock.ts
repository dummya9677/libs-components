import type { ApplicationWithAgents } from '../types';

/** Demo list used when VITE_MOCK_API=true — mirrors GET /applications shape. */
export const mockApplications: ApplicationWithAgents[] = [
  {
    id: 'sales-portal',
    name: 'Sales Portal',
    agents: [
      {
        id: 'agent_dq',
        name: 'Data Quality Intelligence',
        conversationId: 'conv-sales-dq',
      },
      {
        id: 'agent_ticket',
        name: 'Ticket Intelligence',
        conversationId: 'conv-sales-ticket',
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
    id: 'customer-360',
    name: 'Customer 360',
    agents: [
      {
        id: 'agent_dq',
        name: 'Data Quality Intelligence',
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
        conversationId: 'conv-c360-kb',
      },
      {
        id: 'agent_cost',
        name: 'Cost Intelligence',
        conversationId: null,
      },
    ],
  },
];
