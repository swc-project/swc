// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/prompt.ts


// deno-lint-ignore-file

import { tty } from "../ansi/tty.ts";
import {
  GenericPrompt,
  GenericPromptOptions,
  StaticGenericPrompt,
} from "./_generic_prompt.ts";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type AwaitedReturnType<T extends (...args: any[]) => any> = Awaited<
  ReturnType<T>
>;

type Next<N extends keyof any> = (
  next?: N | number | true | null,
) => Promise<void>;

type PromptOptions<
  N0 extends string,
  G0 extends StaticGenericPrompt<any, any, any, any, any>,
  R extends PromptResult<N0, G0>,
  U = Parameters<G0["prompt"]>[0],
> =
  & {
    name: N0;
    type: G0;
    before?: (
      opts: R,
      next: Next<Exclude<keyof R, symbol>>,
    ) => void | Promise<void>;
    after?: (
      opts: R,
      next: Next<Exclude<keyof R, symbol>>,
    ) => void | Promise<void>;
  }
  // exclude none options parameter
  & (U extends GenericPromptOptions<any, any> ? U : {});

type PromptResult<
  N0 extends string,
  G0 extends StaticGenericPrompt<any, any, any, any, any>,
> = {
  [K in N0]?: AwaitedReturnType<G0["prompt"]>;
};

interface PromptListOptions<R, N extends keyof R = keyof R> {
  cbreak?: boolean;
  before?: (
    name: N,
    opts: R,
    next: Next<Exclude<N, symbol>>,
  ) => void | Promise<void>;
  after?: (
    name: N,
    opts: R,
    next: Next<Exclude<N, symbol>>,
  ) => void | Promise<void>;
}

