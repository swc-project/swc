export {};

(value satisfies typeof f) << other;
(value as typeof import("m").T<U>) < other;
(value satisfies typeof import("m").T<U>) << other;
(value satisfies keyof typeof f) << other;
(value satisfies () => typeof f) << other;
(value satisfies T | typeof f) << other;
(value as typeof f) << other;

((one || two) as typeof f) << other;
((one && two) satisfies typeof f) << other;
((one == two) as typeof f) << other;
((one || two) as typeof import("m").f) << other;
(one < two as typeof f) << other;

(((one || two) as T) as typeof f) << other;
(((one < two) satisfies number) satisfies typeof f) << other;
((one ? two : three) as typeof f) << other;
((one = two) satisfies typeof f) << other;
((one, two) as typeof f) << other;
((value => value) as typeof f) << other;
((() => value) satisfies typeof f) << other;

function* g() {
    ((yield value) as typeof f) << other;
    ((yield* values) satisfies typeof f) << other;
    ((yield) as typeof f) << other;
}
