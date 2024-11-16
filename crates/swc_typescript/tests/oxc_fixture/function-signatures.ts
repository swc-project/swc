// All of these are valid function signatures under isolatedDeclarations
export function A(): void {
    return;
}

export function B(): (() => void) | undefined {
    return () => {};
}

// There should be no declaration for the implementation signature, just the
// two overloads.
export function C(x: string): void
export function C(x: number): void
export function C(x: string | number): void {
    return;
}

// private, not emitted
function D(a, b): void {
    return;
}
function E(a: number, b: string) {
    return `${a} ${b}`;
}
