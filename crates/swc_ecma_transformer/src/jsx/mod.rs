//! JSX transformation module.
//!
//! This module provides JSX to JavaScript transformations, supporting both
//! classic and automatic runtimes. It implements the VisitMutHook pattern
//! for composable transformations.
//!
//! # Runtimes
//!
//! ## Classic Runtime
//! Transforms JSX to `React.createElement()` calls:
//! ```jsx
//! <div className="hello">World</div>
//! // becomes:
//! React.createElement("div", { className: "hello" }, "World")
//! ```
//!
//! ## Automatic Runtime
//! Transforms JSX to `_jsx()` and `_jsxs()` calls:
//! ```jsx
//! <div className="hello">World</div>
//! // becomes:
//! import { jsx as _jsx } from "react/jsx-runtime";
//! _jsx("div", { className: "hello", children: "World" })
//! ```

mod options;
mod runtime;
mod transform;

#[cfg(test)]
mod tests;

pub use options::JsxOptions;
pub use runtime::Runtime;
pub use transform::JsxTransform;
