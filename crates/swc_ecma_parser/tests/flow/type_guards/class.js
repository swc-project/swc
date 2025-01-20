class C {
  m1(x: mixed): x is number { return true; }
  m2(): this is D { return true; }
}

declare class D {
  m1(x: mixed): x is number;
  m2(): this is D;
}
