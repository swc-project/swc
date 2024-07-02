interface I {
  m1(x: mixed): x is number;
  m2(): this is D;
}

type T = interface {
  m1(x: mixed): x is number;
  m2(): this is D;
};
