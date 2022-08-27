//// [component.d.ts]
import * as React from "react";
//// [file.jsx]
//! 
//!   x Expected '>', got 'a'
//!    ,----
//!  4 | let x = <MyComp<Prop> a={10} b="hi" />; // error, no type arguments in js
//!    :                       ^
//!    `----
