//// [tsxAttributeResolution14.tsx]
define([
    "require"
], function(require) {});
//// [react.d.ts]
define([
    "require"
], function(require) {});
//// [file.tsx]
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  8 | return <div>props.primaryText</div>
//!    :                               ^^^^^
//!    `----
