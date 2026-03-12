const runtime = Math.random() > 0.5 ? 1 : 2;

enum OtherEnum {
  Start = 100,
  End = Start + 1,
}

enum PerfEnum {
  A0 = 0,
  A1 = A0 + 1,
  A2 = A1 + 1,
  A3 = A2 + 1,
  A4 = A3 + 1,
  A5 = A4 + 1,
  A6 = A5 + 1,
  A7 = A6 + 1,
  A8 = A7 + 1,
  A9 = A8 + 1,
  A10 = A9 + 1,
  A11 = A10 + 1,
  A12 = A11 + 1,
  A13 = A12 + 1,
  A14 = A13 + 1,
  A15 = A14 + 1,
  A16 = A15 + 1,
  A17 = A16 + 1,
  A18 = A17 + 1,
  A19 = A18 + 1,
  A20 = A19 + 1,
  A21 = A20 + 1,
  A22 = A21 + 1,
  A23 = A22 + 1,
  A24 = A23 + 1,
  A25 = A24 + 1,
  A26 = A25 + 1,
  A27 = A26 + 1,
  A28 = A27 + 1,
  A29 = A28 + 1,
  A30 = A29 + 1,
  B0 = A30 * 2,
  B1 = B0 | A8,
  B2 = B1 & 63,
  B3 = B2 ^ 7,
  B4 = B3 << 1,
  B5 = B4 >> 1,
  B6 = B5 >>> 1,
  T0 = `perf-${A30}`,
  T1 = `${T0}-tail`,
  R0 = A30 + runtime,
  R1 = R0 + 1,
  O0 = OtherEnum.Start,
  O1 = O0 + 2,
}

export const sink =
  PerfEnum.A30 +
  PerfEnum.B6 +
  PerfEnum.O1 +
  OtherEnum.End +
  runtime;
