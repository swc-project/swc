export {};

function fn1({ x, y }: { x: string; y: string }): string {
    return x + y;
}

function fn2({ x, y }: { x: string; y: string }): string {
    const fn3: ({ x, y }: { x: string; y: string }) => string = fn1;
    return fn3({ x, y });
}
