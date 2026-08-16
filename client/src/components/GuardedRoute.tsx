import { ReactNode, useEffect, useState } from 'react';
import { isPageEnabled, loadPageControlsFromSupabase, type PageKey } from '@/lib/page-controls';
import PageLocked from './PageLocked';

interface GuardedRouteProps {
  pageKey: PageKey;
  pageName: string;
  children: ReactNode;
}

export default function GuardedRoute({ pageKey, pageName, children }: GuardedRouteProps) {
  const [enabled, setEnabled] = useState(() => isPageEnabled(pageKey));

  useEffect(() => {
    // Pull the latest page controls from the database so page locks set by
    // the admin on another device take effect everywhere.
    loadPageControlsFromSupabase().then(() => setEnabled(isPageEnabled(pageKey)));

    const sync = () => setEnabled(isPageEnabled(pageKey));
    window.addEventListener('happi-nuts-page-controls-updated', sync);
    return () => window.removeEventListener('happi-nuts-page-controls-updated', sync);
  }, [pageKey]);

  if (!enabled) {
    return <PageLocked pageName={pageName} />;
  }

  return <>{children}</>;
}