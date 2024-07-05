//// [a.tsx]
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[2:1]
//!  1 | 
//!  2 | const a = <svg:path a:b={1}></svg:path>;
//!    :            ^^^^^^^^
//!  3 | const b = <svg : path a:b={1}></svg : path>;
//!    `----
//!   x JSX Namespace is disabled by default because react does not support it yet. You can specify jsc.transform.react.throwIfNamespace to false to override default behavior
//!    ,-[3:1]
//!  1 | 
//!  2 | const a = <svg:path a:b={1}></svg:path>;
//!  3 | const b = <svg : path a:b={1}></svg : path>;
//!    :            ^^^^^^^^^^
//!    `----
