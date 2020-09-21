declare function zip<A, B>(a: A, b: B): [A, B];

declare function flip<X, Y, Z>(f: (x: X, y: Y) => Z): (y: Y, x: X) => Z;

const f40: <A, B>(b: B, a: A) => [A, B] = flip(zip);

