//// [file.tsx]
//!   x Unknown regular expression flags.
//!     ,-[19:1]
//!  16 | }
//!  17 | 
//!  18 | // OK
//!  19 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!     :                            ^^^^^^^^^^^^^^^^^^^^
//!  20 | let k2 = <div> <h2> Hello </h2> {(user: any) => <h2>{user.name}</h2>}</div>;
//!  21 | let k3 = <div> {1} {"That is a number"} </div>;
//!  22 | let k4 = <Button> <h2> Hello </h2> </Button>;
//!     `----
//!   x Unknown regular expression flags.
//!     ,-[20:1]
//!  17 | 
//!  18 | // OK
//!  19 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!  20 | let k2 = <div> <h2> Hello </h2> {(user: any) => <h2>{user.name}</h2>}</div>;
//!     :                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  21 | let k3 = <div> {1} {"That is a number"} </div>;
//!  22 | let k4 = <Button> <h2> Hello </h2> </Button>;
//!     `----
//!   x Unknown regular expression flags.
//!     ,-[22:1]
//!  19 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!  20 | let k2 = <div> <h2> Hello </h2> {(user: any) => <h2>{user.name}</h2>}</div>;
//!  21 | let k3 = <div> {1} {"That is a number"} </div>;
//!  22 | let k4 = <Button> <h2> Hello </h2> </Button>;
//!     :                               ^^^^^^^^^^^^^
//!     `----
