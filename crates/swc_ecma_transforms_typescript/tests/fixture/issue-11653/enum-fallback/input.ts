const runtime = Math.random() > 0.5 ? 10 : 20;

enum Other {
  Base = 5,
}

enum Value {
  A = 1,
  B = A + 2,
  C = B * 3,
  D = `${C}`,
  E = C + runtime,
  F = Other.Base + B,
  G = E + F,
}

console.log(Value.A, Value.B, Value.C, Value.D, Value.E, Value.F, Value.G);
