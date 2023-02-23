// @strict: true

// infer twice with different constraints (same behavior as class/interface)
type X1<T> =
    T extends { a: infer U extends string, b: infer U extends number } ? U :
    never;

// infer cannot reference type params in same 'extends' clause
type X2<T> =
    T extends { a: infer U, b: infer V extends U } ? [U, V] :
    never;