//! ES2022 syntax transformations.
//!
//! This module implements transformations for ECMAScript 2022 features:
//!
//! - **Class static blocks**: Transform static initialization blocks into
//!   property assignments
//!
//! # Examples
//!
//! ```ignore
//! // Input: Class static block
//! class C {
//!     static { this.x = 1; }
//! }
//!
//! // Output: Transformed to private static field
//! class C {
//!     static #_ = this.x = 1;
//! }
//! ```

mod class_static_block;
mod options;

pub use class_static_block::ClassStaticBlock;
pub use options::ES2022Options;

/// ES2022 transformer that combines all ES2022 feature transformations.
///
/// This struct holds individual transform passes and coordinates their
/// execution.
pub struct ES2022 {
    class_static_block: Option<ClassStaticBlock>,
}

impl ES2022 {
    /// Creates a new ES2022 transformer with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration options for ES2022 transformations
    ///
    /// # Example
    ///
    /// ```ignore
    /// use swc_ecma_transformer::es2022::{ES2022, ES2022Options};
    ///
    /// let options = ES2022Options {
    ///     class_static_block: true,
    /// };
    /// let transformer = ES2022::new(options);
    /// ```
    pub fn new(options: ES2022Options) -> Self {
        Self {
            class_static_block: if options.class_static_block {
                Some(ClassStaticBlock::new())
            } else {
                None
            },
        }
    }

    /// Returns a reference to the class static block transformer, if enabled.
    pub fn class_static_block(&self) -> Option<&ClassStaticBlock> {
        self.class_static_block.as_ref()
    }

    /// Returns a mutable reference to the class static block transformer, if
    /// enabled.
    pub fn class_static_block_mut(&mut self) -> Option<&mut ClassStaticBlock> {
        self.class_static_block.as_mut()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_es2022_creation_with_static_blocks() {
        let options = ES2022Options {
            class_static_block: true,
        };
        let transformer = ES2022::new(options);
        assert!(transformer.class_static_block().is_some());
    }

    #[test]
    fn test_es2022_creation_without_static_blocks() {
        let options = ES2022Options {
            class_static_block: false,
        };
        let transformer = ES2022::new(options);
        assert!(transformer.class_static_block().is_none());
    }
}
