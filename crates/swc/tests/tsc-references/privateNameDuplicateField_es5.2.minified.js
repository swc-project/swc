//!
//!  x duplicate private name #foo.
//!   ,----
//! 9 | #foo = "foo";
//!   :  ^^^
//!   `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 15 | #foo() { }
//!    :  ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 21 | get #foo() { return ""}
//!    :      ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 27 | set #foo(value: string) { }
//!    :      ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 33 | static #foo = "foo";
//!    :         ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 39 | static #foo() { }
//!    :         ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 45 | static get #foo() { return ""}
//!    :             ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 51 | static set #foo(value: string) { }
//!    :             ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 59 | #foo = "foo";
//!    :  ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 65 | #foo() { }
//!    :  ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 71 | get #foo() { return ""}
//!    :      ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 77 | set #foo(value: string) { }
//!    :      ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 83 | static #foo = "foo";
//!    :         ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 89 | static #foo() { }
//!    :         ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!    ,----
//! 95 | static get #foo() { return ""}
//!    :             ^^^
//!    `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 101 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 110 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 116 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 122 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 134 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 140 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 146 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 152 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 160 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 166 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 178 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 184 | static #foo = "foo";
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 190 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 196 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 202 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 210 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 216 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 222 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 228 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 234 | static #foo = "foo";
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 240 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 246 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 252 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 260 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 266 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 272 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 278 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 284 | static #foo = "foo";
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 290 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 296 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 302 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 311 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 317 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 323 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 329 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 335 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 341 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 347 | static get #foo() { return ""}
//!     :             ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 360 | #foo = "foo";
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 366 | #foo() { }
//!     :  ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 373 | get #foo() { return ""}
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 379 | set #foo(value: string) { }
//!     :      ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 385 | static #foo = "foo";
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 391 | static #foo() { }
//!     :         ^^^
//!     `----
//!
//!  x duplicate private name #foo.
//!     ,----
//! 403 | static set #foo(value: string) { }
//!     :             ^^^
//!     `----
