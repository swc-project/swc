function f70(func: <T, U>(k1: keyof (T | U), k2: keyof (T & U)) => void) {
    const r1 = func<{ a: any, b: any }, { a: any, c: any }>('a', 'a');
    const r2 = func<{ a: any, b: any }, { a: any, c: any }>('a', 'b');
    const r3 = func<{ a: any, b: any }, { a: any, c: any }>('a', 'c');

    return { r1, r2, r3 }
}