/** Global prompt options. */
export interface GlobalPromptOptions<R, N extends keyof R = keyof R>
  extends PromptListOptions<R, N> {
  initial?: N extends symbol ? never : N;
}

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  N19 extends string,
  O19 extends GenericPromptOptions<any, any>,
  P19 extends GenericPrompt<any, any, any>,
  G19 extends StaticGenericPrompt<any, any, O19, any, P19>,
  N20 extends string,
  O20 extends GenericPromptOptions<any, any>,
  P20 extends GenericPrompt<any, any, any>,
  G20 extends StaticGenericPrompt<any, any, O20, any, P20>,
  N21 extends string,
  O21 extends GenericPromptOptions<any, any>,
  P21 extends GenericPrompt<any, any, any>,
  G21 extends StaticGenericPrompt<any, any, O21, any, P21>,
  N22 extends string,
  O22 extends GenericPromptOptions<any, any>,
  P22 extends GenericPrompt<any, any, any>,
  G22 extends StaticGenericPrompt<any, any, O22, any, P22>,
  N23 extends string,
  O23 extends GenericPromptOptions<any, any>,
  P23 extends GenericPrompt<any, any, any>,
  G23 extends StaticGenericPrompt<any, any, O23, any, P23>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>
    & PromptResult<N19, G19>
    & PromptResult<N20, G20>
    & PromptResult<N21, G21>
    & PromptResult<N22, G22>
    & PromptResult<N23, G23>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
  PromptOptions<N19, G19, R>,
  PromptOptions<N20, G20, R>,
  PromptOptions<N21, G21, R>,
  PromptOptions<N22, G22, R>,
  PromptOptions<N23, G23, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  N19 extends string,
  O19 extends GenericPromptOptions<any, any>,
  P19 extends GenericPrompt<any, any, any>,
  G19 extends StaticGenericPrompt<any, any, O19, any, P19>,
  N20 extends string,
  O20 extends GenericPromptOptions<any, any>,
  P20 extends GenericPrompt<any, any, any>,
  G20 extends StaticGenericPrompt<any, any, O20, any, P20>,
  N21 extends string,
  O21 extends GenericPromptOptions<any, any>,
  P21 extends GenericPrompt<any, any, any>,
  G21 extends StaticGenericPrompt<any, any, O21, any, P21>,
  N22 extends string,
  O22 extends GenericPromptOptions<any, any>,
  P22 extends GenericPrompt<any, any, any>,
  G22 extends StaticGenericPrompt<any, any, O22, any, P22>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>
    & PromptResult<N19, G19>
    & PromptResult<N20, G20>
    & PromptResult<N21, G21>
    & PromptResult<N22, G22>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
  PromptOptions<N19, G19, R>,
  PromptOptions<N20, G20, R>,
  PromptOptions<N21, G21, R>,
  PromptOptions<N22, G22, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  N19 extends string,
  O19 extends GenericPromptOptions<any, any>,
  P19 extends GenericPrompt<any, any, any>,
  G19 extends StaticGenericPrompt<any, any, O19, any, P19>,
  N20 extends string,
  O20 extends GenericPromptOptions<any, any>,
  P20 extends GenericPrompt<any, any, any>,
  G20 extends StaticGenericPrompt<any, any, O20, any, P20>,
  N21 extends string,
  O21 extends GenericPromptOptions<any, any>,
  P21 extends GenericPrompt<any, any, any>,
  G21 extends StaticGenericPrompt<any, any, O21, any, P21>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>
    & PromptResult<N19, G19>
    & PromptResult<N20, G20>
    & PromptResult<N21, G21>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
  PromptOptions<N19, G19, R>,
  PromptOptions<N20, G20, R>,
  PromptOptions<N21, G21, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  N19 extends string,
  O19 extends GenericPromptOptions<any, any>,
  P19 extends GenericPrompt<any, any, any>,
  G19 extends StaticGenericPrompt<any, any, O19, any, P19>,
  N20 extends string,
  O20 extends GenericPromptOptions<any, any>,
  P20 extends GenericPrompt<any, any, any>,
  G20 extends StaticGenericPrompt<any, any, O20, any, P20>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>
    & PromptResult<N19, G19>
    & PromptResult<N20, G20>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
  PromptOptions<N19, G19, R>,
  PromptOptions<N20, G20, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  N19 extends string,
  O19 extends GenericPromptOptions<any, any>,
  P19 extends GenericPrompt<any, any, any>,
  G19 extends StaticGenericPrompt<any, any, O19, any, P19>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>
    & PromptResult<N19, G19>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
  PromptOptions<N19, G19, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  N18 extends string,
  O18 extends GenericPromptOptions<any, any>,
  P18 extends GenericPrompt<any, any, any>,
  G18 extends StaticGenericPrompt<any, any, O18, any, P18>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>
    & PromptResult<N18, G18>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
  PromptOptions<N18, G18, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  N17 extends string,
  O17 extends GenericPromptOptions<any, any>,
  P17 extends GenericPrompt<any, any, any>,
  G17 extends StaticGenericPrompt<any, any, O17, any, P17>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>
    & PromptResult<N17, G17>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
  PromptOptions<N17, G17, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  N16 extends string,
  O16 extends GenericPromptOptions<any, any>,
  P16 extends GenericPrompt<any, any, any>,
  G16 extends StaticGenericPrompt<any, any, O16, any, P16>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>
    & PromptResult<N16, G16>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
  PromptOptions<N16, G16, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  N15 extends string,
  O15 extends GenericPromptOptions<any, any>,
  P15 extends GenericPrompt<any, any, any>,
  G15 extends StaticGenericPrompt<any, any, O15, any, P15>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>
    & PromptResult<N15, G15>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
  PromptOptions<N15, G15, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  N14 extends string,
  O14 extends GenericPromptOptions<any, any>,
  P14 extends GenericPrompt<any, any, any>,
  G14 extends StaticGenericPrompt<any, any, O14, any, P14>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>
    & PromptResult<N14, G14>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
  PromptOptions<N14, G14, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  N13 extends string,
  O13 extends GenericPromptOptions<any, any>,
  P13 extends GenericPrompt<any, any, any>,
  G13 extends StaticGenericPrompt<any, any, O13, any, P13>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>
    & PromptResult<N13, G13>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
  PromptOptions<N13, G13, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  N12 extends string,
  O12 extends GenericPromptOptions<any, any>,
  P12 extends GenericPrompt<any, any, any>,
  G12 extends StaticGenericPrompt<any, any, O12, any, P12>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>
    & PromptResult<N12, G12>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
  PromptOptions<N12, G12, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  N11 extends string,
  O11 extends GenericPromptOptions<any, any>,
  P11 extends GenericPrompt<any, any, any>,
  G11 extends StaticGenericPrompt<any, any, O11, any, P11>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>
    & PromptResult<N11, G11>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
  PromptOptions<N11, G11, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  N10 extends string,
  O10 extends GenericPromptOptions<any, any>,
  P10 extends GenericPrompt<any, any, any>,
  G10 extends StaticGenericPrompt<any, any, O10, any, P10>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>
    & PromptResult<N10, G10>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
  PromptOptions<N10, G10, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  N9 extends string,
  O9 extends GenericPromptOptions<any, any>,
  P9 extends GenericPrompt<any, any, any>,
  G9 extends StaticGenericPrompt<any, any, O9, any, P9>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>
    & PromptResult<N9, G9>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
  PromptOptions<N9, G9, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  N8 extends string,
  O8 extends GenericPromptOptions<any, any>,
  P8 extends GenericPrompt<any, any, any>,
  G8 extends StaticGenericPrompt<any, any, O8, any, P8>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>
    & PromptResult<N8, G8>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
  PromptOptions<N8, G8, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  N7 extends string,
  O7 extends GenericPromptOptions<any, any>,
  P7 extends GenericPrompt<any, any, any>,
  G7 extends StaticGenericPrompt<any, any, O7, any, P7>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>
    & PromptResult<N7, G7>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
  PromptOptions<N7, G7, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  N6 extends string,
  O6 extends GenericPromptOptions<any, any>,
  P6 extends GenericPrompt<any, any, any>,
  G6 extends StaticGenericPrompt<any, any, O6, any, P6>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>
    & PromptResult<N6, G6>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
  PromptOptions<N6, G6, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  N5 extends string,
  O5 extends GenericPromptOptions<any, any>,
  P5 extends GenericPrompt<any, any, any>,
  G5 extends StaticGenericPrompt<any, any, O5, any, P5>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>
    & PromptResult<N5, G5>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
  PromptOptions<N5, G5, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  N4 extends string,
  O4 extends GenericPromptOptions<any, any>,
  P4 extends GenericPrompt<any, any, any>,
  G4 extends StaticGenericPrompt<any, any, O4, any, P4>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>
    & PromptResult<N4, G4>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
  PromptOptions<N4, G4, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  N3 extends string,
  O3 extends GenericPromptOptions<any, any>,
  P3 extends GenericPrompt<any, any, any>,
  G3 extends StaticGenericPrompt<any, any, O3, any, P3>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>
    & PromptResult<N3, G3>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
  PromptOptions<N3, G3, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  N2 extends string,
  O2 extends GenericPromptOptions<any, any>,
  P2 extends GenericPrompt<any, any, any>,
  G2 extends StaticGenericPrompt<any, any, O2, any, P2>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>
    & PromptResult<N2, G2>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
  PromptOptions<N2, G2, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  N1 extends string,
  O1 extends GenericPromptOptions<any, any>,
  P1 extends GenericPrompt<any, any, any>,
  G1 extends StaticGenericPrompt<any, any, O1, any, P1>,
  R =
    & PromptResult<N0, G0>
    & PromptResult<N1, G1>,
