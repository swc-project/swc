interface X__2 {
    outer__0: true;
}
const X__2 = "outer";
type Generic__2 = <T__3 extends typeof X__2 = typeof X__2>(X__3: number) => T__3;
type Forward__2 = (first__4: typeof X__4, X__4: number) => typeof X__4;
type Annotation__2 = (X__5: X__2) => typeof X__5;
type Predicate__2 = (X__6: unknown) => X__6 is X__2;
type Assertion__2 = (X__7: unknown) => asserts X__7 is X__2;
declare function ordinary__2(X__8: number): typeof X__8;
declare function create__2<T__9>(input__9: T__9): T__9;
type Instantiation__2 = typeof create__2<X__2>;
type Shadowed__2 = <X__10 extends typeof X__2 = typeof X__2>(value__10: X__10) => X__10;
