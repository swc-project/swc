//! ES2020: Export Namespace From
//!
//! This plugin transforms `export * as ns from "mod"` to `import * as _ns from
//! "mod"; export { _ns as ns }`.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! export * as ns from "mod";
//! ```
//!
//! Output:
//! ```js
//! import * as _ns from "mod";
//! export { _ns as ns };
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-export-namespace-from](https://babeljs.io/docs/babel-plugin-transform-export-namespace-from).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.28.4/packages/babel-plugin-transform-export-namespace-from>
//! * "export ns from" TC39 proposal: <https://github.com/tc39/proposal-export-ns-from>

use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

pub struct ExportNamespaceFrom;

impl ExportNamespaceFrom {
    pub fn new() -> Self {
        Self
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ExportNamespaceFrom {
    // TODO: Implement transformation when SWC infrastructure is ready
    // This will transform `export * as ns from "mod"` to import/export pair
}
