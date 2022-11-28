//// [file.tsx]
//! 
//!   x Unexpected token `a`. Expected jsx identifier
//!     ,-[9:1]
//!   9 | }
//!  10 | const Compa = (x: {x: number}) => <div>{"" + x}</div>;
//!  11 | 
//!  12 | let a = <\u0061></a>; // works
//!     :          ^^^^^^
//!  13 | let ab = <\u0061-b></a-b>; // works
//!  14 | let ac = <a-\u0063></a-c>; // works
//!  15 | let compa = <Comp\u0061 x={12} />; // works
//!     `----
