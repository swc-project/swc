import { useState } from "react";

export function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}
