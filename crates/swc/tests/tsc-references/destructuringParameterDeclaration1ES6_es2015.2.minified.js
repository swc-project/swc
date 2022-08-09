//!
//!  x the name `number` is bound more than once in this parameter list
//!    ,----
//! 97 | function e6({x: [number, number, number]}) { }  // error, duplicate identifier;
//!    :                  ^^^|^^  ^^^|^^
//!    :                     |       `-- used as parameter more than once
//!    :                     `-- previous definition here
//!    `----
//!
//!  x the name `number` is bound more than once in this parameter list
//!    ,----
//! 97 | function e6({x: [number, number, number]}) { }  // error, duplicate identifier;
//!    :                          ^^^|^^  ^^^|^^
//!    :                             |       `-- used as parameter more than once
//!    :                             `-- previous definition here
//!    `----
