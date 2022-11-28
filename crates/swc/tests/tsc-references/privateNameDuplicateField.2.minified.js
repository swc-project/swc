//// [privateNameDuplicateField.ts]
//! 
//!   x duplicate private name #foo.
//!     ,-[4:5]
//!   4 | // Error
//!   5 |     class A_Field_Field {
//!   6 |         #foo = "foo";
//!   7 |         #foo = "foo";
//!     :          ^^^
//!   8 |     }
//!   9 | 
//!  10 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[10:5]
//!  10 | // Error
//!  11 |     class A_Field_Method {
//!  12 |         #foo = "foo";
//!  13 |         #foo() { }
//!     :          ^^^
//!  14 |     }
//!  15 | 
//!  16 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[16:5]
//!  16 | // Error
//!  17 |     class A_Field_Getter {
//!  18 |         #foo = "foo";
//!  19 |         get #foo() { return ""}
//!     :              ^^^
//!  20 |     }
//!  21 | 
//!  22 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[22:5]
//!  22 | // Error
//!  23 |     class A_Field_Setter {
//!  24 |         #foo = "foo";
//!  25 |         set #foo(value: string) { }
//!     :              ^^^
//!  26 |     }
//!  27 | 
//!  28 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[28:5]
//!  28 | // Error
//!  29 |     class A_Field_StaticField {
//!  30 |         #foo = "foo";
//!  31 |         static #foo = "foo";
//!     :                 ^^^
//!  32 |     }
//!  33 | 
//!  34 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[34:5]
//!  34 | // Error
//!  35 |     class A_Field_StaticMethod {
//!  36 |         #foo = "foo";
//!  37 |         static #foo() { }
//!     :                 ^^^
//!  38 |     }
//!  39 | 
//!  40 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[40:5]
//!  40 | // Error
//!  41 |     class A_Field_StaticGetter {
//!  42 |         #foo = "foo";
//!  43 |         static get #foo() { return ""}
//!     :                     ^^^
//!  44 |     }
//!  45 | 
//!  46 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[46:5]
//!  46 | // Error
//!  47 |     class A_Field_StaticSetter {
//!  48 |         #foo = "foo";
//!  49 |         static set #foo(value: string) { }
//!     :                     ^^^
//!  50 |     }
//!  51 | }
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[54:5]
//!  54 | // Error
//!  55 |     class A_Method_Field {
//!  56 |         #foo() { }
//!  57 |         #foo = "foo";
//!     :          ^^^
//!  58 |     }
//!  59 | 
//!  60 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[60:5]
//!  60 | // Error
//!  61 |     class A_Method_Method {
//!  62 |         #foo() { }
//!  63 |         #foo() { }
//!     :          ^^^
//!  64 |     }
//!  65 | 
//!  66 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[66:5]
//!  66 | // Error
//!  67 |     class A_Method_Getter {
//!  68 |         #foo() { }
//!  69 |         get #foo() { return ""}
//!     :              ^^^
//!  70 |     }
//!  71 | 
//!  72 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[72:5]
//!  72 | // Error
//!  73 |     class A_Method_Setter {
//!  74 |         #foo() { }
//!  75 |         set #foo(value: string) { }
//!     :              ^^^
//!  76 |     }
//!  77 | 
//!  78 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[78:5]
//!  78 | // Error
//!  79 |     class A_Method_StaticField {
//!  80 |         #foo() { }
//!  81 |         static #foo = "foo";
//!     :                 ^^^
//!  82 |     }
//!  83 | 
//!  84 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[84:5]
//!  84 | // Error
//!  85 |     class A_Method_StaticMethod {
//!  86 |         #foo() { }
//!  87 |         static #foo() { }
//!     :                 ^^^
//!  88 |     }
//!  89 | 
//!  90 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,-[90:5]
//!  90 | // Error
//!  91 |     class A_Method_StaticGetter {
//!  92 |         #foo() { }
//!  93 |         static get #foo() { return ""}
//!     :                     ^^^
//!  94 |     }
//!  95 | 
//!  96 |     // Error
//!     `----
//! 
//!   x duplicate private name #foo.
//!      ,-[96:5]
//!   96 | // Error
//!   97 |     class A_Method_StaticSetter {
//!   98 |         #foo() { }
//!   99 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  100 |     }
//!  101 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[105:5]
//!  105 | // Error
//!  106 |     class A_Getter_Field {
//!  107 |         get #foo() { return ""}
//!  108 |         #foo = "foo";
//!      :          ^^^
//!  109 |     }
//!  110 | 
//!  111 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[111:5]
//!  111 | // Error
//!  112 |     class A_Getter_Method {
//!  113 |         get #foo() { return ""}
//!  114 |         #foo() { }
//!      :          ^^^
//!  115 |     }
//!  116 | 
//!  117 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[117:5]
//!  117 | // Error
//!  118 |     class A_Getter_Getter {
//!  119 |         get #foo() { return ""}
//!  120 |         get #foo() { return ""}
//!      :              ^^^
//!  121 |     }
//!  122 | 
//!  123 |     //OK
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[129:5]
//!  129 | // Error
//!  130 |     class A_Getter_StaticField {
//!  131 |         get #foo() { return ""}
//!  132 |         static #foo() { }
//!      :                 ^^^
//!  133 |     }
//!  134 | 
//!  135 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[135:5]
//!  135 | // Error
//!  136 |     class A_Getter_StaticMethod {
//!  137 |         get #foo() { return ""}
//!  138 |         static #foo() { }
//!      :                 ^^^
//!  139 |     }
//!  140 | 
//!  141 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[141:5]
//!  141 | // Error
//!  142 |     class A_Getter_StaticGetter {
//!  143 |         get #foo() { return ""}
//!  144 |         static get #foo() { return ""}
//!      :                     ^^^
//!  145 |     }
//!  146 | 
//!  147 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[147:5]
//!  147 | // Error
//!  148 |     class A_Getter_StaticSetter {
//!  149 |         get #foo() { return ""}
//!  150 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  151 |     }
//!  152 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[155:5]
//!  155 | // Error
//!  156 |     class A_Setter_Field {
//!  157 |         set #foo(value: string) { }
//!  158 |         #foo = "foo";
//!      :          ^^^
//!  159 |     }
//!  160 | 
//!  161 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[161:5]
//!  161 | // Error
//!  162 |     class A_Setter_Method {
//!  163 |         set #foo(value: string) { }
//!  164 |         #foo() { }
//!      :          ^^^
//!  165 |     }
//!  166 | 
//!  167 |     // OK
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[173:5]
//!  173 | // Error
//!  174 |     class A_Setter_Setter {
//!  175 |         set #foo(value: string) { }
//!  176 |         set #foo(value: string) { }
//!      :              ^^^
//!  177 |     }
//!  178 | 
//!  179 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[179:5]
//!  179 | // Error
//!  180 |     class A_Setter_StaticField {
//!  181 |         set #foo(value: string) { }
//!  182 |         static #foo = "foo";
//!      :                 ^^^
//!  183 |     }
//!  184 | 
//!  185 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[185:5]
//!  185 | // Error
//!  186 |     class A_Setter_StaticMethod {
//!  187 |         set #foo(value: string) { }
//!  188 |         static #foo() { }
//!      :                 ^^^
//!  189 |     }
//!  190 | 
//!  191 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[191:5]
//!  191 | // Error
//!  192 |     class A_Setter_StaticGetter {
//!  193 |         set #foo(value: string) { }
//!  194 |         static get #foo() { return ""}
//!      :                     ^^^
//!  195 |     }
//!  196 | 
//!  197 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[197:5]
//!  197 | // Error
//!  198 |     class A_Setter_StaticSetter {
//!  199 |         set #foo(value: string) { }
//!  200 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  201 |     }
//!  202 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[205:5]
//!  205 | // Error
//!  206 |     class A_StaticField_Field {
//!  207 |         static #foo = "foo";
//!  208 |         #foo = "foo";
//!      :          ^^^
//!  209 |     }
//!  210 | 
//!  211 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[211:5]
//!  211 | // Error
//!  212 |     class A_StaticField_Method {
//!  213 |         static #foo = "foo";
//!  214 |         #foo() { }
//!      :          ^^^
//!  215 |     }
//!  216 | 
//!  217 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[217:5]
//!  217 | // Error
//!  218 |     class A_StaticField_Getter {
//!  219 |         static #foo = "foo";
//!  220 |         get #foo() { return ""}
//!      :              ^^^
//!  221 |     }
//!  222 | 
//!  223 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[223:5]
//!  223 | // Error
//!  224 |     class A_StaticField_Setter {
//!  225 |         static #foo = "foo";
//!  226 |         set #foo(value: string) { }
//!      :              ^^^
//!  227 |     }
//!  228 | 
//!  229 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[229:5]
//!  229 | // Error
//!  230 |     class A_StaticField_StaticField {
//!  231 |         static #foo = "foo";
//!  232 |         static #foo = "foo";
//!      :                 ^^^
//!  233 |     }
//!  234 | 
//!  235 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[235:5]
//!  235 | // Error
//!  236 |     class A_StaticField_StaticMethod {
//!  237 |         static #foo = "foo";
//!  238 |         static #foo() { }
//!      :                 ^^^
//!  239 |     }
//!  240 | 
//!  241 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[241:5]
//!  241 | // Error
//!  242 |     class A_StaticField_StaticGetter {
//!  243 |         static #foo = "foo";
//!  244 |         static get #foo() { return ""}
//!      :                     ^^^
//!  245 |     }
//!  246 | 
//!  247 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[247:5]
//!  247 | // Error
//!  248 |     class A_StaticField_StaticSetter {
//!  249 |         static #foo = "foo";
//!  250 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  251 |     }
//!  252 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[255:5]
//!  255 | // Error
//!  256 |     class A_StaticMethod_Field {
//!  257 |         static #foo() { }
//!  258 |         #foo = "foo";
//!      :          ^^^
//!  259 |     }
//!  260 | 
//!  261 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[261:5]
//!  261 | // Error
//!  262 |     class A_StaticMethod_Method {
//!  263 |         static #foo() { }
//!  264 |         #foo() { }
//!      :          ^^^
//!  265 |     }
//!  266 | 
//!  267 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[267:5]
//!  267 | // Error
//!  268 |     class A_StaticMethod_Getter {
//!  269 |         static #foo() { }
//!  270 |         get #foo() { return ""}
//!      :              ^^^
//!  271 |     }
//!  272 | 
//!  273 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[273:5]
//!  273 | // Error
//!  274 |     class A_StaticMethod_Setter {
//!  275 |         static #foo() { }
//!  276 |         set #foo(value: string) { }
//!      :              ^^^
//!  277 |     }
//!  278 | 
//!  279 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[279:5]
//!  279 | // Error
//!  280 |     class A_StaticMethod_StaticField {
//!  281 |         static #foo() { }
//!  282 |         static #foo = "foo";
//!      :                 ^^^
//!  283 |     }
//!  284 | 
//!  285 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[285:5]
//!  285 | // Error
//!  286 |     class A_StaticMethod_StaticMethod {
//!  287 |         static #foo() { }
//!  288 |         static #foo() { }
//!      :                 ^^^
//!  289 |     }
//!  290 | 
//!  291 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[291:5]
//!  291 | // Error
//!  292 |     class A_StaticMethod_StaticGetter {
//!  293 |         static #foo() { }
//!  294 |         static get #foo() { return ""}
//!      :                     ^^^
//!  295 |     }
//!  296 | 
//!  297 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[297:5]
//!  297 | // Error
//!  298 |     class A_StaticMethod_StaticSetter {
//!  299 |         static #foo() { }
//!  300 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  301 |     }
//!  302 | }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[306:5]
//!  306 | // Error
//!  307 |     class A_StaticGetter_Field {
//!  308 |         static get #foo() { return ""}
//!  309 |         #foo = "foo";
//!      :          ^^^
//!  310 |     }
//!  311 | 
//!  312 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[312:5]
//!  312 | // Error
//!  313 |     class A_StaticGetter_Method {
//!  314 |         static get #foo() { return ""}
//!  315 |         #foo() { }
//!      :          ^^^
//!  316 |     }
//!  317 | 
//!  318 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[318:5]
//!  318 | // Error
//!  319 |     class A_StaticGetter_Getter {
//!  320 |         static get #foo() { return ""}
//!  321 |         get #foo() { return ""}
//!      :              ^^^
//!  322 |     }
//!  323 | 
//!  324 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[324:5]
//!  324 | // Error
//!  325 |     class A_StaticGetter_Setter {
//!  326 |         static get #foo() { return ""}
//!  327 |         set #foo(value: string) { }
//!      :              ^^^
//!  328 |     }
//!  329 | 
//!  330 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[330:5]
//!  330 | // Error
//!  331 |     class A_StaticGetter_StaticField {
//!  332 |         static get #foo() { return ""}
//!  333 |         static #foo() { }
//!      :                 ^^^
//!  334 |     }
//!  335 | 
//!  336 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[336:5]
//!  336 | // Error
//!  337 |     class A_StaticGetter_StaticMethod {
//!  338 |         static get #foo() { return ""}
//!  339 |         static #foo() { }
//!      :                 ^^^
//!  340 |     }
//!  341 | 
//!  342 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[342:5]
//!  342 | // Error
//!  343 |     class A_StaticGetter_StaticGetter {
//!  344 |         static get #foo() { return ""}
//!  345 |         static get #foo() { return ""}
//!      :                     ^^^
//!  346 |     }
//!  347 |     // OK
//!  348 |     class A_StaticGetter_StaticSetter {
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[355:5]
//!  355 | // Error
//!  356 |     class A_StaticSetter_Field {
//!  357 |         static set #foo(value: string) { }
//!  358 |         #foo = "foo";
//!      :          ^^^
//!  359 |     }
//!  360 | 
//!  361 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[361:5]
//!  361 | // Error
//!  362 |     class A_StaticSetter_Method {
//!  363 |         static set #foo(value: string) { }
//!  364 |         #foo() { }
//!      :          ^^^
//!  365 |     }
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[368:5]
//!  368 | // Error
//!  369 |     class A_StaticSetter_Getter {
//!  370 |         static set #foo(value: string) { }
//!  371 |         get #foo() { return ""}
//!      :              ^^^
//!  372 |     }
//!  373 | 
//!  374 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[374:5]
//!  374 | // Error
//!  375 |     class A_StaticSetter_Setter {
//!  376 |         static set #foo(value: string) { }
//!  377 |         set #foo(value: string) { }
//!      :              ^^^
//!  378 |     }
//!  379 | 
//!  380 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[380:5]
//!  380 | // Error
//!  381 |     class A_StaticSetter_StaticField {
//!  382 |         static set #foo(value: string) { }
//!  383 |         static #foo = "foo";
//!      :                 ^^^
//!  384 |     }
//!  385 | 
//!  386 |     // Error
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[386:5]
//!  386 | // Error
//!  387 |     class A_StaticSetter_StaticMethod {
//!  388 |         static set #foo(value: string) { }
//!  389 |         static #foo() { }
//!      :                 ^^^
//!  390 |     }
//!  391 | 
//!  392 |     // OK
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,-[398:5]
//!  398 | // Error
//!  399 |     class A_StaticSetter_StaticSetter {
//!  400 |         static set #foo(value: string) { }
//!  401 |         static set #foo(value: string) { }
//!      :                     ^^^
//!  402 |     }
//!  403 | }
//!      `----
