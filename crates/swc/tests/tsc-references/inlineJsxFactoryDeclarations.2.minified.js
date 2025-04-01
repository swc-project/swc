//// [renderer.d.ts]
export { dom as default };
//// [otherreacty.tsx]
import * as React from "./renderer";
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
//!   x Expression expected
//!    ,-[3:1]
//!  1 | /** @jsx dom */
//!  2 | import { dom } from "./renderer"
//!  3 | <h></h>
//!    :   ^
//!  4 | export * from "./other";
//!  5 | export * from "./othernoalias";
//!  6 | export * from "./reacty";
//!    `----
//!   x Unexpected token `/`. Expected jsx identifier
//!    ,-[3:1]
//!  1 | /** @jsx dom */
//!  2 | import { dom } from "./renderer"
//!  3 | <h></h>
//!    :     ^
//!  4 | export * from "./other";
//!  5 | export * from "./othernoalias";
//!  6 | export * from "./reacty";
//!    `----
