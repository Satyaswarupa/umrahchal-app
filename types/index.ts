export type AgentDocument = {
  url: string;
  publicId: string;
  name?: string;
};

export type AgentSummary = {
  id: string;
  companyName: string;
  mobileNumber: string;
  whatsappNumber: string;
  country: string;
  state: string;
  city: string;
  description: string;
  services: string[];
  profileImage: AgentDocument | null;
};

export type AgentDetail = AgentSummary & {
  ownerName: string;
  address: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'AGENT' | 'ADMIN' | 'SUPERADMIN';
  createdAt: string;
};
