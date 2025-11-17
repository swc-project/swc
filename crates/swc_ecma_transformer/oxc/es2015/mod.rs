//! ES2015 (ES6) Syntax Transformations
//!
//! This module provides transformations for ES2015 (ECMAScript 2015 / ES6) syntax features
//! to ES5-compatible JavaScript. It is part of the SWC ECMAScript transformer, ported from
//! oxc_transformer.
//!
//! ## Supported Transformations
//!
//! ### Implemented
//!
//! - **Arrow Functions**: Transforms arrow functions to regular function expressions,
//!   preserving lexical `this` binding. The actual implementation is in
//!   [`crate::common::arrow_function_converter::ArrowFunctionConverter`].
//!
//! ### Planned
//!
//! - **Classes**: Transform ES2015 classes to ES5 prototype-based code
//! - **Destructuring**: Array and object destructuring
//! - **Template Literals**: Template string literals to concatenation
//! - **Block Scoping**: `let` and `const` to `var`
//! - **Spread Operator**: Spread syntax in arrays and calls
//! - **Default Parameters**: Function parameter defaults
//! - **Rest Parameters**: Rest parameter syntax
//! - **For-of Loops**: `for-of` to ES5 iteration
//! - **Computed Property Names**: Computed keys in object literals
//! - **Shorthand Properties**: Object literal shorthand syntax
//!
//! ## Architecture
//!
//! ES2015 transformations follow the Traverse pattern:
//! - Each feature is implemented as a separate module
//! - Features can be enabled/disabled via [`ES2015Options`]
//! - Common utilities are shared in `crate::common`
//! - Arrow function conversion is handled by the shared converter
//!
//! ## Examples
//!
//! ### Arrow Functions
//!
//! ```javascript
//! // Input
//! const fn = () => this.value;
//!
//! // Output
//! var _this = this;
//! const fn = function() { return _this.value; };
//! ```
//!
//! ## References
//!
//! - [ECMAScript 2015 Specification](https://262.ecma-international.org/6.0/)
//! - [oxc_transformer ES2015](https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer/src/es2015)
//! - [Babel Preset ES2015](https://babeljs.io/docs/en/babel-preset-es2015)

use oxc_traverse::Traverse;

use crate::{context::TransformCtx, state::TransformState};

mod arrow_functions;
mod options;

pub use arrow_functions::{ArrowFunctions, ArrowFunctionsOptions};
pub use options::ES2015Options;

/// ES2015 transformation pass.
///
/// This struct coordinates all ES2015 feature transformations. Currently, only
/// arrow functions are implemented. The actual arrow function transformation
/// logic is delegated to the shared [`crate::common::arrow_function_converter::ArrowFunctionConverter`]
/// which is used by multiple transformation passes.
///
/// # Note
///
/// Arrow functions are handled in the `common` transformer pass, which runs
/// before ES2015. This module exists primarily for configuration and future
/// ES2015 feature additions.
pub struct ES2015<'a, 'ctx> {
    #[expect(unused)]
    options: ES2015Options,

    // Plugins
    #[expect(unused)]
    arrow_functions: ArrowFunctions<'a, 'ctx>,
}

impl<'a, 'ctx> ES2015<'a, 'ctx> {
    /// Create a new ES2015 transformation pass with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration for ES2015 transformations
    /// * `ctx` - Transformation context containing shared state
    pub fn new(options: ES2015Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            arrow_functions: ArrowFunctions::new(options.arrow_function.unwrap_or_default(), ctx),
            options,
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2015<'a, '_> {
    // Note: Arrow function transformation is handled in the `common` pass,
    // which runs before ES2015 in the transformer pipeline.
    // See `crate::common::arrow_function_converter::ArrowFunctionConverter`
}
