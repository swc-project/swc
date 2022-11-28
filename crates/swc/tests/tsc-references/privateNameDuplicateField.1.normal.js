//// [privateNameDuplicateField.ts]
//! 
//!   x duplicate private name #foo.
//!    ,-[5:1]
//!  5 |     class A_Field_Field {
//!  6 |         #foo = "foo";
//!  7 |         #foo = "foo";
//!    :          ^^^
//!  8 |     }
//!    `----
//! 
//!   x duplicate private name #foo.
//!     ,-[11:1]
//!  11 |     class A_Field_Method {
//!  12 |         #foo = "foo";
//!  13 |         #foo() { }
//!     :          ^^^
//!  14 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[17:1]
//!  17 |     class A_Field_Getter {
//!  18 |         #foo = "foo";
//!  19 |         get #foo() { return ""}
//!     :              ^^^
//!  20 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[23:1]
//!  23 |     class A_Field_Setter {
//!  24 |         #foo = "foo";
//!  25 |         set #foo(value: string) { }
//!     :              ^^^
//!  26 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[29:1]
//!  29 |     class A_Field_StaticField {
//!  30 |         #foo = "foo";
//!  31 |         static #foo = "foo";
//!     :                 ^^^
//!  32 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[35:1]
//!  35 |     class A_Field_StaticMethod {
//!  36 |         #foo = "foo";
//!  37 |         static #foo() { }
//!     :                 ^^^
//!  38 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[41:1]
//!  41 |     class A_Field_StaticGetter {
//!  42 |         #foo = "foo";
//!  43 |         static get #foo() { return ""}
//!     :                     ^^^
//!  44 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[47:1]
//!  47 |     class A_Field_StaticSetter {
//!  48 |         #foo = "foo";
//!  49 |         static set #foo(value: string) { }
//!     :                     ^^^
//!  50 |     }
//!  51 | }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[55:1]
//!  55 |     class A_Method_Field {
//!  56 |         #foo() { }
//!  57 |         #foo = "foo";
//!     :          ^^^
//!  58 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[61:1]
//!  61 |     class A_Method_Method {
//!  62 |         #foo() { }
//!  63 |         #foo() { }
//!     :          ^^^
//!  64 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[67:1]
//!  67 |     class A_Method_Getter {
//!  68 |         #foo() { }
//!  69 |         get #foo() { return ""}
//!     :              ^^^
//!  70 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[73:1]
//!  73 |     class A_Method_Setter {
//!  74 |         #foo() { }
//!  75 |         set #foo(value: string) { }
//!     :              ^^^
//!  76 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[79:1]
//!  79 |     class A_Method_StaticField {
//!  80 |         #foo() { }
//!  81 |         static #foo = "foo";
//!     :                 ^^^
//!  82 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[85:1]
//!  85 |     class A_Method_StaticMethod {
//!  86 |         #foo() { }
//!  87 |         static #foo() { }
//!     :                 ^^^
//!  88 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[91:1]
//!  91 |     class A_Method_StaticGetter {
//!  92 |         #foo() { }
//!  93 |         static get #foo() { return ""}
//!     :                     ^^^
//!  94 |     }
//!     `----
//! 
//!   x duplicate private name #foo.
//!      ,-[97:1]
//!   97 |     class A_Method_StaticSetter {
//!   98 |         #foo() { }
//!   99 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  100 |     }
//!  101 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[106:1]
//!  106 |     class A_Getter_Field {
//!  107 |         get #foo() { return ""}
//!  108 |         #foo = "foo";
//!      :          ^^^
//!  109 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[112:1]
//!  112 |     class A_Getter_Method {
//!  113 |         get #foo() { return ""}
//!  114 |         #foo() { }
//!      :          ^^^
//!  115 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[118:1]
//!  118 |     class A_Getter_Getter {
//!  119 |         get #foo() { return ""}
//!  120 |         get #foo() { return ""}
//!      :              ^^^
//!  121 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[130:1]
//!  130 |     class A_Getter_StaticField {
//!  131 |         get #foo() { return ""}
//!  132 |         static #foo() { }
//!      :                 ^^^
//!  133 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[136:1]
//!  136 |     class A_Getter_StaticMethod {
//!  137 |         get #foo() { return ""}
//!  138 |         static #foo() { }
//!      :                 ^^^
//!  139 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[142:1]
//!  142 |     class A_Getter_StaticGetter {
//!  143 |         get #foo() { return ""}
//!  144 |         static get #foo() { return ""}
//!      :                     ^^^
//!  145 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[148:1]
//!  148 |     class A_Getter_StaticSetter {
//!  149 |         get #foo() { return ""}
//!  150 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  151 |     }
//!  152 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[156:1]
//!  156 |     class A_Setter_Field {
//!  157 |         set #foo(value: string) { }
//!  158 |         #foo = "foo";
//!      :          ^^^
//!  159 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[162:1]
//!  162 |     class A_Setter_Method {
//!  163 |         set #foo(value: string) { }
//!  164 |         #foo() { }
//!      :          ^^^
//!  165 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[174:1]
//!  174 |     class A_Setter_Setter {
//!  175 |         set #foo(value: string) { }
//!  176 |         set #foo(value: string) { }
//!      :              ^^^
//!  177 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[180:1]
//!  180 |     class A_Setter_StaticField {
//!  181 |         set #foo(value: string) { }
//!  182 |         static #foo = "foo";
//!      :                 ^^^
//!  183 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[186:1]
//!  186 |     class A_Setter_StaticMethod {
//!  187 |         set #foo(value: string) { }
//!  188 |         static #foo() { }
//!      :                 ^^^
//!  189 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[192:1]
//!  192 |     class A_Setter_StaticGetter {
//!  193 |         set #foo(value: string) { }
//!  194 |         static get #foo() { return ""}
//!      :                     ^^^
//!  195 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[198:1]
//!  198 |     class A_Setter_StaticSetter {
//!  199 |         set #foo(value: string) { }
//!  200 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  201 |     }
//!  202 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[206:1]
//!  206 |     class A_StaticField_Field {
//!  207 |         static #foo = "foo";
//!  208 |         #foo = "foo";
//!      :          ^^^
//!  209 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[212:1]
//!  212 |     class A_StaticField_Method {
//!  213 |         static #foo = "foo";
//!  214 |         #foo() { }
//!      :          ^^^
//!  215 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[218:1]
//!  218 |     class A_StaticField_Getter {
//!  219 |         static #foo = "foo";
//!  220 |         get #foo() { return ""}
//!      :              ^^^
//!  221 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[224:1]
//!  224 |     class A_StaticField_Setter {
//!  225 |         static #foo = "foo";
//!  226 |         set #foo(value: string) { }
//!      :              ^^^
//!  227 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[230:1]
//!  230 |     class A_StaticField_StaticField {
//!  231 |         static #foo = "foo";
//!  232 |         static #foo = "foo";
//!      :                 ^^^
//!  233 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[236:1]
//!  236 |     class A_StaticField_StaticMethod {
//!  237 |         static #foo = "foo";
//!  238 |         static #foo() { }
//!      :                 ^^^
//!  239 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[242:1]
//!  242 |     class A_StaticField_StaticGetter {
//!  243 |         static #foo = "foo";
//!  244 |         static get #foo() { return ""}
//!      :                     ^^^
//!  245 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[248:1]
//!  248 |     class A_StaticField_StaticSetter {
//!  249 |         static #foo = "foo";
//!  250 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  251 |     }
//!  252 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[256:1]
//!  256 |     class A_StaticMethod_Field {
//!  257 |         static #foo() { }
//!  258 |         #foo = "foo";
//!      :          ^^^
//!  259 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[262:1]
//!  262 |     class A_StaticMethod_Method {
//!  263 |         static #foo() { }
//!  264 |         #foo() { }
//!      :          ^^^
//!  265 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[268:1]
//!  268 |     class A_StaticMethod_Getter {
//!  269 |         static #foo() { }
//!  270 |         get #foo() { return ""}
//!      :              ^^^
//!  271 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[274:1]
//!  274 |     class A_StaticMethod_Setter {
//!  275 |         static #foo() { }
//!  276 |         set #foo(value: string) { }
//!      :              ^^^
//!  277 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[280:1]
//!  280 |     class A_StaticMethod_StaticField {
//!  281 |         static #foo() { }
//!  282 |         static #foo = "foo";
//!      :                 ^^^
//!  283 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[286:1]
//!  286 |     class A_StaticMethod_StaticMethod {
//!  287 |         static #foo() { }
//!  288 |         static #foo() { }
//!      :                 ^^^
//!  289 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[292:1]
//!  292 |     class A_StaticMethod_StaticGetter {
//!  293 |         static #foo() { }
//!  294 |         static get #foo() { return ""}
//!      :                     ^^^
//!  295 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[298:1]
//!  298 |     class A_StaticMethod_StaticSetter {
//!  299 |         static #foo() { }
//!  300 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  301 |     }
//!  302 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[307:1]
//!  307 |     class A_StaticGetter_Field {
//!  308 |         static get #foo() { return ""}
//!  309 |         #foo = "foo";
//!      :          ^^^
//!  310 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[313:1]
//!  313 |     class A_StaticGetter_Method {
//!  314 |         static get #foo() { return ""}
//!  315 |         #foo() { }
//!      :          ^^^
//!  316 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[319:1]
//!  319 |     class A_StaticGetter_Getter {
//!  320 |         static get #foo() { return ""}
//!  321 |         get #foo() { return ""}
//!      :              ^^^
//!  322 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[325:1]
//!  325 |     class A_StaticGetter_Setter {
//!  326 |         static get #foo() { return ""}
//!  327 |         set #foo(value: string) { }
//!      :              ^^^
//!  328 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[331:1]
//!  331 |     class A_StaticGetter_StaticField {
//!  332 |         static get #foo() { return ""}
//!  333 |         static #foo() { }
//!      :                 ^^^
//!  334 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[337:1]
//!  337 |     class A_StaticGetter_StaticMethod {
//!  338 |         static get #foo() { return ""}
//!  339 |         static #foo() { }
//!      :                 ^^^
//!  340 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[343:1]
//!  343 |     class A_StaticGetter_StaticGetter {
//!  344 |         static get #foo() { return ""}
//!  345 |         static get #foo() { return ""}
//!      :                     ^^^
//!  346 |     }
//!  347 |     // OK
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[356:1]
//!  356 |     class A_StaticSetter_Field {
//!  357 |         static set #foo(value: string) { }
//!  358 |         #foo = "foo";
//!      :          ^^^
//!  359 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[362:1]
//!  362 |     class A_StaticSetter_Method {
//!  363 |         static set #foo(value: string) { }
//!  364 |         #foo() { }
//!      :          ^^^
//!  365 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[369:1]
//!  369 |     class A_StaticSetter_Getter {
//!  370 |         static set #foo(value: string) { }
//!  371 |         get #foo() { return ""}
//!      :              ^^^
//!  372 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[375:1]
//!  375 |     class A_StaticSetter_Setter {
//!  376 |         static set #foo(value: string) { }
//!  377 |         set #foo(value: string) { }
//!      :              ^^^
//!  378 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[381:1]
//!  381 |     class A_StaticSetter_StaticField {
//!  382 |         static set #foo(value: string) { }
//!  383 |         static #foo = "foo";
//!      :                 ^^^
//!  384 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[387:1]
//!  387 |     class A_StaticSetter_StaticMethod {
//!  388 |         static set #foo(value: string) { }
//!  389 |         static #foo() { }
//!      :                 ^^^
//!  390 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[399:1]
//!  399 |     class A_StaticSetter_StaticSetter {
//!  400 |         static set #foo(value: string) { }
//!  401 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  402 |     }
//!  403 | }
//!      `----
