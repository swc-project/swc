const value = "outer";

function usesParameter(this: typeof value, value: number): void {}
