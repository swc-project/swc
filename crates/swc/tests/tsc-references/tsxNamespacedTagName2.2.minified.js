//// [a.tsx]
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[3:1]
//!  1 | declare var React: any;
//!  2 | 
//!  3 | const a = <svg:path></svg:path>;
//!    :            ^^^^^^^^
//!  4 | const b = <svg : path></svg : path>;
//!  5 | const c = <A:foo></A:foo>;
//!  6 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[4:1]
//!  1 | declare var React: any;
//!  2 | 
//!  3 | const a = <svg:path></svg:path>;
//!  4 | const b = <svg : path></svg : path>;
//!    :            ^^^^^^^^^^
//!  5 | const c = <A:foo></A:foo>;
//!  6 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[5:1]
//!  2 | 
//!  3 | const a = <svg:path></svg:path>;
//!  4 | const b = <svg : path></svg : path>;
//!  5 | const c = <A:foo></A:foo>;
//!    :            ^^^^^
//!  6 | const d = <a:foo></a:foo>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[6:1]
//!  3 | const a = <svg:path></svg:path>;
//!  4 | const b = <svg : path></svg : path>;
//!  5 | const c = <A:foo></A:foo>;
//!  6 | const d = <a:foo></a:foo>;
//!    :            ^^^^^
//!    `----
