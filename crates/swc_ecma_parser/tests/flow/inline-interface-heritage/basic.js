type A = interface { p: string };
type B = interface extends A { q: number };
type C = interface extends A, Base<string>, NS.Inner<T, U> { r: boolean };
type D = interface extends A {}[];
type G = interface extends A { k: string }["k"];
type H = keyof interface extends A { k: string };
type X = interface extends Base<<T>() => T> {};
interface E extends A { q: number }
type Cond<T> = T extends string ? 1 : 2;
function f(o: interface extends A { q: number }): number {
  return o.q;
}
