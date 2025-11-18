//! Transformation context for AST visitors.
//!
//! This module provides the `TraverseCtx` struct that holds shared state
//! and context information during AST transformations. It is designed to be
//! passed through all transformation hooks via the `VisitMutHook` trait.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

/// Context passed through all transformation hooks.
///
/// This struct holds shared state and provides helper methods for common
/// operations during AST transformations. It is inspired by oxc's TraverseCtx
/// but adapted to SWC's architecture.
///
/// # Example
///
/// ```ignore
/// use swc_ecma_transformer::TraverseCtx;
///
/// let mut ctx = TraverseCtx::new();
/// // Use context in transformations
/// ```
#[derive(Default)]
pub struct TraverseCtx {
    /// Stack of ancestor nodes, useful for checking parent context
    ancestor_stack: Vec<AncestorNode>,

    /// Track current scope depth (functions, blocks, etc.)
    scope_depth: usize,

    /// Unique identifier counter for generating fresh identifiers
    uid_counter: usize,

    /// Map to store metadata about identifiers (e.g., usage counts, bindings)
    identifier_metadata: FxHashMap<Id, IdentifierMetadata>,

    /// Whether we're currently inside a loop
    in_loop: bool,

    /// Whether we're currently inside a function
    in_function: bool,

    /// Whether we're currently in strict mode
    in_strict_mode: bool,
}

/// Metadata about an identifier
#[derive(Debug, Clone, Default)]
pub struct IdentifierMetadata {
    /// Number of references to this identifier
    pub reference_count: usize,

    /// Whether this identifier is bound in current scope
    pub is_bound: bool,
}

/// Represents different types of ancestor nodes in the AST
#[derive(Debug, Clone)]
pub enum AncestorNode {
    Function,
    ArrowFunction,
    Block,
    Loop,
    Class,
    Method,
}

impl TraverseCtx {
    /// Creates a new transformation context.
    pub fn new() -> Self {
        Self::default()
    }

    /// Generates a unique identifier name.
    ///
    /// This is useful for creating temporary variables during transformations.
    pub fn generate_uid(&mut self, prefix: &str) -> String {
        self.uid_counter += 1;
        format!("_{}_{}", prefix, self.uid_counter)
    }

    /// Generates a unique identifier with a given base name.
    pub fn generate_uid_ident(&mut self, prefix: &str) -> Ident {
        let name = self.generate_uid(prefix);
        Ident::new(Atom::from(name), Default::default(), SyntaxContext::empty())
    }

    /// Enters a new scope level.
    pub fn enter_scope(&mut self) {
        self.scope_depth += 1;
    }

    /// Exits the current scope level.
    pub fn exit_scope(&mut self) {
        if self.scope_depth > 0 {
            self.scope_depth -= 1;
        }
    }

    /// Gets the current scope depth.
    pub fn scope_depth(&self) -> usize {
        self.scope_depth
    }

    /// Pushes an ancestor node onto the stack.
    pub fn push_ancestor(&mut self, ancestor: AncestorNode) {
        if matches!(ancestor, AncestorNode::Loop) {
            self.in_loop = true;
        }
        if matches!(
            ancestor,
            AncestorNode::Function | AncestorNode::ArrowFunction
        ) {
            self.in_function = true;
        }
        self.ancestor_stack.push(ancestor);
    }

    /// Pops an ancestor node from the stack.
    pub fn pop_ancestor(&mut self) -> Option<AncestorNode> {
        let ancestor = self.ancestor_stack.pop();

        // Update loop/function flags
        if let Some(ref node) = ancestor {
            if matches!(node, AncestorNode::Loop) {
                self.in_loop = self
                    .ancestor_stack
                    .iter()
                    .any(|a| matches!(a, AncestorNode::Loop));
            }
            if matches!(node, AncestorNode::Function | AncestorNode::ArrowFunction) {
                self.in_function = self
                    .ancestor_stack
                    .iter()
                    .any(|a| matches!(a, AncestorNode::Function | AncestorNode::ArrowFunction));
            }
        }

        ancestor
    }

    /// Checks if we're currently inside a loop.
    pub fn in_loop(&self) -> bool {
        self.in_loop
    }

    /// Checks if we're currently inside a function.
    pub fn in_function(&self) -> bool {
        self.in_function
    }

    /// Sets strict mode flag.
    pub fn set_strict_mode(&mut self, strict: bool) {
        self.in_strict_mode = strict;
    }

    /// Checks if we're in strict mode.
    pub fn in_strict_mode(&self) -> bool {
        self.in_strict_mode
    }

    /// Records metadata about an identifier.
    pub fn record_identifier(&mut self, id: Id, metadata: IdentifierMetadata) {
        self.identifier_metadata.insert(id, metadata);
    }

    /// Gets metadata for an identifier.
    pub fn get_identifier_metadata(&self, id: &Id) -> Option<&IdentifierMetadata> {
        self.identifier_metadata.get(id)
    }

    /// Increments the reference count for an identifier.
    pub fn increment_reference(&mut self, id: &Id) {
        self.identifier_metadata
            .entry(id.clone())
            .or_default()
            .reference_count += 1;
    }

    /// Gets the ancestor stack (useful for checking parent context).
    pub fn ancestors(&self) -> &[AncestorNode] {
        &self.ancestor_stack
    }
}
