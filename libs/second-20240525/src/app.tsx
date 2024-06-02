import { useRef } from 'react';
import { useRenderer } from './useRenderer';

export function Page() {
  const ref = useRef(null);

  useRenderer(ref);

  return <canvas ref={ref} />;
}
