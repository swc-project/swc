//// [privateNameDuplicateField.ts]
//!   x duplicate private name #foo.
//!     ,-[7:1]
//!   4 |     // Error
//!   5 |     class A_Field_Field {
//!   6 |         #foo = "foo";
//!   7 |         #foo = "foo";
//!     :         ^^^^
//!   8 |     }
//!   9 | 
//!  10 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[13:1]
//!  10 |     // Error
//!  11 |     class A_Field_Method {
//!  12 |         #foo = "foo";
//!  13 |         #foo() { }
//!     :         ^^^^
//!  14 |     }
//!  15 | 
//!  16 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[19:1]
//!  16 |     // Error
//!  17 |     class A_Field_Getter {
//!  18 |         #foo = "foo";
//!  19 |         get #foo() { return ""}
//!     :             ^^^^
//!  20 |     }
//!  21 | 
//!  22 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[25:1]
//!  22 |     // Error
//!  23 |     class A_Field_Setter {
//!  24 |         #foo = "foo";
//!  25 |         set #foo(value: string) { }
//!     :             ^^^^
//!  26 |     }
//!  27 | 
//!  28 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[31:1]
//!  28 |     // Error
//!  29 |     class A_Field_StaticField {
//!  30 |         #foo = "foo";
//!  31 |         static #foo = "foo";
//!     :                ^^^^
//!  32 |     }
//!  33 | 
//!  34 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[37:1]
//!  34 |     // Error
//!  35 |     class A_Field_StaticMethod {
//!  36 |         #foo = "foo";
//!  37 |         static #foo() { }
//!     :                ^^^^
//!  38 |     }
//!  39 | 
//!  40 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[43:1]
//!  40 |     // Error
//!  41 |     class A_Field_StaticGetter {
//!  42 |         #foo = "foo";
//!  43 |         static get #foo() { return ""}
//!     :                    ^^^^
//!  44 |     }
//!  45 | 
//!  46 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[49:1]
//!  46 |     // Error
//!  47 |     class A_Field_StaticSetter {
//!  48 |         #foo = "foo";
//!  49 |         static set #foo(value: string) { }
//!     :                    ^^^^
//!  50 |     }
//!  51 | }
//!     `----
//!   x duplicate private name #foo.
//!     ,-[57:1]
//!  54 |     // Error
//!  55 |     class A_Method_Field {
//!  56 |         #foo() { }
//!  57 |         #foo = "foo";
//!     :         ^^^^
//!  58 |     }
//!  59 | 
//!  60 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[63:1]
//!  60 |     // Error
//!  61 |     class A_Method_Method {
//!  62 |         #foo() { }
//!  63 |         #foo() { }
//!     :         ^^^^
//!  64 |     }
//!  65 | 
//!  66 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[69:1]
//!  66 |     // Error
//!  67 |     class A_Method_Getter {
//!  68 |         #foo() { }
//!  69 |         get #foo() { return ""}
//!     :             ^^^^
//!  70 |     }
//!  71 | 
//!  72 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[75:1]
//!  72 |     // Error
//!  73 |     class A_Method_Setter {
//!  74 |         #foo() { }
//!  75 |         set #foo(value: string) { }
//!     :             ^^^^
//!  76 |     }
//!  77 | 
//!  78 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[81:1]
//!  78 |     // Error
//!  79 |     class A_Method_StaticField {
//!  80 |         #foo() { }
//!  81 |         static #foo = "foo";
//!     :                ^^^^
//!  82 |     }
//!  83 | 
//!  84 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[87:1]
//!  84 |     // Error
//!  85 |     class A_Method_StaticMethod {
//!  86 |         #foo() { }
//!  87 |         static #foo() { }
//!     :                ^^^^
//!  88 |     }
//!  89 | 
//!  90 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!     ,-[93:1]
//!  90 |     // Error
//!  91 |     class A_Method_StaticGetter {
//!  92 |         #foo() { }
//!  93 |         static get #foo() { return ""}
//!     :                    ^^^^
//!  94 |     }
//!  95 | 
//!  96 |     // Error
//!     `----
//!   x duplicate private name #foo.
//!      ,-[99:1]
//!   96 |     // Error
//!   97 |     class A_Method_StaticSetter {
//!   98 |         #foo() { }
//!   99 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  100 |     }
//!  101 | }
//!      `----
//!   x duplicate private name #foo.
//!      ,-[108:1]
//!  105 |     // Error
//!  106 |     class A_Getter_Field {
//!  107 |         get #foo() { return ""}
//!  108 |         #foo = "foo";
//!      :         ^^^^
//!  109 |     }
//!  110 | 
//!  111 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[114:1]
//!  111 |     // Error
//!  112 |     class A_Getter_Method {
//!  113 |         get #foo() { return ""}
//!  114 |         #foo() { }
//!      :         ^^^^
//!  115 |     }
//!  116 | 
//!  117 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[120:1]
//!  117 |     // Error
//!  118 |     class A_Getter_Getter {
//!  119 |         get #foo() { return ""}
//!  120 |         get #foo() { return ""}
//!      :             ^^^^
//!  121 |     }
//!  122 | 
//!  123 |     //OK
//!      `----
//!   x duplicate private name #foo.
//!      ,-[132:1]
//!  129 |     // Error
//!  130 |     class A_Getter_StaticField {
//!  131 |         get #foo() { return ""}
//!  132 |         static #foo() { }
//!      :                ^^^^
//!  133 |     }
//!  134 | 
//!  135 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[138:1]
//!  135 |     // Error
//!  136 |     class A_Getter_StaticMethod {
//!  137 |         get #foo() { return ""}
//!  138 |         static #foo() { }
//!      :                ^^^^
//!  139 |     }
//!  140 | 
//!  141 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[144:1]
//!  141 |     // Error
//!  142 |     class A_Getter_StaticGetter {
//!  143 |         get #foo() { return ""}
//!  144 |         static get #foo() { return ""}
//!      :                    ^^^^
//!  145 |     }
//!  146 | 
//!  147 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[150:1]
//!  147 |     // Error
//!  148 |     class A_Getter_StaticSetter {
//!  149 |         get #foo() { return ""}
//!  150 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  151 |     }
//!  152 | }
//!      `----
//!   x duplicate private name #foo.
//!      ,-[158:1]
//!  155 |     // Error
//!  156 |     class A_Setter_Field {
//!  157 |         set #foo(value: string) { }
//!  158 |         #foo = "foo";
//!      :         ^^^^
//!  159 |     }
//!  160 | 
//!  161 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[164:1]
//!  161 |     // Error
//!  162 |     class A_Setter_Method {
//!  163 |         set #foo(value: string) { }
//!  164 |         #foo() { }
//!      :         ^^^^
//!  165 |     }
//!  166 | 
//!  167 |     // OK
//!      `----
//!   x duplicate private name #foo.
//!      ,-[176:1]
//!  173 |     // Error
//!  174 |     class A_Setter_Setter {
//!  175 |         set #foo(value: string) { }
//!  176 |         set #foo(value: string) { }
//!      :             ^^^^
//!  177 |     }
//!  178 | 
//!  179 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[182:1]
//!  179 |     // Error
//!  180 |     class A_Setter_StaticField {
//!  181 |         set #foo(value: string) { }
//!  182 |         static #foo = "foo";
//!      :                ^^^^
//!  183 |     }
//!  184 | 
//!  185 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[188:1]
//!  185 |     // Error
//!  186 |     class A_Setter_StaticMethod {
//!  187 |         set #foo(value: string) { }
//!  188 |         static #foo() { }
//!      :                ^^^^
//!  189 |     }
//!  190 | 
//!  191 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[194:1]
//!  191 |     // Error
//!  192 |     class A_Setter_StaticGetter {
//!  193 |         set #foo(value: string) { }
//!  194 |         static get #foo() { return ""}
//!      :                    ^^^^
//!  195 |     }
//!  196 | 
//!  197 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[200:1]
//!  197 |     // Error
//!  198 |     class A_Setter_StaticSetter {
//!  199 |         set #foo(value: string) { }
//!  200 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  201 |     }
//!  202 | }
//!      `----
//!   x duplicate private name #foo.
//!      ,-[208:1]
//!  205 |     // Error
//!  206 |     class A_StaticField_Field {
//!  207 |         static #foo = "foo";
//!  208 |         #foo = "foo";
//!      :         ^^^^
//!  209 |     }
//!  210 | 
//!  211 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[214:1]
//!  211 |     // Error
//!  212 |     class A_StaticField_Method {
//!  213 |         static #foo = "foo";
//!  214 |         #foo() { }
//!      :         ^^^^
//!  215 |     }
//!  216 | 
//!  217 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[220:1]
//!  217 |     // Error
//!  218 |     class A_StaticField_Getter {
//!  219 |         static #foo = "foo";
//!  220 |         get #foo() { return ""}
//!      :             ^^^^
//!  221 |     }
//!  222 | 
//!  223 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[226:1]
//!  223 |     // Error
//!  224 |     class A_StaticField_Setter {
//!  225 |         static #foo = "foo";
//!  226 |         set #foo(value: string) { }
//!      :             ^^^^
//!  227 |     }
//!  228 | 
//!  229 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[232:1]
//!  229 |     // Error
//!  230 |     class A_StaticField_StaticField {
//!  231 |         static #foo = "foo";
//!  232 |         static #foo = "foo";
//!      :                ^^^^
//!  233 |     }
//!  234 | 
//!  235 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[238:1]
//!  235 |     // Error
//!  236 |     class A_StaticField_StaticMethod {
//!  237 |         static #foo = "foo";
//!  238 |         static #foo() { }
//!      :                ^^^^
//!  239 |     }
//!  240 | 
//!  241 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[244:1]
//!  241 |     // Error
//!  242 |     class A_StaticField_StaticGetter {
//!  243 |         static #foo = "foo";
//!  244 |         static get #foo() { return ""}
//!      :                    ^^^^
//!  245 |     }
//!  246 | 
//!  247 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[250:1]
//!  247 |     // Error
//!  248 |     class A_StaticField_StaticSetter {
//!  249 |         static #foo = "foo";
//!  250 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  251 |     }
//!  252 | }
//!      `----
//!   x duplicate private name #foo.
//!      ,-[258:1]
//!  255 |     // Error
//!  256 |     class A_StaticMethod_Field {
//!  257 |         static #foo() { }
//!  258 |         #foo = "foo";
//!      :         ^^^^
//!  259 |     }
//!  260 | 
//!  261 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[264:1]
//!  261 |     // Error
//!  262 |     class A_StaticMethod_Method {
//!  263 |         static #foo() { }
//!  264 |         #foo() { }
//!      :         ^^^^
//!  265 |     }
//!  266 | 
//!  267 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[270:1]
//!  267 |     // Error
//!  268 |     class A_StaticMethod_Getter {
//!  269 |         static #foo() { }
//!  270 |         get #foo() { return ""}
//!      :             ^^^^
//!  271 |     }
//!  272 | 
//!  273 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[276:1]
//!  273 |     // Error
//!  274 |     class A_StaticMethod_Setter {
//!  275 |         static #foo() { }
//!  276 |         set #foo(value: string) { }
//!      :             ^^^^
//!  277 |     }
//!  278 | 
//!  279 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[282:1]
//!  279 |     // Error
//!  280 |     class A_StaticMethod_StaticField {
//!  281 |         static #foo() { }
//!  282 |         static #foo = "foo";
//!      :                ^^^^
//!  283 |     }
//!  284 | 
//!  285 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[288:1]
//!  285 |     // Error
//!  286 |     class A_StaticMethod_StaticMethod {
//!  287 |         static #foo() { }
//!  288 |         static #foo() { }
//!      :                ^^^^
//!  289 |     }
//!  290 | 
//!  291 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[294:1]
//!  291 |     // Error
//!  292 |     class A_StaticMethod_StaticGetter {
//!  293 |         static #foo() { }
//!  294 |         static get #foo() { return ""}
//!      :                    ^^^^
//!  295 |     }
//!  296 | 
//!  297 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[300:1]
//!  297 |     // Error
//!  298 |     class A_StaticMethod_StaticSetter {
//!  299 |         static #foo() { }
//!  300 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  301 |     }
//!  302 | }
//!      `----
//!   x duplicate private name #foo.
//!      ,-[309:1]
//!  306 |     // Error
//!  307 |     class A_StaticGetter_Field {
//!  308 |         static get #foo() { return ""}
//!  309 |         #foo = "foo";
//!      :         ^^^^
//!  310 |     }
//!  311 | 
//!  312 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[315:1]
//!  312 |     // Error
//!  313 |     class A_StaticGetter_Method {
//!  314 |         static get #foo() { return ""}
//!  315 |         #foo() { }
//!      :         ^^^^
//!  316 |     }
//!  317 | 
//!  318 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[321:1]
//!  318 |     // Error
//!  319 |     class A_StaticGetter_Getter {
//!  320 |         static get #foo() { return ""}
//!  321 |         get #foo() { return ""}
//!      :             ^^^^
//!  322 |     }
//!  323 | 
//!  324 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[327:1]
//!  324 |     // Error
//!  325 |     class A_StaticGetter_Setter {
//!  326 |         static get #foo() { return ""}
//!  327 |         set #foo(value: string) { }
//!      :             ^^^^
//!  328 |     }
//!  329 | 
//!  330 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[333:1]
//!  330 |     // Error
//!  331 |     class A_StaticGetter_StaticField {
//!  332 |         static get #foo() { return ""}
//!  333 |         static #foo() { }
//!      :                ^^^^
//!  334 |     }
//!  335 | 
//!  336 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[339:1]
//!  336 |     // Error
//!  337 |     class A_StaticGetter_StaticMethod {
//!  338 |         static get #foo() { return ""}
//!  339 |         static #foo() { }
//!      :                ^^^^
//!  340 |     }
//!  341 | 
//!  342 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[345:1]
//!  342 |     // Error
//!  343 |     class A_StaticGetter_StaticGetter {
//!  344 |         static get #foo() { return ""}
//!  345 |         static get #foo() { return ""}
//!      :                    ^^^^
//!  346 |     }
//!  347 |     // OK
//!  348 |     class A_StaticGetter_StaticSetter {
//!      `----
//!   x duplicate private name #foo.
//!      ,-[358:1]
//!  355 |     // Error
//!  356 |     class A_StaticSetter_Field {
//!  357 |         static set #foo(value: string) { }
//!  358 |         #foo = "foo";
//!      :         ^^^^
//!  359 |     }
//!  360 | 
//!  361 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[364:1]
//!  361 |     // Error
//!  362 |     class A_StaticSetter_Method {
//!  363 |         static set #foo(value: string) { }
//!  364 |         #foo() { }
//!      :         ^^^^
//!  365 |     }
//!  366 | 
//!      `----
//!   x duplicate private name #foo.
//!      ,-[371:1]
//!  368 |     // Error
//!  369 |     class A_StaticSetter_Getter {
//!  370 |         static set #foo(value: string) { }
//!  371 |         get #foo() { return ""}
//!      :             ^^^^
//!  372 |     }
//!  373 | 
//!  374 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[377:1]
//!  374 |     // Error
//!  375 |     class A_StaticSetter_Setter {
//!  376 |         static set #foo(value: string) { }
//!  377 |         set #foo(value: string) { }
//!      :             ^^^^
//!  378 |     }
//!  379 | 
//!  380 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[383:1]
//!  380 |     // Error
//!  381 |     class A_StaticSetter_StaticField {
//!  382 |         static set #foo(value: string) { }
//!  383 |         static #foo = "foo";
//!      :                ^^^^
//!  384 |     }
//!  385 | 
//!  386 |     // Error
//!      `----
//!   x duplicate private name #foo.
//!      ,-[389:1]
//!  386 |     // Error
//!  387 |     class A_StaticSetter_StaticMethod {
//!  388 |         static set #foo(value: string) { }
//!  389 |         static #foo() { }
//!      :                ^^^^
//!  390 |     }
//!  391 | 
//!  392 |     // OK
//!      `----
//!   x duplicate private name #foo.
//!      ,-[401:1]
//!  398 |     // Error
//!  399 |     class A_StaticSetter_StaticSetter {
//!  400 |         static set #foo(value: string) { }
//!  401 |         static set #foo(value: string) { }
//!      :                    ^^^^
//!  402 |     }
//!  403 | }
//!      `----
