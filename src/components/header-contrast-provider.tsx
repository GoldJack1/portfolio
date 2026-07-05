"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { HeaderTone } from "@/lib/header-contrast";

interface HeaderContrastContextValue {
  tone: HeaderTone;
  isMixed: boolean;
  setContrast: (tone: HeaderTone, isMixed: boolean) => void;
}

const HeaderContrastContext = createContext<HeaderContrastContextValue>({
  tone: "on-light",
  isMixed: false,
  setContrast: () => {},
});

export function useHeaderContrast() {
  return useContext(HeaderContrastContext);
}

export default function HeaderContrastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tone, setToneState] = useState<HeaderTone>("on-light");
  const [isMixed, setIsMixedState] = useState(false);

  const setContrast = useCallback((nextTone: HeaderTone, nextMixed: boolean) => {
    setToneState((prev) => (prev === nextTone ? prev : nextTone));
    setIsMixedState((prev) => (prev === nextMixed ? prev : nextMixed));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.headerOn = tone === "on-dark" ? "dark" : "light";
    document.documentElement.dataset.headerMixed = isMixed ? "true" : "false";
  }, [tone, isMixed]);

  const value = useMemo(
    () => ({ tone, isMixed, setContrast }),
    [tone, isMixed, setContrast],
  );

  return (
    <HeaderContrastContext.Provider value={value}>
      {children}
    </HeaderContrastContext.Provider>
  );
}
