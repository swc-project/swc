import { useState } from "react";

export function useCounter() {
    const [value, setValue] = useState(0);
    const increment = async () => {
        const next = await Promise.resolve(value + 1);
        setValue(next);
        return next;
    };

    return { value, increment };
}

export function App() {
    const { value, increment } = useCounter();

    return <button onClick={increment}>Count: {value}</button>;
}
