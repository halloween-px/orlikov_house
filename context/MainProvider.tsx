"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { siteConfig } from "@/config";
import type { MainContextValue, SiteParams } from "@/types";

const MainContext = createContext<MainContextValue | null>(null);

export function MainProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<SiteParams[]>([siteConfig.contacts]);
  const [state, setState] = useState({ sidebar: false });

  const loadParams = useCallback(() => {
    setParams([siteConfig.contacts]);
  }, []);

  return (
    <MainContext.Provider value={{ params, loadParams, state, setState }}>
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
