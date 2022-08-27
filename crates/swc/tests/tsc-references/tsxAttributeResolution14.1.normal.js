//// [tsxAttributeResolution14.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  8 | return <div>props.primaryText</div>
//!    :                               ^^^^^
//!    `----
