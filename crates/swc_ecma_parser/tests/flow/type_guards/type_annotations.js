type T1 = (x: mixed) => x is number;
type T2 = (x: mixed) => number => x is number => number;
type O1 = {
  (x: mixed): x is number;
  (x: mixed): x is number => number;
  m1(x: mixed): x is number;
  m2(x: mixed): x is number => number;
  m2(x: mixed): number => x is number => number;
  f1: (x: mixed) => x is number;
  f2: (x: mixed) => x is number => number;
  f2: (x: mixed) => number => x is number => number;
};
type T3 = (x: mixed) => implies x is number;
