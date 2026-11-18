type T = hook () => void;
type T = hook (number) => void;
type T = hook (number, string) => void;
type T = hook <T, S: T = T> () => [T, S];
