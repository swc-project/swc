//// [file.tsx]
//!   x Unknown regular expression flags.
//!    ,-[5:1]
//!  2 | import React = require('react');
//!  3 | 
//!  4 | // OK
//!  5 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!    :                            ^^^^^^^^^^^^^^^^^^^^
//!  6 | let k2 = <div> <h2> Hello </h2> {(user: any) => <h2>{user.name}</h2>}</div>;
//!  7 | let k3 = <div> {1} {"That is a number"} </div>;
//!    `----
//!   x Unknown regular expression flags.
//!    ,-[6:1]
//!  3 | 
//!  4 | // OK
//!  5 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!  6 | let k2 = <div> <h2> Hello </h2> {(user: any) => <h2>{user.name}</h2>}</div>;
//!    :                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  7 | let k3 = <div> {1} {"That is a number"} </div>;
//!    `----
