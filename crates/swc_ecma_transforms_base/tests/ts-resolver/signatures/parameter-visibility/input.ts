interface X { outer: true; }
const X = "outer";
type Generic = <T extends typeof X = typeof X>(X: number) => T;
type Forward = (first: typeof X, X: number) => typeof X;
type Annotation = (X: X) => typeof X;
type Predicate = (X: unknown) => X is X;
type Assertion = (X: unknown) => asserts X is X;
declare function ordinary(X: number): typeof X;
declare function create<T>(input: T): T;
type Instantiation = typeof create<X>;
type Shadowed = <X extends typeof X = typeof X>(value: X) => X;
