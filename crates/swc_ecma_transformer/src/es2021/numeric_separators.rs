//! ES2021 numeric separators transformation.
//!
//! This module removes numeric separators (underscores) from numeric literals,
//! converting them to their equivalent values without separators.
//!
//! ## Transformations
//!
//! ```js
//! 1_000_000        // becomes 1000000
//! 0.000_001        // becomes 0.000001
//! 0b1010_0001      // becomes 0b10100001
//! 0o755_123        // becomes 0o755123
//! 0xDEAD_BEEF      // becomes 0xDEADBEEF
//! 1_000n           // becomes 1000n (BigInt)
//! ```
//!
//! ## Implementation Details
//!
//! Numeric separators are purely syntactic and have no semantic meaning.
//! They are simply removed from the numeric literal representation.
//!
//! ## References
//! - TC39 proposal: https://github.com/tc39/proposal-numeric-separator
//! - MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_separators

use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TransformCtx;

/// Transformer for numeric separators.
pub struct NumericSeparators;

impl NumericSeparators {
    /// Creates a new numeric separators transformer.
    pub fn new() -> Self {
        Self
    }

    /// Removes underscores from a numeric string.
    fn remove_separators(&self, value: &str) -> String {
        value.replace('_', "")
    }
}

impl Default for NumericSeparators {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for NumericSeparators {
    /// Transforms numeric literals by removing underscores.
    fn enter_number(&mut self, node: &mut Number, _ctx: &mut TransformCtx) {
        // Check if the raw value contains underscores
        if let Some(raw) = &node.raw {
            if raw.contains('_') {
                // Remove underscores from the raw value
                let cleaned = self.remove_separators(raw);
                node.raw = Some(Atom::new(cleaned));
            }
        }
    }

    /// Transforms BigInt literals by removing underscores.
    fn enter_big_int(&mut self, node: &mut BigInt, _ctx: &mut TransformCtx) {
        // Check if the value contains underscores
        if node.value.to_string().contains('_') {
            // Remove underscores from the value
            let cleaned = self.remove_separators(&node.value.to_string());
            // Update the BigInt value
            // Note: We need to parse the cleaned string back to a BigInt
            if let Ok(parsed) = cleaned.parse::<num_bigint::BigInt>() {
                node.value = Box::new(parsed);
            }
        }

        // Also clean the raw value if present
        if let Some(raw) = &node.raw {
            if raw.contains('_') {
                let cleaned = self.remove_separators(raw);
                node.raw = Some(Atom::new(cleaned));
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap, DUMMY_SP};

    use super::*;

    fn create_test_ctx() -> TransformCtx {
        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file =
            source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "const x = 1;".to_string());
        let handler = Lrc::new(Handler::with_emitter_writer(
            Box::new(io::sink()),
            Some(source_map_lrc.clone()),
        ));

        TransformCtx::new(
            PathBuf::from("test.js"),
            Arc::new(source_file.src.to_string()),
            source_map_lrc,
            handler,
        )
    }

    #[test]
    fn test_remove_separators_decimal() {
        let transformer = NumericSeparators::new();
        assert_eq!(transformer.remove_separators("1_000_000"), "1000000");
        assert_eq!(transformer.remove_separators("0.000_001"), "0.000001");
    }

    #[test]
    fn test_remove_separators_binary() {
        let transformer = NumericSeparators::new();
        assert_eq!(transformer.remove_separators("0b1010_0001"), "0b10100001");
    }

    #[test]
    fn test_remove_separators_octal() {
        let transformer = NumericSeparators::new();
        assert_eq!(transformer.remove_separators("0o755_123"), "0o755123");
    }

    #[test]
    fn test_remove_separators_hex() {
        let transformer = NumericSeparators::new();
        assert_eq!(transformer.remove_separators("0xDEAD_BEEF"), "0xDEADBEEF");
    }

    #[test]
    fn test_transform_number_with_separator() {
        let mut transformer = NumericSeparators::new();
        let mut ctx = create_test_ctx();

        let mut number = Number {
            span: DUMMY_SP,
            value: 1000000.0,
            raw: Some(Atom::new("1_000_000")),
        };

        transformer.enter_number(&mut number, &mut ctx);

        assert_eq!(number.raw, Some(Atom::new("1000000")));
    }

    #[test]
    fn test_transform_number_without_separator() {
        let mut transformer = NumericSeparators::new();
        let mut ctx = create_test_ctx();

        let mut number = Number {
            span: DUMMY_SP,
            value: 1000000.0,
            raw: Some(Atom::new("1000000")),
        };

        transformer.enter_number(&mut number, &mut ctx);

        // Should remain unchanged
        assert_eq!(number.raw, Some(Atom::new("1000000")));
    }

    #[test]
    fn test_transform_bigint_with_separator() {
        let mut transformer = NumericSeparators::new();
        let mut ctx = create_test_ctx();

        let mut bigint = BigInt {
            span: DUMMY_SP,
            value: Box::new(num_bigint::BigInt::from(1000)),
            raw: Some(Atom::new("1_000n")),
        };

        transformer.enter_big_int(&mut bigint, &mut ctx);

        assert_eq!(bigint.raw, Some(Atom::new("1000n")));
    }
}
