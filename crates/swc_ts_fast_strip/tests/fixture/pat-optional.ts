

export function typeAnn({ a, b, c }: { a: number; b: number; c?: number }) {
    console.log(a, b, c);
}

export function optional(a?: string) {
    console.log(a, b, c);
}