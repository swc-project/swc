//! JSON superset transformation.
//!
//! ES2019 made JSON a syntactic superset of ECMAScript by allowing U+2028 (LINE
//! SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) in string literals.
//!
//! Note: This is typically handled during the lexing/parsing phase rather than
//! as an AST transformation. SWC's lexer already supports these characters
//! correctly when parsing ES2019+ code.
//!
//! This module exists for completeness and potential future string literal
//! transformations, but the actual handling is done by the parser.

use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// JSON superset transformation hook.
///
/// This is a no-op transformation as JSON superset support is handled by the
/// parser. The parser already correctly handles U+2028 and U+2029 characters in
/// string literals when parsing ES2019+ code.
pub struct JsonSuperset;

impl JsonSuperset {
    /// Creates a new `JsonSuperset` transformer.
    pub fn new() -> Self {
        Self
    }
}

impl Default for JsonSuperset {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for JsonSuperset {
    // This is intentionally a no-op. JSON superset support is handled by the
    // parser.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_json_superset_creation() {
        let _transform = JsonSuperset::new();
        // No-op transformation, just ensure it can be created
    }
}
