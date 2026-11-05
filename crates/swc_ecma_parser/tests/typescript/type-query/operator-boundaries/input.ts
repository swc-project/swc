export {};

value as typeof f << other;
value satisfies typeof f << other;
value satisfies keyof typeof f << other;
value satisfies () => typeof f << other;
value satisfies T | typeof f << other;
value as typeof f<U> << other;
value as typeof f << <T>other;
value as typeof import("m").T<U> < other;
value satisfies typeof import("m").T<U> << other;
value as typeof import("m").T<U> << other;
value as typeof f< <T>() => T> < other;
value as typeof f
< other;

type Query = typeof f< <T>() => T>;
type ImportQuery = typeof import("m").T<<T>() => T>;

value as typeof f << other > (one, two, three);
value satisfies typeof f << other > (one, two, three);
value as typeof f
<< other;
type Reference = Box<<T>() => T>;
