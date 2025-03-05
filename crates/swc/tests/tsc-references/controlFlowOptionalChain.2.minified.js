//// [controlFlowOptionalChain.ts]
//!   x cannot reassign to a variable declared with `const`
//!      ,-[27:1]
//!   24 | 
//!   25 | // type predicates
//!   26 | declare const f: undefined | ((x: any) => x is number);
//!   27 | declare const x: string | number;
//!      :               |
//!      :               `-- const variable was declared here
//!   28 | if (f?.(x)) {
//!   29 |     x; // number
//!   30 |     f; // (x: any) => x is number
//!   31 |     f(x);
//!   32 | }
//!   33 | else {
//!   34 |     x;
//!   35 |     f;
//!   36 |     f(x);
//!   37 | }
//!   38 | x;
//!   39 | f;
//!   40 | f(x);
//!   41 | 
//!   42 | declare const o2: { f(x: any): x is number; } | undefined;
//!   43 | if (o2?.f(x)) {
//!   44 |     x; // number
//!   45 |     o2.f; // (x: any) => x is number
//!   46 |     o2?.f;
//!   47 |     o2?.f(x);
//!   48 | }
//!   49 | else {
//!   50 |     x;
//!   51 |     o2;
//!   52 |     o2?.f;
//!   53 |     o2.f;
//!   54 | }
//!   55 | x;
//!   56 | o2;
//!   57 | o2?.f;
//!   58 | o2.f;
//!   59 | 
//!   60 | declare const o3: { x: 1, y: string } | { x: 2, y: number } | undefined;
//!   61 | if (o3?.x === 1) {
//!   62 |     o3;
//!   63 |     o3.x;
//!   64 |     o3?.x;
//!   65 | }
//!   66 | else {
//!   67 |     o3;
//!   68 |     o3?.x;
//!   69 |     o3.x;
//!   70 | }
//!   71 | o3;
//!   72 | o3?.x;
//!   73 | o3.x;
//!   74 | 
//!   75 | declare const o4: { x?: { y: boolean } };
//!   76 | if (o4.x?.y) {
//!   77 |     o4.x; // { y: boolean }
//!   78 |     o4.x.y; // true
//!   79 |     o4.x?.y; // true
//!   80 | }
//!   81 | else {
//!   82 |     o4.x;
//!   83 |     o4.x?.y;
//!   84 |     o4.x.y;
//!   85 | }
//!   86 | o4.x;
//!   87 | o4.x?.y;
//!   88 | o4.x.y;
//!   89 | 
//!   90 | declare const o5: { x?: { y: { z?: { w: boolean } } } };
//!   91 | if (o5.x?.y.z?.w) {
//!   92 |     o5.x;
//!   93 |     o5.x.y;
//!   94 |     o5.x.y.z;
//!   95 |     o5.x.y.z.w; // true
//!   96 |     o5.x.y.z?.w; // true
//!   97 |     o5.x?.y.z.w; // true
//!   98 |     o5.x?.y.z?.w; // true
//!   99 | }
//!  100 | else {
//!  101 |     o5.x;
//!  102 |     o5.x?.y;
//!  103 |     o5.x?.y.z;
//!  104 |     o5.x?.y.z?.w;
//!  105 |     o5.x.y;
//!  106 |     o5.x.y.z.w;
//!  107 | }
//!  108 | o5.x;
//!  109 | o5.x?.y;
//!  110 | o5.x?.y.z;
//!  111 | o5.x?.y.z?.w;
//!  112 | o5.x.y;
//!  113 | o5.x.y.z.w;
//!  114 | 
//!  115 | interface Base {
//!  116 |     f(): this is Derived;
//!  117 | }
//!  118 | 
//!  119 | interface Derived extends Base {
//!  120 |     x: number;
//!  121 | }
//!  122 | 
//!  123 | declare const o6: Base | undefined;
//!  124 | if (o6?.f()) {
//!  125 |     o6; // Derived
//!  126 |     o6.f;
//!  127 | }
//!  128 | else {
//!  129 |     o6;
//!  130 |     o6?.f;
//!  131 |     o6.f;
//!  132 | }
//!  133 | o6;
//!  134 | o6?.f;
//!  135 | o6.f;
//!  136 | 
//!  137 | // asserts
//!  138 | declare const isDefined: <T>(value: T) => asserts value is NonNullable<T>;
//!  139 | declare const isString: (value: unknown) => asserts value is string;
//!  140 | declare const maybeIsString: undefined | ((value: unknown) => asserts value is string);
//!  141 | declare const maybeNever: undefined | (() => never);
//!  142 | 
//!  143 | function f01(x: unknown) {
//!  144 |     if (!!true) {
//!  145 |         isString?.(x);
//!  146 |         x;
//!  147 |     }
//!  148 |     if (!!true) {
//!  149 |         maybeIsString?.(x);
//!  150 |         x;
//!  151 |     }
//!  152 |     if (!!true) {
//!  153 |         isDefined(maybeIsString);
//!  154 |         maybeIsString?.(x);
//!  155 |         x;
//!  156 |     }
//!  157 |     if (!!true) {
//!  158 |         maybeNever?.();
//!  159 |         x;
//!  160 |     }
//!  161 | }
//!  162 | 
//!  163 | type Thing = { foo: string | number, bar(): number, baz: object };
//!  164 | 
//!  165 | function f10(o: Thing | undefined, value: number) {
//!  166 |     if (o?.foo === value) {
//!  167 |         o.foo;
//!  168 |     }
//!  169 |     if (o?.["foo"] === value) {
//!  170 |         o["foo"];
//!  171 |     }
//!  172 |     if (o?.bar() === value) {
//!  173 |         o.bar;
//!  174 |     }
//!  175 |     if (o?.foo == value) {
//!  176 |         o.foo;
//!  177 |     }
//!  178 |     if (o?.["foo"] == value) {
//!  179 |         o["foo"];
//!  180 |     }
//!  181 |     if (o?.bar() == value) {
//!  182 |         o.bar;
//!  183 |     }
//!  184 | }
//!  185 | 
//!  186 | function f11(o: Thing | null, value: number) {
//!  187 |     if (o?.foo === value) {
//!  188 |         o.foo;
//!  189 |     }
//!  190 |     if (o?.["foo"] === value) {
//!  191 |         o["foo"];
//!  192 |     }
//!  193 |     if (o?.bar() === value) {
//!  194 |         o.bar;
//!  195 |     }
//!  196 |     if (o?.foo == value) {
//!  197 |         o.foo;
//!  198 |     }
//!  199 |     if (o?.["foo"] == value) {
//!  200 |         o["foo"];
//!  201 |     }
//!  202 |     if (o?.bar() == value) {
//!  203 |         o.bar;
//!  204 |     }
//!  205 | }
//!  206 | 
//!  207 | function f12(o: Thing | undefined, value: number | undefined) {
//!  208 |     if (o?.foo === value) {
//!  209 |         o.foo;  // Error
//!  210 |     }
//!  211 |     if (o?.["foo"] === value) {
//!  212 |         o["foo"];  // Error
//!  213 |     }
//!  214 |     if (o?.bar() === value) {
//!  215 |         o.bar;  // Error
//!  216 |     }
//!  217 |     if (o?.foo == value) {
//!  218 |         o.foo;  // Error
//!  219 |     }
//!  220 |     if (o?.["foo"] == value) {
//!  221 |         o["foo"];  // Error
//!  222 |     }
//!  223 |     if (o?.bar() == value) {
//!  224 |         o.bar;  // Error
//!  225 |     }
//!  226 | }
//!  227 | 
//!  228 | function f12a(o: Thing | undefined, value: number | null) {
//!  229 |     if (o?.foo === value) {
//!  230 |         o.foo;
//!  231 |     }
//!  232 |     if (o?.["foo"] === value) {
//!  233 |         o["foo"];
//!  234 |     }
//!  235 |     if (o?.bar() === value) {
//!  236 |         o.bar;
//!  237 |     }
//!  238 |     if (o?.foo == value) {
//!  239 |         o.foo;  // Error
//!  240 |     }
//!  241 |     if (o?.["foo"] == value) {
//!  242 |         o["foo"];  // Error
//!  243 |     }
//!  244 |     if (o?.bar() == value) {
//!  245 |         o.bar;  // Error
//!  246 |     }
//!  247 | }
//!  248 | 
//!  249 | function f13(o: Thing | undefined) {
//!  250 |     if (o?.foo !== undefined) {
//!  251 |         o.foo;
//!  252 |     }
//!  253 |     if (o?.["foo"] !== undefined) {
//!  254 |         o["foo"];
//!  255 |     }
//!  256 |     if (o?.bar() !== undefined) {
//!  257 |         o.bar;
//!  258 |     }
//!  259 |     if (o?.foo != undefined) {
//!  260 |         o.foo;
//!  261 |     }
//!  262 |     if (o?.["foo"] != undefined) {
//!  263 |         o["foo"];
//!  264 |     }
//!  265 |     if (o?.bar() != undefined) {
//!  266 |         o.bar;
//!  267 |     }
//!  268 | }
//!  269 | 
//!  270 | function f13a(o: Thing | undefined) {
//!  271 |     if (o?.foo !== null) {
//!  272 |         o.foo;  // Error
//!  273 |     }
//!  274 |     if (o?.["foo"] !== null) {
//!  275 |         o["foo"];  // Error
//!  276 |     }
//!  277 |     if (o?.bar() !== null) {
//!  278 |         o.bar;  // Error
//!  279 |     }
//!  280 |     if (o?.foo != null) {
//!  281 |         o.foo;
//!  282 |     }
//!  283 |     if (o?.["foo"] != null) {
//!  284 |         o["foo"];
//!  285 |     }
//!  286 |     if (o?.bar() != null) {
//!  287 |         o.bar;
//!  288 |     }
//!  289 | }
//!  290 | 
//!  291 | function f14(o: Thing | null) {
//!  292 |     if (o?.foo !== undefined) {
//!  293 |         o.foo;
//!  294 |     }
//!  295 |     if (o?.["foo"] !== undefined) {
//!  296 |         o["foo"];
//!  297 |     }
//!  298 |     if (o?.bar() !== undefined) {
//!  299 |         o.bar;
//!  300 |     }
//!  301 | }
//!  302 | 
//!  303 | function f15(o: Thing | undefined, value: number) {
//!  304 |     if (o?.foo === value) {
//!  305 |         o.foo;
//!  306 |     }
//!  307 |     else {
//!  308 |         o.foo;  // Error
//!  309 |     }
//!  310 |     if (o?.foo !== value) {
//!  311 |         o.foo;  // Error
//!  312 |     }
//!  313 |     else {
//!  314 |         o.foo;
//!  315 |     }
//!  316 |     if (o?.foo == value) {
//!  317 |         o.foo;
//!  318 |     }
//!  319 |     else {
//!  320 |         o.foo;  // Error
//!  321 |     }
//!  322 |     if (o?.foo != value) {
//!  323 |         o.foo;  // Error
//!  324 |     }
//!  325 |     else {
//!  326 |         o.foo;
//!  327 |     }
//!  328 | }
//!  329 | 
//!  330 | function f15a(o: Thing | undefined, value: unknown) {
//!  331 |     if (o?.foo === value) {
//!  332 |         o.foo;  // Error
//!  333 |     }
//!  334 |     else {
//!  335 |         o.foo;  // Error
//!  336 |     }
//!  337 |     if (o?.foo !== value) {
//!  338 |         o.foo;  // Error
//!  339 |     }
//!  340 |     else {
//!  341 |         o.foo;  // Error
//!  342 |     }
//!  343 |     if (o?.foo == value) {
//!  344 |         o.foo;  // Error
//!  345 |     }
//!  346 |     else {
//!  347 |         o.foo;  // Error
//!  348 |     }
//!  349 |     if (o?.foo != value) {
//!  350 |         o.foo;  // Error
//!  351 |     }
//!  352 |     else {
//!  353 |         o.foo;  // Error
//!  354 |     }
//!  355 | }
//!  356 | 
//!  357 | function f16(o: Thing | undefined) {
//!  358 |     if (o?.foo === undefined) {
//!  359 |         o.foo;  // Error
//!  360 |     }
//!  361 |     else {
//!  362 |         o.foo;
//!  363 |     }
//!  364 |     if (o?.foo !== undefined) {
//!  365 |         o.foo;
//!  366 |     }
//!  367 |     else {
//!  368 |         o.foo;  // Error
//!  369 |     }
//!  370 |     if (o?.foo == undefined) {
//!  371 |         o.foo;  // Error
//!  372 |     }
//!  373 |     else {
//!  374 |         o.foo;
//!  375 |     }
//!  376 |     if (o?.foo != undefined) {
//!  377 |         o.foo;
//!  378 |     }
//!  379 |     else {
//!  380 |         o.foo;  // Error
//!  381 |     }
//!  382 | }
//!  383 | 
//!  384 | function f20(o: Thing | undefined) {
//!  385 |     if (typeof o?.foo === "number") {
//!  386 |         o.foo;
//!  387 |     }
//!  388 |     if (typeof o?.["foo"] === "number") {
//!  389 |         o["foo"];
//!  390 |     }
//!  391 |     if (typeof o?.bar() === "number") {
//!  392 |         o.bar;
//!  393 |     }
//!  394 |     if (o?.baz instanceof Error) {
//!  395 |         o.baz;
//!  396 |     }
//!  397 | }
//!  398 | 
//!  399 | function f21(o: Thing | null) {
//!  400 |     if (typeof o?.foo === "number") {
//!  401 |         o.foo;
//!  402 |     }
//!  403 |     if (typeof o?.["foo"] === "number") {
//!  404 |         o["foo"];
//!  405 |     }
//!  406 |     if (typeof o?.bar() === "number") {
//!  407 |         o.bar;
//!  408 |     }
//!  409 |     if (o?.baz instanceof Error) {
//!  410 |         o.baz;
//!  411 |     }
//!  412 | }
//!  413 | 
//!  414 | function f22(o: Thing | undefined) {
//!  415 |     if (typeof o?.foo === "number") {
//!  416 |         o.foo;
//!  417 |     }
//!  418 |     else {
//!  419 |         o.foo;  // Error
//!  420 |     }
//!  421 |     if (typeof o?.foo !== "number") {
//!  422 |         o.foo;  // Error
//!  423 |     }
//!  424 |     else {
//!  425 |         o.foo;
//!  426 |     }
//!  427 |     if (typeof o?.foo == "number") {
//!  428 |         o.foo;
//!  429 |     }
//!  430 |     else {
//!  431 |         o.foo;  // Error
//!  432 |     }
//!  433 |     if (typeof o?.foo != "number") {
//!  434 |         o.foo;  // Error
//!  435 |     }
//!  436 |     else {
//!  437 |         o.foo;
//!  438 |     }
//!  439 | }
//!  440 | 
//!  441 | function f23(o: Thing | undefined) {
//!  442 |     if (typeof o?.foo === "undefined") {
//!  443 |         o.foo;  // Error
//!  444 |     }
//!  445 |     else {
//!  446 |         o.foo;
//!  447 |     }
//!  448 |     if (typeof o?.foo !== "undefined") {
//!  449 |         o.foo;
//!  450 |     }
//!  451 |     else {
//!  452 |         o.foo;  // Error
//!  453 |     }
//!  454 |     if (typeof o?.foo == "undefined") {
//!  455 |         o.foo;  // Error
//!  456 |     }
//!  457 |     else {
//!  458 |         o.foo;
//!  459 |     }
//!  460 |     if (typeof o?.foo != "undefined") {
//!  461 |         o.foo;
//!  462 |     }
//!  463 |     else {
//!  464 |         o.foo;  // Error
//!  465 |     }
//!  466 | }
//!  467 | 
//!  468 | declare function assert(x: unknown): asserts x;
//!      :                         |
//!      :                         `-- cannot reassign
//!  469 | declare function assertNonNull<T>(x: T): asserts x is NonNullable<T>;
//!  470 | 
//!  471 | function f30(o: Thing | undefined) {
//!      `----
//!   x cannot reassign to a variable declared with `const`
//!      ,-[27:1]
//!   24 | 
//!   25 | // type predicates
//!   26 | declare const f: undefined | ((x: any) => x is number);
//!   27 | declare const x: string | number;
//!      :               |
//!      :               `-- const variable was declared here
//!   28 | if (f?.(x)) {
//!   29 |     x; // number
//!   30 |     f; // (x: any) => x is number
//!   31 |     f(x);
//!   32 | }
//!   33 | else {
//!   34 |     x;
//!   35 |     f;
//!   36 |     f(x);
//!   37 | }
//!   38 | x;
//!   39 | f;
//!   40 | f(x);
//!   41 | 
//!   42 | declare const o2: { f(x: any): x is number; } | undefined;
//!   43 | if (o2?.f(x)) {
//!   44 |     x; // number
//!   45 |     o2.f; // (x: any) => x is number
//!   46 |     o2?.f;
//!   47 |     o2?.f(x);
//!   48 | }
//!   49 | else {
//!   50 |     x;
//!   51 |     o2;
//!   52 |     o2?.f;
//!   53 |     o2.f;
//!   54 | }
//!   55 | x;
//!   56 | o2;
//!   57 | o2?.f;
//!   58 | o2.f;
//!   59 | 
//!   60 | declare const o3: { x: 1, y: string } | { x: 2, y: number } | undefined;
//!   61 | if (o3?.x === 1) {
//!   62 |     o3;
//!   63 |     o3.x;
//!   64 |     o3?.x;
//!   65 | }
//!   66 | else {
//!   67 |     o3;
//!   68 |     o3?.x;
//!   69 |     o3.x;
//!   70 | }
//!   71 | o3;
//!   72 | o3?.x;
//!   73 | o3.x;
//!   74 | 
//!   75 | declare const o4: { x?: { y: boolean } };
//!   76 | if (o4.x?.y) {
//!   77 |     o4.x; // { y: boolean }
//!   78 |     o4.x.y; // true
//!   79 |     o4.x?.y; // true
//!   80 | }
//!   81 | else {
//!   82 |     o4.x;
//!   83 |     o4.x?.y;
//!   84 |     o4.x.y;
//!   85 | }
//!   86 | o4.x;
//!   87 | o4.x?.y;
//!   88 | o4.x.y;
//!   89 | 
//!   90 | declare const o5: { x?: { y: { z?: { w: boolean } } } };
//!   91 | if (o5.x?.y.z?.w) {
//!   92 |     o5.x;
//!   93 |     o5.x.y;
//!   94 |     o5.x.y.z;
//!   95 |     o5.x.y.z.w; // true
//!   96 |     o5.x.y.z?.w; // true
//!   97 |     o5.x?.y.z.w; // true
//!   98 |     o5.x?.y.z?.w; // true
//!   99 | }
//!  100 | else {
//!  101 |     o5.x;
//!  102 |     o5.x?.y;
//!  103 |     o5.x?.y.z;
//!  104 |     o5.x?.y.z?.w;
//!  105 |     o5.x.y;
//!  106 |     o5.x.y.z.w;
//!  107 | }
//!  108 | o5.x;
//!  109 | o5.x?.y;
//!  110 | o5.x?.y.z;
//!  111 | o5.x?.y.z?.w;
//!  112 | o5.x.y;
//!  113 | o5.x.y.z.w;
//!  114 | 
//!  115 | interface Base {
//!  116 |     f(): this is Derived;
//!  117 | }
//!  118 | 
//!  119 | interface Derived extends Base {
//!  120 |     x: number;
//!  121 | }
//!  122 | 
//!  123 | declare const o6: Base | undefined;
//!  124 | if (o6?.f()) {
//!  125 |     o6; // Derived
//!  126 |     o6.f;
//!  127 | }
//!  128 | else {
//!  129 |     o6;
//!  130 |     o6?.f;
//!  131 |     o6.f;
//!  132 | }
//!  133 | o6;
//!  134 | o6?.f;
//!  135 | o6.f;
//!  136 | 
//!  137 | // asserts
//!  138 | declare const isDefined: <T>(value: T) => asserts value is NonNullable<T>;
//!  139 | declare const isString: (value: unknown) => asserts value is string;
//!  140 | declare const maybeIsString: undefined | ((value: unknown) => asserts value is string);
//!  141 | declare const maybeNever: undefined | (() => never);
//!  142 | 
//!  143 | function f01(x: unknown) {
//!  144 |     if (!!true) {
//!  145 |         isString?.(x);
//!  146 |         x;
//!  147 |     }
//!  148 |     if (!!true) {
//!  149 |         maybeIsString?.(x);
//!  150 |         x;
//!  151 |     }
//!  152 |     if (!!true) {
//!  153 |         isDefined(maybeIsString);
//!  154 |         maybeIsString?.(x);
//!  155 |         x;
//!  156 |     }
//!  157 |     if (!!true) {
//!  158 |         maybeNever?.();
//!  159 |         x;
//!  160 |     }
//!  161 | }
//!  162 | 
//!  163 | type Thing = { foo: string | number, bar(): number, baz: object };
//!  164 | 
//!  165 | function f10(o: Thing | undefined, value: number) {
//!  166 |     if (o?.foo === value) {
//!  167 |         o.foo;
//!  168 |     }
//!  169 |     if (o?.["foo"] === value) {
//!  170 |         o["foo"];
//!  171 |     }
//!  172 |     if (o?.bar() === value) {
//!  173 |         o.bar;
//!  174 |     }
//!  175 |     if (o?.foo == value) {
//!  176 |         o.foo;
//!  177 |     }
//!  178 |     if (o?.["foo"] == value) {
//!  179 |         o["foo"];
//!  180 |     }
//!  181 |     if (o?.bar() == value) {
//!  182 |         o.bar;
//!  183 |     }
//!  184 | }
//!  185 | 
//!  186 | function f11(o: Thing | null, value: number) {
//!  187 |     if (o?.foo === value) {
//!  188 |         o.foo;
//!  189 |     }
//!  190 |     if (o?.["foo"] === value) {
//!  191 |         o["foo"];
//!  192 |     }
//!  193 |     if (o?.bar() === value) {
//!  194 |         o.bar;
//!  195 |     }
//!  196 |     if (o?.foo == value) {
//!  197 |         o.foo;
//!  198 |     }
//!  199 |     if (o?.["foo"] == value) {
//!  200 |         o["foo"];
//!  201 |     }
//!  202 |     if (o?.bar() == value) {
//!  203 |         o.bar;
//!  204 |     }
//!  205 | }
//!  206 | 
//!  207 | function f12(o: Thing | undefined, value: number | undefined) {
//!  208 |     if (o?.foo === value) {
//!  209 |         o.foo;  // Error
//!  210 |     }
//!  211 |     if (o?.["foo"] === value) {
//!  212 |         o["foo"];  // Error
//!  213 |     }
//!  214 |     if (o?.bar() === value) {
//!  215 |         o.bar;  // Error
//!  216 |     }
//!  217 |     if (o?.foo == value) {
//!  218 |         o.foo;  // Error
//!  219 |     }
//!  220 |     if (o?.["foo"] == value) {
//!  221 |         o["foo"];  // Error
//!  222 |     }
//!  223 |     if (o?.bar() == value) {
//!  224 |         o.bar;  // Error
//!  225 |     }
//!  226 | }
//!  227 | 
//!  228 | function f12a(o: Thing | undefined, value: number | null) {
//!  229 |     if (o?.foo === value) {
//!  230 |         o.foo;
//!  231 |     }
//!  232 |     if (o?.["foo"] === value) {
//!  233 |         o["foo"];
//!  234 |     }
//!  235 |     if (o?.bar() === value) {
//!  236 |         o.bar;
//!  237 |     }
//!  238 |     if (o?.foo == value) {
//!  239 |         o.foo;  // Error
//!  240 |     }
//!  241 |     if (o?.["foo"] == value) {
//!  242 |         o["foo"];  // Error
//!  243 |     }
//!  244 |     if (o?.bar() == value) {
//!  245 |         o.bar;  // Error
//!  246 |     }
//!  247 | }
//!  248 | 
//!  249 | function f13(o: Thing | undefined) {
//!  250 |     if (o?.foo !== undefined) {
//!  251 |         o.foo;
//!  252 |     }
//!  253 |     if (o?.["foo"] !== undefined) {
//!  254 |         o["foo"];
//!  255 |     }
//!  256 |     if (o?.bar() !== undefined) {
//!  257 |         o.bar;
//!  258 |     }
//!  259 |     if (o?.foo != undefined) {
//!  260 |         o.foo;
//!  261 |     }
//!  262 |     if (o?.["foo"] != undefined) {
//!  263 |         o["foo"];
//!  264 |     }
//!  265 |     if (o?.bar() != undefined) {
//!  266 |         o.bar;
//!  267 |     }
//!  268 | }
//!  269 | 
//!  270 | function f13a(o: Thing | undefined) {
//!  271 |     if (o?.foo !== null) {
//!  272 |         o.foo;  // Error
//!  273 |     }
//!  274 |     if (o?.["foo"] !== null) {
//!  275 |         o["foo"];  // Error
//!  276 |     }
//!  277 |     if (o?.bar() !== null) {
//!  278 |         o.bar;  // Error
//!  279 |     }
//!  280 |     if (o?.foo != null) {
//!  281 |         o.foo;
//!  282 |     }
//!  283 |     if (o?.["foo"] != null) {
//!  284 |         o["foo"];
//!  285 |     }
//!  286 |     if (o?.bar() != null) {
//!  287 |         o.bar;
//!  288 |     }
//!  289 | }
//!  290 | 
//!  291 | function f14(o: Thing | null) {
//!  292 |     if (o?.foo !== undefined) {
//!  293 |         o.foo;
//!  294 |     }
//!  295 |     if (o?.["foo"] !== undefined) {
//!  296 |         o["foo"];
//!  297 |     }
//!  298 |     if (o?.bar() !== undefined) {
//!  299 |         o.bar;
//!  300 |     }
//!  301 | }
//!  302 | 
//!  303 | function f15(o: Thing | undefined, value: number) {
//!  304 |     if (o?.foo === value) {
//!  305 |         o.foo;
//!  306 |     }
//!  307 |     else {
//!  308 |         o.foo;  // Error
//!  309 |     }
//!  310 |     if (o?.foo !== value) {
//!  311 |         o.foo;  // Error
//!  312 |     }
//!  313 |     else {
//!  314 |         o.foo;
//!  315 |     }
//!  316 |     if (o?.foo == value) {
//!  317 |         o.foo;
//!  318 |     }
//!  319 |     else {
//!  320 |         o.foo;  // Error
//!  321 |     }
//!  322 |     if (o?.foo != value) {
//!  323 |         o.foo;  // Error
//!  324 |     }
//!  325 |     else {
//!  326 |         o.foo;
//!  327 |     }
//!  328 | }
//!  329 | 
//!  330 | function f15a(o: Thing | undefined, value: unknown) {
//!  331 |     if (o?.foo === value) {
//!  332 |         o.foo;  // Error
//!  333 |     }
//!  334 |     else {
//!  335 |         o.foo;  // Error
//!  336 |     }
//!  337 |     if (o?.foo !== value) {
//!  338 |         o.foo;  // Error
//!  339 |     }
//!  340 |     else {
//!  341 |         o.foo;  // Error
//!  342 |     }
//!  343 |     if (o?.foo == value) {
//!  344 |         o.foo;  // Error
//!  345 |     }
//!  346 |     else {
//!  347 |         o.foo;  // Error
//!  348 |     }
//!  349 |     if (o?.foo != value) {
//!  350 |         o.foo;  // Error
//!  351 |     }
//!  352 |     else {
//!  353 |         o.foo;  // Error
//!  354 |     }
//!  355 | }
//!  356 | 
//!  357 | function f16(o: Thing | undefined) {
//!  358 |     if (o?.foo === undefined) {
//!  359 |         o.foo;  // Error
//!  360 |     }
//!  361 |     else {
//!  362 |         o.foo;
//!  363 |     }
//!  364 |     if (o?.foo !== undefined) {
//!  365 |         o.foo;
//!  366 |     }
//!  367 |     else {
//!  368 |         o.foo;  // Error
//!  369 |     }
//!  370 |     if (o?.foo == undefined) {
//!  371 |         o.foo;  // Error
//!  372 |     }
//!  373 |     else {
//!  374 |         o.foo;
//!  375 |     }
//!  376 |     if (o?.foo != undefined) {
//!  377 |         o.foo;
//!  378 |     }
//!  379 |     else {
//!  380 |         o.foo;  // Error
//!  381 |     }
//!  382 | }
//!  383 | 
//!  384 | function f20(o: Thing | undefined) {
//!  385 |     if (typeof o?.foo === "number") {
//!  386 |         o.foo;
//!  387 |     }
//!  388 |     if (typeof o?.["foo"] === "number") {
//!  389 |         o["foo"];
//!  390 |     }
//!  391 |     if (typeof o?.bar() === "number") {
//!  392 |         o.bar;
//!  393 |     }
//!  394 |     if (o?.baz instanceof Error) {
//!  395 |         o.baz;
//!  396 |     }
//!  397 | }
//!  398 | 
//!  399 | function f21(o: Thing | null) {
//!  400 |     if (typeof o?.foo === "number") {
//!  401 |         o.foo;
//!  402 |     }
//!  403 |     if (typeof o?.["foo"] === "number") {
//!  404 |         o["foo"];
//!  405 |     }
//!  406 |     if (typeof o?.bar() === "number") {
//!  407 |         o.bar;
//!  408 |     }
//!  409 |     if (o?.baz instanceof Error) {
//!  410 |         o.baz;
//!  411 |     }
//!  412 | }
//!  413 | 
//!  414 | function f22(o: Thing | undefined) {
//!  415 |     if (typeof o?.foo === "number") {
//!  416 |         o.foo;
//!  417 |     }
//!  418 |     else {
//!  419 |         o.foo;  // Error
//!  420 |     }
//!  421 |     if (typeof o?.foo !== "number") {
//!  422 |         o.foo;  // Error
//!  423 |     }
//!  424 |     else {
//!  425 |         o.foo;
//!  426 |     }
//!  427 |     if (typeof o?.foo == "number") {
//!  428 |         o.foo;
//!  429 |     }
//!  430 |     else {
//!  431 |         o.foo;  // Error
//!  432 |     }
//!  433 |     if (typeof o?.foo != "number") {
//!  434 |         o.foo;  // Error
//!  435 |     }
//!  436 |     else {
//!  437 |         o.foo;
//!  438 |     }
//!  439 | }
//!  440 | 
//!  441 | function f23(o: Thing | undefined) {
//!  442 |     if (typeof o?.foo === "undefined") {
//!  443 |         o.foo;  // Error
//!  444 |     }
//!  445 |     else {
//!  446 |         o.foo;
//!  447 |     }
//!  448 |     if (typeof o?.foo !== "undefined") {
//!  449 |         o.foo;
//!  450 |     }
//!  451 |     else {
//!  452 |         o.foo;  // Error
//!  453 |     }
//!  454 |     if (typeof o?.foo == "undefined") {
//!  455 |         o.foo;  // Error
//!  456 |     }
//!  457 |     else {
//!  458 |         o.foo;
//!  459 |     }
//!  460 |     if (typeof o?.foo != "undefined") {
//!  461 |         o.foo;
//!  462 |     }
//!  463 |     else {
//!  464 |         o.foo;  // Error
//!  465 |     }
//!  466 | }
//!  467 | 
//!  468 | declare function assert(x: unknown): asserts x;
//!  469 | declare function assertNonNull<T>(x: T): asserts x is NonNullable<T>;
//!      :                                   |
//!      :                                   `-- cannot reassign
//!  470 | 
//!  471 | function f30(o: Thing | undefined) {
//!  472 |     if (!!true) {
//!      `----
