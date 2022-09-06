//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
//// [other.tsx]
import { dom as h } from "./renderer";
export var prerendered = h("h", null);
//// [othernoalias.tsx]
import { otherdom } from "./renderer";
export var prerendered2 = otherdom("h", null);
//// [reacty.tsx]
import React from "./renderer";
export var prerendered3 = React.createElement("h", null);
//// [index.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  3 | <h></h>
//!    :   ^
//!    `----
//! 
//!   x Unexpected token `/`. Expected jsx identifier
//!    ,----
//!  3 | <h></h>
//!    :     ^
//!    `----
