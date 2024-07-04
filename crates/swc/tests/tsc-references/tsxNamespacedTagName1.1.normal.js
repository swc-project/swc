//// [a.tsx]
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[2:1]
//!  1 | 
//!  2 | const a = <svg:path></svg:path>;
//!    :            ^^^^^^^^
//!  3 | const b = <svg : path></svg : path>;
//!  4 | const c = <A:foo></A:foo>;
//!  5 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[3:1]
//!  1 | 
//!  2 | const a = <svg:path></svg:path>;
//!  3 | const b = <svg : path></svg : path>;
//!    :            ^^^^^^^^^^
//!  4 | const c = <A:foo></A:foo>;
//!  5 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[4:1]
//!  1 | 
//!  2 | const a = <svg:path></svg:path>;
//!  3 | const b = <svg : path></svg : path>;
//!  4 | const c = <A:foo></A:foo>;
//!    :            ^^^^^
//!  5 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[5:1]
//!  2 | const a = <svg:path></svg:path>;
//!  3 | const b = <svg : path></svg : path>;
//!  4 | const c = <A:foo></A:foo>;
//!  5 | const d = <a:foo></a:foo>;
//!    :            ^^^^^
//!    `----
