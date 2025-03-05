//// [variadicTuples1.ts]
//!   x cannot reassign to a variable declared with `const`
//!      ,-[46:1]
//!   43 | 
//!   44 | // Spread arguments
//!   45 | 
//!   46 | declare function foo1(a: number, b: string, c: boolean, ...d: number[]): void;
//!      :                       |
//!      :                       `-- cannot reassign
//!   47 | 
//!   48 | function foo2(t1: [number, string], t2: [boolean], a1: number[]) {
//!   49 |     foo1(1, 'abc', true, 42, 43, 44);
//!   50 |     foo1(...t1, true, 42, 43, 44);
//!   51 |     foo1(...t1, ...t2, 42, 43, 44);
//!   52 |     foo1(...t1, ...t2, ...a1);
//!   53 |     foo1(...t1);  // Error
//!   54 |     foo1(...t1, 45);  // Error
//!   55 | }
//!   56 | 
//!   57 | declare function foo3<T extends unknown[]>(x: number, ...args: [...T, number]): T;
//!   58 | 
//!   59 | function foo4<U extends unknown[]>(u: U) {
//!   60 |     foo3(1, 2);
//!   61 |     foo3(1, 'hello', true, 2);
//!   62 |     foo3(1, ...u, 'hi', 2);
//!   63 |     foo3(1);
//!   64 | }
//!   65 | 
//!   66 | // Contextual typing of array literals
//!   67 | 
//!   68 | declare function ft1<T extends unknown[]>(t: T): T;
//!   69 | declare function ft2<T extends unknown[]>(t: T): readonly [...T];
//!   70 | declare function ft3<T extends unknown[]>(t: [...T]): T;
//!   71 | declare function ft4<T extends unknown[]>(t: [...T]): readonly [...T];
//!   72 | 
//!   73 | ft1(['hello', 42]);  // (string | number)[]
//!   74 | ft2(['hello', 42]);  // readonly (string | number)[]
//!   75 | ft3(['hello', 42]);  // [string, number]
//!   76 | ft4(['hello', 42]);  // readonly [string, number]
//!   77 | 
//!   78 | // Indexing variadic tuple types
//!   79 | 
//!   80 | function f0<T extends unknown[]>(t: [string, ...T], n: number) {
//!   81 |     const a = t[0];  // string
//!   82 |     const b = t[1];  // [string, ...T][1]
//!   83 |     const c = t[2];  // [string, ...T][2]
//!   84 |     const d = t[n];  // [string, ...T][number]
//!   85 | }
//!   86 | 
//!   87 | function f1<T extends unknown[]>(t: [string, ...T, number], n: number) {
//!   88 |     const a = t[0];  // string
//!   89 |     const b = t[1];  // number | T[number]
//!   90 |     const c = t[2];  // [string, ...T, number][2]
//!   91 |     const d = t[n];  // [string, ...T, number][number]
//!   92 | }
//!   93 | 
//!   94 | // Destructuring variadic tuple types
//!   95 | 
//!   96 | function f2<T extends unknown[]>(t: [string, ...T]) {
//!   97 |     let [...ax] = t;  // [string, ...T]
//!   98 |     let [b1, ...bx] = t;  // string, [...T]
//!   99 |     let [c1, c2, ...cx] = t;  // string, [string, ...T][1], T[number][]
//!  100 | }
//!  101 | 
//!  102 | function f3<T extends unknown[]>(t: [string, ...T, number]) {
//!  103 |     let [...ax] = t;  // [string, ...T, number]
//!  104 |     let [b1, ...bx] = t;  // string, [...T, number]
//!  105 |     let [c1, c2, ...cx] = t;  // string, number | T[number], (number | T[number])[]
//!  106 | }
//!  107 | 
//!  108 | // Mapped types applied to variadic tuple types
//!  109 | 
//!  110 | type Arrayify<T> = { [P in keyof T]: T[P][] };
//!  111 | 
//!  112 | type TM1<U extends unknown[]> = Arrayify<readonly [string, number?, ...U, ...boolean[]]>;  // [string[], (number | undefined)[]?, Arrayify<U>, ...boolean[][]]
//!  113 | 
//!  114 | type TP1<T extends unknown[]> = Partial<[string, ...T, number]>;  // [string?, Partial<T>, number?]
//!  115 | type TP2<T extends unknown[]> = Partial<[string, ...T, ...number[]]>;  // [string?, Partial<T>, ...(number | undefined)[]]
//!  116 | 
//!  117 | // Reverse mapping through mapped type applied to variadic tuple type
//!  118 | 
//!  119 | declare function fm1<T extends unknown[]>(t: Arrayify<[string, number, ...T]>): T;
//!  120 | 
//!  121 | let tm1 = fm1([['abc'], [42], [true], ['def']]);  // [boolean, string]
//!  122 | 
//!  123 | // Spread of readonly array-like infers mutable array-like
//!  124 | 
//!  125 | declare function fx1<T extends unknown[]>(a: string, ...args: T): T;
//!  126 | 
//!  127 | function gx1<U extends unknown[], V extends readonly unknown[]>(u: U, v: V) {
//!  128 |     fx1('abc');  // []
//!  129 |     fx1('abc', ...u);  // U
//!  130 |     fx1('abc', ...v);  // [...V]
//!  131 |     fx1<U>('abc', ...u);  // U
//!  132 |     fx1<V>('abc', ...v);  // Error
//!  133 | }
//!  134 | 
//!  135 | declare function fx2<T extends readonly unknown[]>(a: string, ...args: T): T;
//!  136 | 
//!  137 | function gx2<U extends unknown[], V extends readonly unknown[]>(u: U, v: V) {
//!  138 |     fx2('abc');  // []
//!  139 |     fx2('abc', ...u);  // U
//!  140 |     fx2('abc', ...v);  // [...V]
//!  141 |     fx2<U>('abc', ...u);  // U
//!  142 |     fx2<V>('abc', ...v);  // V
//!  143 | }
//!  144 | 
//!  145 | // Relations involving variadic tuple types
//!  146 | 
//!  147 | function f10<T extends string[], U extends T>(x: [string, ...unknown[]], y: [string, ...T], z: [string, ...U]) {
//!  148 |     x = y;
//!  149 |     x = z;
//!  150 |     y = x;  // Error
//!  151 |     y = z;
//!  152 |     z = x;  // Error
//!  153 |     z = y;  // Error
//!  154 | }
//!  155 | 
//!  156 | // For a generic type T, [...T] is assignable to T, T is assignable to readonly [...T], and T is assignable
//!  157 | // to [...T] when T is constrained to a mutable array or tuple type.
//!  158 | 
//!  159 | function f11<T extends unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  160 |     t = m;
//!  161 |     t = r;  // Error
//!  162 |     m = t;
//!  163 |     m = r;  // Error
//!  164 |     r = t;
//!  165 |     r = m;
//!  166 | }
//!  167 | 
//!  168 | function f12<T extends readonly unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  169 |     t = m;
//!  170 |     t = r;  // Error
//!  171 |     m = t;  // Error
//!  172 |     m = r;  // Error
//!  173 |     r = t;
//!  174 |     r = m;
//!  175 | }
//!  176 | 
//!  177 | function f13<T extends string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  178 |     t0 = t1;
//!  179 |     t0 = t2;
//!  180 |     t1 = t0;
//!  181 |     t1 = t2;
//!  182 |     t2 = t0;  // Error
//!  183 |     t2 = t1;  // Error
//!  184 | }
//!  185 | 
//!  186 | function f14<T extends readonly string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  187 |     t0 = t1;
//!  188 |     t0 = t2;
//!  189 |     t1 = t0;  // Error
//!  190 |     t1 = t2;
//!  191 |     t2 = t0;  // Error
//!  192 |     t2 = t1;  // Error
//!  193 | }
//!  194 | 
//!  195 | function f15<T extends string[], U extends T>(k0: keyof T, k1: keyof [...T], k2: keyof [...U], k3: keyof [1, 2, ...T]) {
//!  196 |     k0 = 'length';
//!  197 |     k1 = 'length';
//!  198 |     k2 = 'length';
//!  199 |     k0 = 'slice';
//!  200 |     k1 = 'slice';
//!  201 |     k2 = 'slice';
//!  202 |     k3 = '0';
//!  203 |     k3 = '1';
//!  204 |     k3 = '2';  // Error
//!  205 | }
//!  206 | 
//!  207 | // Constraints of variadic tuple types
//!  208 | 
//!  209 | function ft16<T extends [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  210 |     x = y;
//!  211 | }
//!  212 | 
//!  213 | function ft17<T extends [] | [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  214 |     x = y;
//!  215 | }
//!  216 | 
//!  217 | function ft18<T extends unknown[]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  218 |     x = y;
//!  219 | }
//!  220 | 
//!  221 | // Inference between variadic tuple types
//!  222 | 
//!  223 | type First<T extends readonly unknown[]> =
//!  224 |     T extends readonly [unknown, ...unknown[]] ? T[0] :
//!  225 |     T[0] | undefined;
//!  226 | 
//!  227 | type DropFirst<T extends readonly unknown[]> = T extends readonly [unknown?, ...infer U] ? U : [...T];
//!  228 | 
//!  229 | type Last<T extends readonly unknown[]> =
//!  230 |     T extends readonly [...unknown[], infer U] ? U :
//!  231 |     T extends readonly [unknown, ...unknown[]] ? T[number] :
//!  232 |     T[number] | undefined;
//!  233 | 
//!  234 | type DropLast<T extends readonly unknown[]> = T extends readonly [...infer U, unknown] ? U : [...T];
//!  235 | 
//!  236 | type T00 = First<[number, symbol, string]>;
//!  237 | type T01 = First<[symbol, string]>;
//!  238 | type T02 = First<[string]>;
//!  239 | type T03 = First<[number, symbol, ...string[]]>;
//!  240 | type T04 = First<[symbol, ...string[]]>;
//!  241 | type T05 = First<[string?]>;
//!  242 | type T06 = First<string[]>;
//!  243 | type T07 = First<[]>;
//!  244 | type T08 = First<any>;
//!  245 | type T09 = First<never>;
//!  246 | 
//!  247 | type T10 = DropFirst<[number, symbol, string]>;
//!  248 | type T11 = DropFirst<[symbol, string]>;
//!  249 | type T12 = DropFirst<[string]>;
//!  250 | type T13 = DropFirst<[number, symbol, ...string[]]>;
//!  251 | type T14 = DropFirst<[symbol, ...string[]]>;
//!  252 | type T15 = DropFirst<[string?]>;
//!  253 | type T16 = DropFirst<string[]>;
//!  254 | type T17 = DropFirst<[]>;
//!  255 | type T18 = DropFirst<any>;
//!  256 | type T19 = DropFirst<never>;
//!  257 | 
//!  258 | type T20 = Last<[number, symbol, string]>;
//!  259 | type T21 = Last<[symbol, string]>;
//!  260 | type T22 = Last<[string]>;
//!  261 | type T23 = Last<[number, symbol, ...string[]]>;
//!  262 | type T24 = Last<[symbol, ...string[]]>;
//!  263 | type T25 = Last<[string?]>;
//!  264 | type T26 = Last<string[]>;
//!  265 | type T27 = Last<[]>;
//!  266 | type T28 = Last<any>;
//!  267 | type T29 = Last<never>;
//!  268 | 
//!  269 | type T30 = DropLast<[number, symbol, string]>;
//!  270 | type T31 = DropLast<[symbol, string]>;
//!  271 | type T32 = DropLast<[string]>;
//!  272 | type T33 = DropLast<[number, symbol, ...string[]]>;
//!  273 | type T34 = DropLast<[symbol, ...string[]]>;
//!  274 | type T35 = DropLast<[string?]>;
//!  275 | type T36 = DropLast<string[]>;
//!  276 | type T37 = DropLast<[]>;  // unknown[], maybe should be []
//!  277 | type T38 = DropLast<any>;
//!  278 | type T39 = DropLast<never>;
//!  279 | 
//!  280 | type R00 = First<readonly [number, symbol, string]>;
//!  281 | type R01 = First<readonly [symbol, string]>;
//!  282 | type R02 = First<readonly [string]>;
//!  283 | type R03 = First<readonly [number, symbol, ...string[]]>;
//!  284 | type R04 = First<readonly [symbol, ...string[]]>;
//!  285 | type R05 = First<readonly string[]>;
//!  286 | type R06 = First<readonly []>;
//!  287 | 
//!  288 | type R10 = DropFirst<readonly [number, symbol, string]>;
//!  289 | type R11 = DropFirst<readonly [symbol, string]>;
//!  290 | type R12 = DropFirst<readonly [string]>;
//!  291 | type R13 = DropFirst<readonly [number, symbol, ...string[]]>;
//!  292 | type R14 = DropFirst<readonly [symbol, ...string[]]>;
//!  293 | type R15 = DropFirst<readonly string[]>;
//!  294 | type R16 = DropFirst<readonly []>;
//!  295 | 
//!  296 | type R20 = Last<readonly [number, symbol, string]>;
//!  297 | type R21 = Last<readonly [symbol, string]>;
//!  298 | type R22 = Last<readonly [string]>;
//!  299 | type R23 = Last<readonly [number, symbol, ...string[]]>;
//!  300 | type R24 = Last<readonly [symbol, ...string[]]>;
//!  301 | type R25 = Last<readonly string[]>;
//!  302 | type R26 = Last<readonly []>;
//!  303 | 
//!  304 | type R30 = DropLast<readonly [number, symbol, string]>;
//!  305 | type R31 = DropLast<readonly [symbol, string]>;
//!  306 | type R32 = DropLast<readonly [string]>;
//!  307 | type R33 = DropLast<readonly [number, symbol, ...string[]]>;
//!  308 | type R34 = DropLast<readonly [symbol, ...string[]]>;
//!  309 | type R35 = DropLast<readonly string[]>;
//!  310 | type R36 = DropLast<readonly []>;
//!  311 | 
//!  312 | // Inference to [...T, ...U] with implied arity for T
//!  313 | 
//!  314 | function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
//!  315 |     return (...b: U) => f(...a, ...b);
//!  316 | }
//!  317 | 
//!  318 | const fn1 = (a: number, b: string, c: boolean, d: string[]) => 0;
//!  319 | 
//!  320 | const c0 = curry(fn1);  // (a: number, b: string, c: boolean, d: string[]) => number
//!  321 | const c1 = curry(fn1, 1);  // (b: string, c: boolean, d: string[]) => number
//!  322 | const c2 = curry(fn1, 1, 'abc');  // (c: boolean, d: string[]) => number
//!  323 | const c3 = curry(fn1, 1, 'abc', true);  // (d: string[]) => number
//!  324 | const c4 = curry(fn1, 1, 'abc', true, ['x', 'y']);  // () => number
//!  325 | 
//!  326 | const fn2 = (x: number, b: boolean, ...args: string[]) => 0;
//!  327 | 
//!  328 | const c10 = curry(fn2);  // (x: number, b: boolean, ...args: string[]) => number
//!  329 | const c11 = curry(fn2, 1);  // (b: boolean, ...args: string[]) => number
//!  330 | const c12 = curry(fn2, 1, true);  // (...args: string[]) => number
//!  331 | const c13 = curry(fn2, 1, true, 'abc', 'def');  // (...args: string[]) => number
//!  332 | 
//!  333 | const fn3 = (...args: string[]) => 0;
//!  334 | 
//!  335 | const c20 = curry(fn3);  // (...args: string[]) => number
//!  336 | const c21 = curry(fn3, 'abc', 'def');  // (...args: string[]) => number
//!  337 | const c22 = curry(fn3, ...sa);  // (...args: string[]) => number
//!  338 | 
//!  339 | // No inference to [...T, ...U] when there is no implied arity
//!  340 | 
//!  341 | function curry2<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, t: [...T], u: [...U]) {
//!  342 |     return f(...t, ...u);
//!  343 | }
//!  344 | 
//!  345 | declare function fn10(a: string, b: number, c: boolean): string[];
//!  346 | 
//!  347 | curry2(fn10, ['hello', 42], [true]);
//!  348 | curry2(fn10, ['hello'], [42, true]);
//!  349 | 
//!  350 | // Inference to [...T] has higher priority than inference to [...T, number?]
//!  351 | 
//!  352 | declare function ft<T extends unknown[]>(t1: [...T], t2: [...T, number?]): T;
//!  353 | 
//!  354 | ft([1, 2, 3], [1, 2, 3]);
//!  355 | ft([1, 2], [1, 2, 3]);
//!  356 | ft(['a', 'b'], ['c', 'd'])
//!  357 | ft(['a', 'b'], ['c', 'd', 42])
//!  358 | 
//!  359 | // Last argument is contextually typed
//!  360 | 
//!  361 | declare function call<T extends unknown[], R>(...args: [...T, (...args: T) => R]): [T, R];
//!  362 | 
//!  363 | call('hello', 32, (a, b) => 42);
//!  364 | call(...sa, (...x) => 42);
//!  365 | 
//!  366 | // No inference to ending optional elements (except with identical structure)
//!  367 | 
//!  368 | declare function f20<T extends unknown[] = []>(args: [...T, number?]): T;
//!  369 | 
//!  370 | function f21<U extends string[]>(args: [...U, number?]) {
//!  371 |     let v1 = f20(args);  // U
//!  372 |     let v2 = f20(["foo", "bar"]);  // [string]
//!  373 |     let v3 = f20(["foo", 42]);  // [string]
//!  374 | }
//!  375 | 
//!  376 | declare function f22<T extends unknown[] = []>(args: [...T, number]): T;
//!  377 | declare function f22<T extends unknown[] = []>(args: [...T]): T;
//!  378 | 
//!  379 | function f23<U extends string[]>(args: [...U, number]) {
//!  380 |     let v1 = f22(args);  // U
//!  381 |     let v2 = f22(["foo", "bar"]);  // [string, string]
//!  382 |     let v3 = f22(["foo", 42]);  // [string]
//!  383 | }
//!  384 | 
//!  385 | // Repro from #39327
//!  386 | 
//!  387 | interface Desc<A extends unknown[], T> {
//!  388 |     readonly f: (...args: A) => T;
//!  389 |     bind<T extends unknown[], U extends unknown[], R>(this: Desc<[...T, ...U], R>, ...args: T): Desc<[...U], R>;
//!  390 | }
//!  391 | 
//!  392 | declare const a: Desc<[string, number, boolean], object>;
//!      :               |
//!      :               `-- const variable was declared here
//!  393 | const b = a.bind("", 1);  // Desc<[boolean], object>
//!  394 | 
//!  395 | // Repro from #39607
//!      `----
//!   x cannot reassign to a variable declared with `const`
//!      ,-[125:1]
//!  122 | 
//!  123 | // Spread of readonly array-like infers mutable array-like
//!  124 | 
//!  125 | declare function fx1<T extends unknown[]>(a: string, ...args: T): T;
//!      :                                           |
//!      :                                           `-- cannot reassign
//!  126 | 
//!  127 | function gx1<U extends unknown[], V extends readonly unknown[]>(u: U, v: V) {
//!  128 |     fx1('abc');  // []
//!  129 |     fx1('abc', ...u);  // U
//!  130 |     fx1('abc', ...v);  // [...V]
//!  131 |     fx1<U>('abc', ...u);  // U
//!  132 |     fx1<V>('abc', ...v);  // Error
//!  133 | }
//!  134 | 
//!  135 | declare function fx2<T extends readonly unknown[]>(a: string, ...args: T): T;
//!  136 | 
//!  137 | function gx2<U extends unknown[], V extends readonly unknown[]>(u: U, v: V) {
//!  138 |     fx2('abc');  // []
//!  139 |     fx2('abc', ...u);  // U
//!  140 |     fx2('abc', ...v);  // [...V]
//!  141 |     fx2<U>('abc', ...u);  // U
//!  142 |     fx2<V>('abc', ...v);  // V
//!  143 | }
//!  144 | 
//!  145 | // Relations involving variadic tuple types
//!  146 | 
//!  147 | function f10<T extends string[], U extends T>(x: [string, ...unknown[]], y: [string, ...T], z: [string, ...U]) {
//!  148 |     x = y;
//!  149 |     x = z;
//!  150 |     y = x;  // Error
//!  151 |     y = z;
//!  152 |     z = x;  // Error
//!  153 |     z = y;  // Error
//!  154 | }
//!  155 | 
//!  156 | // For a generic type T, [...T] is assignable to T, T is assignable to readonly [...T], and T is assignable
//!  157 | // to [...T] when T is constrained to a mutable array or tuple type.
//!  158 | 
//!  159 | function f11<T extends unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  160 |     t = m;
//!  161 |     t = r;  // Error
//!  162 |     m = t;
//!  163 |     m = r;  // Error
//!  164 |     r = t;
//!  165 |     r = m;
//!  166 | }
//!  167 | 
//!  168 | function f12<T extends readonly unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  169 |     t = m;
//!  170 |     t = r;  // Error
//!  171 |     m = t;  // Error
//!  172 |     m = r;  // Error
//!  173 |     r = t;
//!  174 |     r = m;
//!  175 | }
//!  176 | 
//!  177 | function f13<T extends string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  178 |     t0 = t1;
//!  179 |     t0 = t2;
//!  180 |     t1 = t0;
//!  181 |     t1 = t2;
//!  182 |     t2 = t0;  // Error
//!  183 |     t2 = t1;  // Error
//!  184 | }
//!  185 | 
//!  186 | function f14<T extends readonly string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  187 |     t0 = t1;
//!  188 |     t0 = t2;
//!  189 |     t1 = t0;  // Error
//!  190 |     t1 = t2;
//!  191 |     t2 = t0;  // Error
//!  192 |     t2 = t1;  // Error
//!  193 | }
//!  194 | 
//!  195 | function f15<T extends string[], U extends T>(k0: keyof T, k1: keyof [...T], k2: keyof [...U], k3: keyof [1, 2, ...T]) {
//!  196 |     k0 = 'length';
//!  197 |     k1 = 'length';
//!  198 |     k2 = 'length';
//!  199 |     k0 = 'slice';
//!  200 |     k1 = 'slice';
//!  201 |     k2 = 'slice';
//!  202 |     k3 = '0';
//!  203 |     k3 = '1';
//!  204 |     k3 = '2';  // Error
//!  205 | }
//!  206 | 
//!  207 | // Constraints of variadic tuple types
//!  208 | 
//!  209 | function ft16<T extends [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  210 |     x = y;
//!  211 | }
//!  212 | 
//!  213 | function ft17<T extends [] | [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  214 |     x = y;
//!  215 | }
//!  216 | 
//!  217 | function ft18<T extends unknown[]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  218 |     x = y;
//!  219 | }
//!  220 | 
//!  221 | // Inference between variadic tuple types
//!  222 | 
//!  223 | type First<T extends readonly unknown[]> =
//!  224 |     T extends readonly [unknown, ...unknown[]] ? T[0] :
//!  225 |     T[0] | undefined;
//!  226 | 
//!  227 | type DropFirst<T extends readonly unknown[]> = T extends readonly [unknown?, ...infer U] ? U : [...T];
//!  228 | 
//!  229 | type Last<T extends readonly unknown[]> =
//!  230 |     T extends readonly [...unknown[], infer U] ? U :
//!  231 |     T extends readonly [unknown, ...unknown[]] ? T[number] :
//!  232 |     T[number] | undefined;
//!  233 | 
//!  234 | type DropLast<T extends readonly unknown[]> = T extends readonly [...infer U, unknown] ? U : [...T];
//!  235 | 
//!  236 | type T00 = First<[number, symbol, string]>;
//!  237 | type T01 = First<[symbol, string]>;
//!  238 | type T02 = First<[string]>;
//!  239 | type T03 = First<[number, symbol, ...string[]]>;
//!  240 | type T04 = First<[symbol, ...string[]]>;
//!  241 | type T05 = First<[string?]>;
//!  242 | type T06 = First<string[]>;
//!  243 | type T07 = First<[]>;
//!  244 | type T08 = First<any>;
//!  245 | type T09 = First<never>;
//!  246 | 
//!  247 | type T10 = DropFirst<[number, symbol, string]>;
//!  248 | type T11 = DropFirst<[symbol, string]>;
//!  249 | type T12 = DropFirst<[string]>;
//!  250 | type T13 = DropFirst<[number, symbol, ...string[]]>;
//!  251 | type T14 = DropFirst<[symbol, ...string[]]>;
//!  252 | type T15 = DropFirst<[string?]>;
//!  253 | type T16 = DropFirst<string[]>;
//!  254 | type T17 = DropFirst<[]>;
//!  255 | type T18 = DropFirst<any>;
//!  256 | type T19 = DropFirst<never>;
//!  257 | 
//!  258 | type T20 = Last<[number, symbol, string]>;
//!  259 | type T21 = Last<[symbol, string]>;
//!  260 | type T22 = Last<[string]>;
//!  261 | type T23 = Last<[number, symbol, ...string[]]>;
//!  262 | type T24 = Last<[symbol, ...string[]]>;
//!  263 | type T25 = Last<[string?]>;
//!  264 | type T26 = Last<string[]>;
//!  265 | type T27 = Last<[]>;
//!  266 | type T28 = Last<any>;
//!  267 | type T29 = Last<never>;
//!  268 | 
//!  269 | type T30 = DropLast<[number, symbol, string]>;
//!  270 | type T31 = DropLast<[symbol, string]>;
//!  271 | type T32 = DropLast<[string]>;
//!  272 | type T33 = DropLast<[number, symbol, ...string[]]>;
//!  273 | type T34 = DropLast<[symbol, ...string[]]>;
//!  274 | type T35 = DropLast<[string?]>;
//!  275 | type T36 = DropLast<string[]>;
//!  276 | type T37 = DropLast<[]>;  // unknown[], maybe should be []
//!  277 | type T38 = DropLast<any>;
//!  278 | type T39 = DropLast<never>;
//!  279 | 
//!  280 | type R00 = First<readonly [number, symbol, string]>;
//!  281 | type R01 = First<readonly [symbol, string]>;
//!  282 | type R02 = First<readonly [string]>;
//!  283 | type R03 = First<readonly [number, symbol, ...string[]]>;
//!  284 | type R04 = First<readonly [symbol, ...string[]]>;
//!  285 | type R05 = First<readonly string[]>;
//!  286 | type R06 = First<readonly []>;
//!  287 | 
//!  288 | type R10 = DropFirst<readonly [number, symbol, string]>;
//!  289 | type R11 = DropFirst<readonly [symbol, string]>;
//!  290 | type R12 = DropFirst<readonly [string]>;
//!  291 | type R13 = DropFirst<readonly [number, symbol, ...string[]]>;
//!  292 | type R14 = DropFirst<readonly [symbol, ...string[]]>;
//!  293 | type R15 = DropFirst<readonly string[]>;
//!  294 | type R16 = DropFirst<readonly []>;
//!  295 | 
//!  296 | type R20 = Last<readonly [number, symbol, string]>;
//!  297 | type R21 = Last<readonly [symbol, string]>;
//!  298 | type R22 = Last<readonly [string]>;
//!  299 | type R23 = Last<readonly [number, symbol, ...string[]]>;
//!  300 | type R24 = Last<readonly [symbol, ...string[]]>;
//!  301 | type R25 = Last<readonly string[]>;
//!  302 | type R26 = Last<readonly []>;
//!  303 | 
//!  304 | type R30 = DropLast<readonly [number, symbol, string]>;
//!  305 | type R31 = DropLast<readonly [symbol, string]>;
//!  306 | type R32 = DropLast<readonly [string]>;
//!  307 | type R33 = DropLast<readonly [number, symbol, ...string[]]>;
//!  308 | type R34 = DropLast<readonly [symbol, ...string[]]>;
//!  309 | type R35 = DropLast<readonly string[]>;
//!  310 | type R36 = DropLast<readonly []>;
//!  311 | 
//!  312 | // Inference to [...T, ...U] with implied arity for T
//!  313 | 
//!  314 | function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
//!  315 |     return (...b: U) => f(...a, ...b);
//!  316 | }
//!  317 | 
//!  318 | const fn1 = (a: number, b: string, c: boolean, d: string[]) => 0;
//!  319 | 
//!  320 | const c0 = curry(fn1);  // (a: number, b: string, c: boolean, d: string[]) => number
//!  321 | const c1 = curry(fn1, 1);  // (b: string, c: boolean, d: string[]) => number
//!  322 | const c2 = curry(fn1, 1, 'abc');  // (c: boolean, d: string[]) => number
//!  323 | const c3 = curry(fn1, 1, 'abc', true);  // (d: string[]) => number
//!  324 | const c4 = curry(fn1, 1, 'abc', true, ['x', 'y']);  // () => number
//!  325 | 
//!  326 | const fn2 = (x: number, b: boolean, ...args: string[]) => 0;
//!  327 | 
//!  328 | const c10 = curry(fn2);  // (x: number, b: boolean, ...args: string[]) => number
//!  329 | const c11 = curry(fn2, 1);  // (b: boolean, ...args: string[]) => number
//!  330 | const c12 = curry(fn2, 1, true);  // (...args: string[]) => number
//!  331 | const c13 = curry(fn2, 1, true, 'abc', 'def');  // (...args: string[]) => number
//!  332 | 
//!  333 | const fn3 = (...args: string[]) => 0;
//!  334 | 
//!  335 | const c20 = curry(fn3);  // (...args: string[]) => number
//!  336 | const c21 = curry(fn3, 'abc', 'def');  // (...args: string[]) => number
//!  337 | const c22 = curry(fn3, ...sa);  // (...args: string[]) => number
//!  338 | 
//!  339 | // No inference to [...T, ...U] when there is no implied arity
//!  340 | 
//!  341 | function curry2<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, t: [...T], u: [...U]) {
//!  342 |     return f(...t, ...u);
//!  343 | }
//!  344 | 
//!  345 | declare function fn10(a: string, b: number, c: boolean): string[];
//!  346 | 
//!  347 | curry2(fn10, ['hello', 42], [true]);
//!  348 | curry2(fn10, ['hello'], [42, true]);
//!  349 | 
//!  350 | // Inference to [...T] has higher priority than inference to [...T, number?]
//!  351 | 
//!  352 | declare function ft<T extends unknown[]>(t1: [...T], t2: [...T, number?]): T;
//!  353 | 
//!  354 | ft([1, 2, 3], [1, 2, 3]);
//!  355 | ft([1, 2], [1, 2, 3]);
//!  356 | ft(['a', 'b'], ['c', 'd'])
//!  357 | ft(['a', 'b'], ['c', 'd', 42])
//!  358 | 
//!  359 | // Last argument is contextually typed
//!  360 | 
//!  361 | declare function call<T extends unknown[], R>(...args: [...T, (...args: T) => R]): [T, R];
//!  362 | 
//!  363 | call('hello', 32, (a, b) => 42);
//!  364 | call(...sa, (...x) => 42);
//!  365 | 
//!  366 | // No inference to ending optional elements (except with identical structure)
//!  367 | 
//!  368 | declare function f20<T extends unknown[] = []>(args: [...T, number?]): T;
//!  369 | 
//!  370 | function f21<U extends string[]>(args: [...U, number?]) {
//!  371 |     let v1 = f20(args);  // U
//!  372 |     let v2 = f20(["foo", "bar"]);  // [string]
//!  373 |     let v3 = f20(["foo", 42]);  // [string]
//!  374 | }
//!  375 | 
//!  376 | declare function f22<T extends unknown[] = []>(args: [...T, number]): T;
//!  377 | declare function f22<T extends unknown[] = []>(args: [...T]): T;
//!  378 | 
//!  379 | function f23<U extends string[]>(args: [...U, number]) {
//!  380 |     let v1 = f22(args);  // U
//!  381 |     let v2 = f22(["foo", "bar"]);  // [string, string]
//!  382 |     let v3 = f22(["foo", 42]);  // [string]
//!  383 | }
//!  384 | 
//!  385 | // Repro from #39327
//!  386 | 
//!  387 | interface Desc<A extends unknown[], T> {
//!  388 |     readonly f: (...args: A) => T;
//!  389 |     bind<T extends unknown[], U extends unknown[], R>(this: Desc<[...T, ...U], R>, ...args: T): Desc<[...U], R>;
//!  390 | }
//!  391 | 
//!  392 | declare const a: Desc<[string, number, boolean], object>;
//!      :               |
//!      :               `-- const variable was declared here
//!  393 | const b = a.bind("", 1);  // Desc<[boolean], object>
//!  394 | 
//!  395 | // Repro from #39607
//!      `----
//!   x cannot reassign to a variable declared with `const`
//!      ,-[135:1]
//!  132 |     fx1<V>('abc', ...v);  // Error
//!  133 | }
//!  134 | 
//!  135 | declare function fx2<T extends readonly unknown[]>(a: string, ...args: T): T;
//!      :                                                    |
//!      :                                                    `-- cannot reassign
//!  136 | 
//!  137 | function gx2<U extends unknown[], V extends readonly unknown[]>(u: U, v: V) {
//!  138 |     fx2('abc');  // []
//!  139 |     fx2('abc', ...u);  // U
//!  140 |     fx2('abc', ...v);  // [...V]
//!  141 |     fx2<U>('abc', ...u);  // U
//!  142 |     fx2<V>('abc', ...v);  // V
//!  143 | }
//!  144 | 
//!  145 | // Relations involving variadic tuple types
//!  146 | 
//!  147 | function f10<T extends string[], U extends T>(x: [string, ...unknown[]], y: [string, ...T], z: [string, ...U]) {
//!  148 |     x = y;
//!  149 |     x = z;
//!  150 |     y = x;  // Error
//!  151 |     y = z;
//!  152 |     z = x;  // Error
//!  153 |     z = y;  // Error
//!  154 | }
//!  155 | 
//!  156 | // For a generic type T, [...T] is assignable to T, T is assignable to readonly [...T], and T is assignable
//!  157 | // to [...T] when T is constrained to a mutable array or tuple type.
//!  158 | 
//!  159 | function f11<T extends unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  160 |     t = m;
//!  161 |     t = r;  // Error
//!  162 |     m = t;
//!  163 |     m = r;  // Error
//!  164 |     r = t;
//!  165 |     r = m;
//!  166 | }
//!  167 | 
//!  168 | function f12<T extends readonly unknown[]>(t: T, m: [...T], r: readonly [...T]) {
//!  169 |     t = m;
//!  170 |     t = r;  // Error
//!  171 |     m = t;  // Error
//!  172 |     m = r;  // Error
//!  173 |     r = t;
//!  174 |     r = m;
//!  175 | }
//!  176 | 
//!  177 | function f13<T extends string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  178 |     t0 = t1;
//!  179 |     t0 = t2;
//!  180 |     t1 = t0;
//!  181 |     t1 = t2;
//!  182 |     t2 = t0;  // Error
//!  183 |     t2 = t1;  // Error
//!  184 | }
//!  185 | 
//!  186 | function f14<T extends readonly string[], U extends T>(t0: T, t1: [...T], t2: [...U]) {
//!  187 |     t0 = t1;
//!  188 |     t0 = t2;
//!  189 |     t1 = t0;  // Error
//!  190 |     t1 = t2;
//!  191 |     t2 = t0;  // Error
//!  192 |     t2 = t1;  // Error
//!  193 | }
//!  194 | 
//!  195 | function f15<T extends string[], U extends T>(k0: keyof T, k1: keyof [...T], k2: keyof [...U], k3: keyof [1, 2, ...T]) {
//!  196 |     k0 = 'length';
//!  197 |     k1 = 'length';
//!  198 |     k2 = 'length';
//!  199 |     k0 = 'slice';
//!  200 |     k1 = 'slice';
//!  201 |     k2 = 'slice';
//!  202 |     k3 = '0';
//!  203 |     k3 = '1';
//!  204 |     k3 = '2';  // Error
//!  205 | }
//!  206 | 
//!  207 | // Constraints of variadic tuple types
//!  208 | 
//!  209 | function ft16<T extends [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  210 |     x = y;
//!  211 | }
//!  212 | 
//!  213 | function ft17<T extends [] | [unknown]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  214 |     x = y;
//!  215 | }
//!  216 | 
//!  217 | function ft18<T extends unknown[]>(x: [unknown, unknown], y: [...T, ...T]) {
//!  218 |     x = y;
//!  219 | }
//!  220 | 
//!  221 | // Inference between variadic tuple types
//!  222 | 
//!  223 | type First<T extends readonly unknown[]> =
//!  224 |     T extends readonly [unknown, ...unknown[]] ? T[0] :
//!  225 |     T[0] | undefined;
//!  226 | 
//!  227 | type DropFirst<T extends readonly unknown[]> = T extends readonly [unknown?, ...infer U] ? U : [...T];
//!  228 | 
//!  229 | type Last<T extends readonly unknown[]> =
//!  230 |     T extends readonly [...unknown[], infer U] ? U :
//!  231 |     T extends readonly [unknown, ...unknown[]] ? T[number] :
//!  232 |     T[number] | undefined;
//!  233 | 
//!  234 | type DropLast<T extends readonly unknown[]> = T extends readonly [...infer U, unknown] ? U : [...T];
//!  235 | 
//!  236 | type T00 = First<[number, symbol, string]>;
//!  237 | type T01 = First<[symbol, string]>;
//!  238 | type T02 = First<[string]>;
//!  239 | type T03 = First<[number, symbol, ...string[]]>;
//!  240 | type T04 = First<[symbol, ...string[]]>;
//!  241 | type T05 = First<[string?]>;
//!  242 | type T06 = First<string[]>;
//!  243 | type T07 = First<[]>;
//!  244 | type T08 = First<any>;
//!  245 | type T09 = First<never>;
//!  246 | 
//!  247 | type T10 = DropFirst<[number, symbol, string]>;
//!  248 | type T11 = DropFirst<[symbol, string]>;
//!  249 | type T12 = DropFirst<[string]>;
//!  250 | type T13 = DropFirst<[number, symbol, ...string[]]>;
//!  251 | type T14 = DropFirst<[symbol, ...string[]]>;
//!  252 | type T15 = DropFirst<[string?]>;
//!  253 | type T16 = DropFirst<string[]>;
//!  254 | type T17 = DropFirst<[]>;
//!  255 | type T18 = DropFirst<any>;
//!  256 | type T19 = DropFirst<never>;
//!  257 | 
//!  258 | type T20 = Last<[number, symbol, string]>;
//!  259 | type T21 = Last<[symbol, string]>;
//!  260 | type T22 = Last<[string]>;
//!  261 | type T23 = Last<[number, symbol, ...string[]]>;
//!  262 | type T24 = Last<[symbol, ...string[]]>;
//!  263 | type T25 = Last<[string?]>;
//!  264 | type T26 = Last<string[]>;
//!  265 | type T27 = Last<[]>;
//!  266 | type T28 = Last<any>;
//!  267 | type T29 = Last<never>;
//!  268 | 
//!  269 | type T30 = DropLast<[number, symbol, string]>;
//!  270 | type T31 = DropLast<[symbol, string]>;
//!  271 | type T32 = DropLast<[string]>;
//!  272 | type T33 = DropLast<[number, symbol, ...string[]]>;
//!  273 | type T34 = DropLast<[symbol, ...string[]]>;
//!  274 | type T35 = DropLast<[string?]>;
//!  275 | type T36 = DropLast<string[]>;
//!  276 | type T37 = DropLast<[]>;  // unknown[], maybe should be []
//!  277 | type T38 = DropLast<any>;
//!  278 | type T39 = DropLast<never>;
//!  279 | 
//!  280 | type R00 = First<readonly [number, symbol, string]>;
//!  281 | type R01 = First<readonly [symbol, string]>;
//!  282 | type R02 = First<readonly [string]>;
//!  283 | type R03 = First<readonly [number, symbol, ...string[]]>;
//!  284 | type R04 = First<readonly [symbol, ...string[]]>;
//!  285 | type R05 = First<readonly string[]>;
//!  286 | type R06 = First<readonly []>;
//!  287 | 
//!  288 | type R10 = DropFirst<readonly [number, symbol, string]>;
//!  289 | type R11 = DropFirst<readonly [symbol, string]>;
//!  290 | type R12 = DropFirst<readonly [string]>;
//!  291 | type R13 = DropFirst<readonly [number, symbol, ...string[]]>;
//!  292 | type R14 = DropFirst<readonly [symbol, ...string[]]>;
//!  293 | type R15 = DropFirst<readonly string[]>;
//!  294 | type R16 = DropFirst<readonly []>;
//!  295 | 
//!  296 | type R20 = Last<readonly [number, symbol, string]>;
//!  297 | type R21 = Last<readonly [symbol, string]>;
//!  298 | type R22 = Last<readonly [string]>;
//!  299 | type R23 = Last<readonly [number, symbol, ...string[]]>;
//!  300 | type R24 = Last<readonly [symbol, ...string[]]>;
//!  301 | type R25 = Last<readonly string[]>;
//!  302 | type R26 = Last<readonly []>;
//!  303 | 
//!  304 | type R30 = DropLast<readonly [number, symbol, string]>;
//!  305 | type R31 = DropLast<readonly [symbol, string]>;
//!  306 | type R32 = DropLast<readonly [string]>;
//!  307 | type R33 = DropLast<readonly [number, symbol, ...string[]]>;
//!  308 | type R34 = DropLast<readonly [symbol, ...string[]]>;
//!  309 | type R35 = DropLast<readonly string[]>;
//!  310 | type R36 = DropLast<readonly []>;
//!  311 | 
//!  312 | // Inference to [...T, ...U] with implied arity for T
//!  313 | 
//!  314 | function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
//!  315 |     return (...b: U) => f(...a, ...b);
//!  316 | }
//!  317 | 
//!  318 | const fn1 = (a: number, b: string, c: boolean, d: string[]) => 0;
//!  319 | 
//!  320 | const c0 = curry(fn1);  // (a: number, b: string, c: boolean, d: string[]) => number
//!  321 | const c1 = curry(fn1, 1);  // (b: string, c: boolean, d: string[]) => number
//!  322 | const c2 = curry(fn1, 1, 'abc');  // (c: boolean, d: string[]) => number
//!  323 | const c3 = curry(fn1, 1, 'abc', true);  // (d: string[]) => number
//!  324 | const c4 = curry(fn1, 1, 'abc', true, ['x', 'y']);  // () => number
//!  325 | 
//!  326 | const fn2 = (x: number, b: boolean, ...args: string[]) => 0;
//!  327 | 
//!  328 | const c10 = curry(fn2);  // (x: number, b: boolean, ...args: string[]) => number
//!  329 | const c11 = curry(fn2, 1);  // (b: boolean, ...args: string[]) => number
//!  330 | const c12 = curry(fn2, 1, true);  // (...args: string[]) => number
//!  331 | const c13 = curry(fn2, 1, true, 'abc', 'def');  // (...args: string[]) => number
//!  332 | 
//!  333 | const fn3 = (...args: string[]) => 0;
//!  334 | 
//!  335 | const c20 = curry(fn3);  // (...args: string[]) => number
//!  336 | const c21 = curry(fn3, 'abc', 'def');  // (...args: string[]) => number
//!  337 | const c22 = curry(fn3, ...sa);  // (...args: string[]) => number
//!  338 | 
//!  339 | // No inference to [...T, ...U] when there is no implied arity
//!  340 | 
//!  341 | function curry2<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, t: [...T], u: [...U]) {
//!  342 |     return f(...t, ...u);
//!  343 | }
//!  344 | 
//!  345 | declare function fn10(a: string, b: number, c: boolean): string[];
//!  346 | 
//!  347 | curry2(fn10, ['hello', 42], [true]);
//!  348 | curry2(fn10, ['hello'], [42, true]);
//!  349 | 
//!  350 | // Inference to [...T] has higher priority than inference to [...T, number?]
//!  351 | 
//!  352 | declare function ft<T extends unknown[]>(t1: [...T], t2: [...T, number?]): T;
//!  353 | 
//!  354 | ft([1, 2, 3], [1, 2, 3]);
//!  355 | ft([1, 2], [1, 2, 3]);
//!  356 | ft(['a', 'b'], ['c', 'd'])
//!  357 | ft(['a', 'b'], ['c', 'd', 42])
//!  358 | 
//!  359 | // Last argument is contextually typed
//!  360 | 
//!  361 | declare function call<T extends unknown[], R>(...args: [...T, (...args: T) => R]): [T, R];
//!  362 | 
//!  363 | call('hello', 32, (a, b) => 42);
//!  364 | call(...sa, (...x) => 42);
//!  365 | 
//!  366 | // No inference to ending optional elements (except with identical structure)
//!  367 | 
//!  368 | declare function f20<T extends unknown[] = []>(args: [...T, number?]): T;
//!  369 | 
//!  370 | function f21<U extends string[]>(args: [...U, number?]) {
//!  371 |     let v1 = f20(args);  // U
//!  372 |     let v2 = f20(["foo", "bar"]);  // [string]
//!  373 |     let v3 = f20(["foo", 42]);  // [string]
//!  374 | }
//!  375 | 
//!  376 | declare function f22<T extends unknown[] = []>(args: [...T, number]): T;
//!  377 | declare function f22<T extends unknown[] = []>(args: [...T]): T;
//!  378 | 
//!  379 | function f23<U extends string[]>(args: [...U, number]) {
//!  380 |     let v1 = f22(args);  // U
//!  381 |     let v2 = f22(["foo", "bar"]);  // [string, string]
//!  382 |     let v3 = f22(["foo", 42]);  // [string]
//!  383 | }
//!  384 | 
//!  385 | // Repro from #39327
//!  386 | 
//!  387 | interface Desc<A extends unknown[], T> {
//!  388 |     readonly f: (...args: A) => T;
//!  389 |     bind<T extends unknown[], U extends unknown[], R>(this: Desc<[...T, ...U], R>, ...args: T): Desc<[...U], R>;
//!  390 | }
//!  391 | 
//!  392 | declare const a: Desc<[string, number, boolean], object>;
//!      :               |
//!      :               `-- const variable was declared here
//!  393 | const b = a.bind("", 1);  // Desc<[boolean], object>
//!  394 | 
//!  395 | // Repro from #39607
//!      `----
//!   x cannot reassign to a variable declared with `const`
//!      ,-[345:1]
//!  342 |     return f(...t, ...u);
//!  343 | }
//!  344 | 
//!  345 | declare function fn10(a: string, b: number, c: boolean): string[];
//!      :                       |
//!      :                       `-- cannot reassign
//!  346 | 
//!  347 | curry2(fn10, ['hello', 42], [true]);
//!  348 | curry2(fn10, ['hello'], [42, true]);
//!  349 | 
//!  350 | // Inference to [...T] has higher priority than inference to [...T, number?]
//!  351 | 
//!  352 | declare function ft<T extends unknown[]>(t1: [...T], t2: [...T, number?]): T;
//!  353 | 
//!  354 | ft([1, 2, 3], [1, 2, 3]);
//!  355 | ft([1, 2], [1, 2, 3]);
//!  356 | ft(['a', 'b'], ['c', 'd'])
//!  357 | ft(['a', 'b'], ['c', 'd', 42])
//!  358 | 
//!  359 | // Last argument is contextually typed
//!  360 | 
//!  361 | declare function call<T extends unknown[], R>(...args: [...T, (...args: T) => R]): [T, R];
//!  362 | 
//!  363 | call('hello', 32, (a, b) => 42);
//!  364 | call(...sa, (...x) => 42);
//!  365 | 
//!  366 | // No inference to ending optional elements (except with identical structure)
//!  367 | 
//!  368 | declare function f20<T extends unknown[] = []>(args: [...T, number?]): T;
//!  369 | 
//!  370 | function f21<U extends string[]>(args: [...U, number?]) {
//!  371 |     let v1 = f20(args);  // U
//!  372 |     let v2 = f20(["foo", "bar"]);  // [string]
//!  373 |     let v3 = f20(["foo", 42]);  // [string]
//!  374 | }
//!  375 | 
//!  376 | declare function f22<T extends unknown[] = []>(args: [...T, number]): T;
//!  377 | declare function f22<T extends unknown[] = []>(args: [...T]): T;
//!  378 | 
//!  379 | function f23<U extends string[]>(args: [...U, number]) {
//!  380 |     let v1 = f22(args);  // U
//!  381 |     let v2 = f22(["foo", "bar"]);  // [string, string]
//!  382 |     let v3 = f22(["foo", 42]);  // [string]
//!  383 | }
//!  384 | 
//!  385 | // Repro from #39327
//!  386 | 
//!  387 | interface Desc<A extends unknown[], T> {
//!  388 |     readonly f: (...args: A) => T;
//!  389 |     bind<T extends unknown[], U extends unknown[], R>(this: Desc<[...T, ...U], R>, ...args: T): Desc<[...U], R>;
//!  390 | }
//!  391 | 
//!  392 | declare const a: Desc<[string, number, boolean], object>;
//!      :               |
//!      :               `-- const variable was declared here
//!  393 | const b = a.bind("", 1);  // Desc<[boolean], object>
//!  394 | 
//!  395 | // Repro from #39607
//!      `----
