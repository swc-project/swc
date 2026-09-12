type T1 = (a = 1) => void;
type T2 = ({ a = 1 }: { a?: number }) => void;
type T3 = ({ a: b = 1 }: { a?: number }) => void;
interface I {
  (x = 1): void;
  ({ a = 1 }: { a?: number }): void;
  method({ a = 1 }: { a?: number }): void;
}
