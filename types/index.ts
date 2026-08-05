export interface SocialLink {
  title: string;
  icon: string;
  link: string;
}

export interface SiteParams {
  phone: { title: string; link: string };
  email: { link: string; title: string };
  social: SocialLink[];
}

export type LeadModalVariant = "viewing" | "request";

export interface MainContextValue {
  params: SiteParams[];
  loadParams: () => void;
  state: { sidebar: boolean };
  setState: (state: { sidebar: boolean }) => void;
  leadModalOpen: boolean;
  leadModalVariant: LeadModalVariant;
  openLeadModal: (variant?: LeadModalVariant) => void;
  closeLeadModal: () => void;
}
