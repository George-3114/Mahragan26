import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getServices, initApplication, type AppServices } from '../application';

const FestivalContext = createContext<AppServices | null>(null);

export function FestivalProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => initApplication(), []);
  return (
    <FestivalContext.Provider value={services}>{children}</FestivalContext.Provider>
  );
}

export function useServices(): AppServices {
  const services = useContext(FestivalContext);
  if (!services) {
    return getServices();
  }
  return services;
}

/** Re-run async loaders when application data changes. */
export function useDataVersion(): number {
  const { context } = useServices();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    return context.subscribe(() => setVersion((v) => v + 1));
  }, [context]);

  return version;
}
