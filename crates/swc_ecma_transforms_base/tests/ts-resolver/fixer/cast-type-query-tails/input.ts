export {};

(value satisfies typeof f) << other;
(value as typeof import("m").T<U>) < other;
(value satisfies typeof import("m").T<U>) << other;
(value satisfies keyof typeof f) << other;
(value satisfies () => typeof f) << other;
(value satisfies T | typeof f) << other;
(value as typeof f) << other;
