//// [privateNameDuplicateField.ts]
//! 
//!   x duplicate private name #foo.
//!    ,----
//!  7 | #foo = "foo";
//!    :  ^^^
//!    `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  13 | #foo() { }
//!     :  ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  19 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  25 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  31 | static #foo = "foo";
//!     :         ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  37 | static #foo() { }
//!     :         ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  43 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  49 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  57 | #foo = "foo";
//!     :  ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  63 | #foo() { }
//!     :  ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  69 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  75 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  81 | static #foo = "foo";
//!     :         ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  87 | static #foo() { }
//!     :         ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  93 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!     ,----
//!  99 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  108 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  114 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  120 | get #foo() { return ""}
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  132 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  138 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  144 | static get #foo() { return ""}
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  150 | static set #foo(value: string) { }
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  158 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  164 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  176 | set #foo(value: string) { }
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  182 | static #foo = "foo";
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  188 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  194 | static get #foo() { return ""}
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  200 | static set #foo(value: string) { }
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  208 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  214 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  220 | get #foo() { return ""}
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  226 | set #foo(value: string) { }
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  232 | static #foo = "foo";
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  238 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  244 | static get #foo() { return ""}
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  250 | static set #foo(value: string) { }
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  258 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  264 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  270 | get #foo() { return ""}
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  276 | set #foo(value: string) { }
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  282 | static #foo = "foo";
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  288 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  294 | static get #foo() { return ""}
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  300 | static set #foo(value: string) { }
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  309 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  315 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  321 | get #foo() { return ""}
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  327 | set #foo(value: string) { }
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  333 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  339 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  345 | static get #foo() { return ""}
//!      :             ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  358 | #foo = "foo";
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  364 | #foo() { }
//!      :  ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  371 | get #foo() { return ""}
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  377 | set #foo(value: string) { }
//!      :      ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  383 | static #foo = "foo";
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  389 | static #foo() { }
//!      :         ^^^
//!      `----
//! 
//!   x duplicate private name #foo.
//!      ,----
//!  401 | static set #foo(value: string) { }
//!      :             ^^^
//!      `----
