import { useEffect, useState } from 'react';

export function Counter({ step }: { step: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((c) => c + step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
