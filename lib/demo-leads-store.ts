import { demoLeads } from "@/config/demo-leads";
import type { AdminLead, LeadStatus } from "@/lib/lead-crm";
import { isMongoConfigured } from "@/lib/mongo";

type DemoStore = {
  leads: AdminLead[];
};

function store(): DemoStore {
  const globalStore = globalThis as typeof globalThis & {
    __orlikovDemoLeads?: DemoStore;
  };

  if (!globalStore.__orlikovDemoLeads) {
    globalStore.__orlikovDemoLeads = {
      leads: demoLeads.map((lead) => ({
        ...lead,
        answers: lead.answers.map((answer) => ({ ...answer })),
      })),
    };
  }

  return globalStore.__orlikovDemoLeads;
}

export function isDemoLeadsEnabled() {
  return process.env.NODE_ENV === "development" && !isMongoConfigured();
}

export function listDemoLeads() {
  const leads = [...store().leads].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
  return { leads, total: leads.length, demo: true as const };
}

export function updateDemoLead(
  id: string,
  patch: {
    status?: LeadStatus;
    managerComment?: string;
  },
) {
  const leads = store().leads;
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) return null;

  const next = { ...leads[index] };
  if (patch.status) next.status = patch.status;
  if (patch.managerComment !== undefined) {
    next.managerComment = patch.managerComment.slice(0, 2000);
  }
  leads[index] = next;
  return next;
}
