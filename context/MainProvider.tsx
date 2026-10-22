"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { siteConfig } from "@/config";
import type {
  LeadLot,
  LeadModalVariant,
  MainContextValue,
  SiteParams,
} from "@/types";

const MainContext = createContext<MainContextValue | null>(null);

export function MainProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<SiteParams[]>([siteConfig.contacts]);
  const [state, setState] = useState({ sidebar: false });
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalVariant, setLeadModalVariant] =
    useState<LeadModalVariant>("viewing");
  const [leadLot, setLeadLot] = useState<LeadLot | null>(null);

  const loadParams = useCallback(() => {
    setParams([siteConfig.contacts]);
  }, []);

  const openLeadModal = useCallback(
    (variant: LeadModalVariant = "viewing", lot: LeadLot | null = null) => {
      setLeadModalVariant(variant);
      setLeadLot(lot);
      setLeadModalOpen(true);
    },
    [],
  );

  const closeLeadModal = useCallback(() => {
    setLeadModalOpen(false);
  }, []);

  return (
    <MainContext.Provider
      value={{
        params,
        loadParams,
        state,
        setState,
        leadModalOpen,
        leadModalVariant,
        leadLot,
        openLeadModal,
        closeLeadModal,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function useMainContext() {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within MainProvider");
  }
  return context;
}
