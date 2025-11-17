//! Configuration options for TypeScript transformations.

/// Options controlling TypeScript transformation behavior.
///
/// These options determine which TypeScript-specific transformations
/// are enabled during the transformation process.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TypeScriptOptions {
    /// Strip type annotations from the output.
    ///
    /// When enabled, removes:
    /// - Type annotations on variables, parameters, and return types
    /// - Interface declarations
    /// - Type alias declarations
    /// - Type-only imports and exports
    /// - Type assertions and type casts
    pub strip_annotations: bool,

    /// Transform TypeScript enums to JavaScript objects.
    ///
    /// Converts enum declarations into IIFE patterns that create
    /// bidirectional mappings between enum members and their values.
    pub transform_enums: bool,

    /// Transform TypeScript namespaces to IIFEs.
    ///
    /// Converts namespace declarations into immediately-invoked
    /// function expressions to maintain isolation and exports.
    pub transform_namespaces: bool,

    /// Transform parameter properties to class assignments.
    ///
    /// Converts constructor parameter properties (e.g., `constructor(public x:
    /// number)`) into explicit property declarations and assignments.
    pub transform_parameter_properties: bool,

    /// Handle TypeScript decorators.
    ///
    /// Processes decorator syntax according to TypeScript's decorator
    /// transformation rules.
    pub handle_decorators: bool,

    /// Only strip type-only imports/exports.
    ///
    /// When enabled, removes imports and exports marked with
    /// the `type` keyword but preserves value imports/exports.
    pub strip_type_only_imports: bool,
}

impl Default for TypeScriptOptions {
    fn default() -> Self {
        Self {
            strip_annotations: true,
            transform_enums: true,
            transform_namespaces: true,
            transform_parameter_properties: true,
            handle_decorators: true,
            strip_type_only_imports: true,
        }
    }
}

impl TypeScriptOptions {
    /// Creates a new `TypeScriptOptions` with all transformations enabled.
    pub fn new() -> Self {
        Self::default()
    }

    /// Creates options with all transformations disabled.
    pub fn disabled() -> Self {
        Self {
            strip_annotations: false,
            transform_enums: false,
            transform_namespaces: false,
            transform_parameter_properties: false,
            handle_decorators: false,
            strip_type_only_imports: false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_options() {
        let options = TypeScriptOptions::default();
        assert!(options.strip_annotations);
        assert!(options.transform_enums);
        assert!(options.transform_namespaces);
        assert!(options.transform_parameter_properties);
        assert!(options.handle_decorators);
        assert!(options.strip_type_only_imports);
    }

    #[test]
    fn test_disabled_options() {
        let options = TypeScriptOptions::disabled();
        assert!(!options.strip_annotations);
        assert!(!options.transform_enums);
        assert!(!options.transform_namespaces);
        assert!(!options.transform_parameter_properties);
        assert!(!options.handle_decorators);
        assert!(!options.strip_type_only_imports);
    }

    #[test]
    fn test_new_options() {
        let options = TypeScriptOptions::new();
        assert_eq!(options, TypeScriptOptions::default());
    }
}
