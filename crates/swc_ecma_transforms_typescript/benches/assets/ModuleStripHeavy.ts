import { type T0, type T1, v0, v1, type T2, v2 } from "pkg-a";
import { type U0, u0, type U1, u1, type U2 } from "pkg-b";
import { type V0, type V1, v3, v4 } from "pkg-c";
import { type W0, type W1, type W2, w0 } from "pkg-d";
import { type X0, x0 } from "pkg-e";
import type { OnlyType0, OnlyType1, OnlyType2 } from "pkg-types";

export type PublicShape = T0 | U0 | V0 | W0 | X0 | OnlyType0;

type LocalShape = T1 & U1 & V1 & W1 & OnlyType1;

interface RuntimeShape extends LocalShape {
  name: string;
  count: number;
}

const runtimeValue: RuntimeShape = {
  name: "bench",
  count: v0 + v1 + v2 + u0 + u1 + v3 + v4 + w0 + x0,
};

const values = [v0, v1, v2, u0, u1, v3, v4, w0, x0];

export const kept = values.reduce((sum, value) => sum + value, 0) + runtimeValue.count;

export { v0, v1, u0, u1, v3, v4, w0, x0 };

export type { T2, U2, W2, OnlyType2 };
