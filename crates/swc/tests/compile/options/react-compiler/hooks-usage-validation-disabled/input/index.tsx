import { useState } from 'react';

// Calls a hook conditionally and carries no ESLint suppression comment, so only
// the hooks-usage validation can make the compiler skip it.
export function Toggle({ enabled }: { enabled: boolean }) {
  if (enabled) {
    const [on, setOn] = useState(false);
    return <button onClick={() => setOn(!on)}>{String(on)}</button>;
  }
  return null;
}