>(prompts: [
  PromptOptions<N0, G0, R>,
  PromptOptions<N1, G1, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

export function prompt<
  N0 extends string,
  O0 extends GenericPromptOptions<any, any>,
  P0 extends GenericPrompt<any, any, any>,
  G0 extends StaticGenericPrompt<any, any, O0, any, P0>,
  R = PromptResult<N0, G0>,
>(prompts: [
  PromptOptions<N0, G0, R>,
], options?: GlobalPromptOptions<R>): Promise<R>;

/**
 * Run a list of prompts.
 * @param prompts Array of prompt options.
 * @param options Global prompt options.
 */
export function prompt(
  prompts: PromptOptions<string, any, any>[],
  options?: GlobalPromptOptions<any>,
) {
  return new PromptList(prompts, options).run(options?.initial);
}

let injected: Record<string, any> = {};

/**
 * Inject prompt values. Can be used for unit tests or pre selections.
 * @param values Input values object.
 */
export function inject(values: Record<string, any>): void {
  injected = values;
}

class PromptList {
  private result: Record<string, any> = {};
  private index: number = -1;
  private names: string[] = this.prompts.map((prompt) => prompt.name);
  private isInBeforeHook = false;

  private get prompt(): PromptOptions<string, any, any> {
    return this.prompts[this.index];
  }

  public constructor(
    private prompts: PromptOptions<string, any, any>[],
    private options?: PromptListOptions<any>,
  ) {}

  public async run(
    name?: string | number | true,
  ): Promise<Record<string, any>> {
    this.index = -1;
    this.result = {};
    this.isInBeforeHook = false;
    await this.next(name);
    return this.result;
  }

  private async next(name?: string | number | true | null): Promise<void> {
    if (this.updateIndex(name)) {
      await this.runBeforeHook(async () => {
        this.isInBeforeHook = false;
        await this.runPrompt();
        await this.runAfterHook();
      });
    }
  }

  private updateIndex(name?: string | number | true | null): boolean {
    if (name && typeof name === "string") {
      this.index = this.names.indexOf(name);
      if (this.index === -1) {
        throw new Error(
          `Invalid prompt name: ${name}, allowed prompt names: ${
            this.names.join(", ")
          }`,
        );
      }
    } else if (typeof name === "number") {
      if (name < 0 || name > this.names.length) {
        throw new Error(
          `Invalid prompt index: ${name}, prompt length: ${this.names.length}`,
        );
      }
      this.index = name;
    } else if (name === true && !this.isInBeforeHook) {
      this.index++;
      if (this.index < this.names.length - 1) {
        this.index++;
      }
    } else {
      this.index++;
    }

    this.isInBeforeHook = false;

    if (this.index < this.names.length) {
      return true;
    } else if (this.index === this.names.length) {
      return false;
    } else {
      throw new Error("next() called multiple times");
    }
  }

  private async runBeforeHook(run: () => Promise<void>): Promise<void> {
    this.isInBeforeHook = true;

    const next = async (name?: string | number | true | null) => {
      if (name || typeof name === "number") {
        return this.next(name as (string | number | true));
      }
      await run();
    };

    if (this.options?.before) {
      await this.options.before(
        this.prompt.name,
        this.result,
        async (name?: string | number | true | null) => {
          if (name || typeof name === "number") {
            return this.next(name as (string | number | true));
          } else if (this.prompt.before) {
            await this.prompt.before(this.result, next);
          } else {
            await run();
          }
        },
      );

      return;
    } else if (this.prompt.before) {
      await this.prompt.before(this.result, next);

      return;
    }

    await run();
  }

  private async runPrompt(): Promise<void> {
    const prompt: StaticGenericPrompt<any, any, any, any, any> =
      this.prompt.type;

    if (typeof injected[this.prompt.name] !== "undefined") {
      if (prompt.inject) {
        prompt.inject(injected[this.prompt.name]);
      } else {
        GenericPrompt.inject(injected[this.prompt.name]);
      }
    }

    try {
      this.result[this.prompt.name] = await prompt.prompt({
        cbreak: this.options?.cbreak,
        ...this.prompt,
      });
    } finally {
      tty.cursorShow();
    }
  }

  private async runAfterHook(): Promise<void> {
    if (this.options?.after) {
      await this.options.after(this.prompt.name, this.result, async (name) => {
        if (name) {
          return this.next(name as string);
        } else if (this.prompt.after) {
          await this.prompt.after(this.result, (name) => this.next(name));
        } else {
          await this.next();
        }
      });
    } else if (this.prompt.after) {
      await this.prompt.after(this.result, (name) => this.next(name));
    } else {
      await this.next();
    }
  }
}
