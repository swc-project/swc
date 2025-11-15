//! ES2022: Class Properties
//! Transform of instance property initializers.

use std::cell::Cell;

use rustc_hash::FxHashMap;

use oxc_ast::ast::*;
use oxc_ast_visit::Visit;
use oxc_data_structures::stack::Stack;
use oxc_span::Atom;
use oxc_syntax::{
    scope::{ScopeFlags, ScopeId},
    symbol::SymbolId,
};

use crate::context::TraverseCtx;

use super::ClassProperties;

impl<'a> ClassProperties<'a, '_> {
    /// Reparent property initializers scope.
    ///
    /// Instance property initializers move from the class body into either class constructor,
    /// or a `_super` function. Change parent scope of first-level scopes in initializer to reflect this.
    pub(super) fn reparent_initializers_scope(
        &mut self,
        inits: &[Expression<'a>],
        instance_inits_scope_id: ScopeId,
        instance_inits_constructor_scope_id: Option<ScopeId>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(constructor_scope_id) = instance_inits_constructor_scope_id {
            // Re-parent first-level scopes, and check for symbol clashes
            let mut updater = InstanceInitializerVisitor::new(
                instance_inits_scope_id,
                constructor_scope_id,
                self,
                ctx,
            );
            for init in inits {
                updater.visit_expression(init);
            }
        } else {
            // No symbol clashes possible. Just re-parent first-level scopes (faster).
            let mut updater = FastInstanceInitializerVisitor::new(instance_inits_scope_id, ctx);
            for init in inits {
                updater.visit_expression(init);
            }
        }
    }
}

/// Visitor to change parent scope of first-level scopes in instance property initializer,
/// and find any `IdentifierReference`s which would be shadowed by bindings in constructor,
/// once initializer moves into constructor body.
struct InstanceInitializerVisitor<'a, 'v> {
    /// Pushed to when entering a scope, popped when exiting it.
    /// Parent `ScopeId` should be updated when stack is empty (i.e. this is a first-level scope).
    scope_ids_stack: Stack<ScopeId>,
    /// New parent scope for first-level scopes in initializer
    parent_scope_id: ScopeId,
    /// Constructor's scope, for checking symbol clashes against
    constructor_scope_id: ScopeId,
    /// Clashing symbols
    clashing_symbols: &'v mut FxHashMap<SymbolId, Atom<'a>>,
    /// `TransCtx` object.
    ctx: &'v mut TraverseCtx<'a>,
}

impl<'a, 'v> InstanceInitializerVisitor<'a, 'v> {
    fn new(
        instance_inits_scope_id: ScopeId,
        constructor_scope_id: ScopeId,
        class_properties: &'v mut ClassProperties<'a, '_>,
        ctx: &'v mut TraverseCtx<'a>,
    ) -> Self {
        Self {
            // Most initializers don't contain any scopes, so best default is 0 capacity
            // to avoid an allocation in most cases
            scope_ids_stack: Stack::new(),
            parent_scope_id: instance_inits_scope_id,
            constructor_scope_id,
            clashing_symbols: &mut class_properties.clashing_constructor_symbols,
            ctx,
        }
    }
}

impl<'a> Visit<'a> for InstanceInitializerVisitor<'a, '_> {
    /// Update parent scope for first level of scopes.
    /// Convert scope to sloppy mode if `self.make_sloppy_mode == true`.
    //
    // `#[inline]` because this function is small and called from many `walk` functions
    #[inline]
    fn enter_scope(&mut self, _flags: ScopeFlags, scope_id: &Cell<Option<ScopeId>>) {
        let scope_id = scope_id.get().unwrap();
        if self.scope_ids_stack.is_empty() {
            self.reparent_scope(scope_id);
        }
        self.scope_ids_stack.push(scope_id);
    }

    // `#[inline]` because this function is tiny and called from many `walk` functions
    #[inline]
    fn leave_scope(&mut self) {
        self.scope_ids_stack.pop();
    }

    // `#[inline]` because this function just delegates to `check_for_symbol_clash`
    #[inline]
    fn visit_identifier_reference(&mut self, ident: &IdentifierReference<'a>) {
        self.check_for_symbol_clash(ident);
    }
}

impl<'a> InstanceInitializerVisitor<'a, '_> {
    /// Update parent of scope.
    fn reparent_scope(&mut self, scope_id: ScopeId) {
        self.ctx.scoping_mut().change_scope_parent_id(scope_id, Some(self.parent_scope_id));
    }

    /// Check if symbol referenced by `ident` is shadowed by a binding in constructor's scope.
    fn check_for_symbol_clash(&mut self, ident: &IdentifierReference<'a>) {
        // TODO: It would be ideal if could get reference `&Bindings` for constructor
        // in `InstanceInitializerVisitor::new` rather than indexing into `ScopeTree::bindings`
        // with same `ScopeId` every time here, but `ScopeTree` doesn't allow that, and we also
        // take a `&mut ScopeTree` in `reparent_scope`, so borrow-checker doesn't allow that.
        let Some(constructor_symbol_id) =
            self.ctx.scoping().get_binding(self.constructor_scope_id, &ident.name)
        else {
            return;
        };

        // Check the symbol this identifier refers to is bound outside of the initializer itself.
        // If it's bound within the initializer, there's no clash, so exit.
        // e.g. `class C { double = (n) => n * 2; constructor(n) {} }`
        // Even though there's a binding `n` in constructor, it doesn't shadow the use of `n` in init.
        // This is an improvement over Babel.
        let reference_id = ident.reference_id();
        if let Some(ident_symbol_id) = self.ctx.scoping().get_reference(reference_id).symbol_id() {
            let scope_id = self.ctx.scoping().symbol_scope_id(ident_symbol_id);
            if self.scope_ids_stack.contains(&scope_id) {
                return;
            }
        }

        // Record the symbol clash. Symbol in constructor needs to be renamed.
        self.clashing_symbols.entry(constructor_symbol_id).or_insert(ident.name);
    }
}

/// Visitor to change parent scope of first-level scopes in instance property initializer.
///
/// Unlike `InstanceInitializerVisitor`, does not check for symbol clashes.
///
/// Therefore only needs to walk until find a node which has a scope. No point continuing to traverse
/// inside that scope, as by definition any nested scopes can't be first level.
///
/// The visitors here are for the only types which can be the first scope reached when starting
/// traversal from an `Expression`.
struct FastInstanceInitializerVisitor<'a, 'v> {
    /// Parent scope
    parent_scope_id: ScopeId,
    /// `TransCtx` object.
    ctx: &'v mut TraverseCtx<'a>,
}

impl<'a, 'v> FastInstanceInitializerVisitor<'a, 'v> {
    fn new(instance_inits_scope_id: ScopeId, ctx: &'v mut TraverseCtx<'a>) -> Self {
        Self { parent_scope_id: instance_inits_scope_id, ctx }
    }
}

impl<'a> Visit<'a> for FastInstanceInitializerVisitor<'a, '_> {
    #[inline]
    fn visit_function(&mut self, func: &Function<'a>, _flags: ScopeFlags) {
        self.reparent_scope(&func.scope_id);
    }

    #[inline]
    fn visit_arrow_function_expression(&mut self, func: &ArrowFunctionExpression<'a>) {
        self.reparent_scope(&func.scope_id);
    }

    #[inline]
    fn visit_class(&mut self, class: &Class<'a>) {
        // `decorators` is outside `Class`'s scope and can contain scopes itself
        self.visit_decorators(&class.decorators);

        self.reparent_scope(&class.scope_id);
    }

    #[inline]
    fn visit_ts_conditional_type(&mut self, conditional: &TSConditionalType<'a>) {
        // `check_type` is outside `TSConditionalType`'s scope and can contain scopes itself
        self.visit_ts_type(&conditional.check_type);

        self.reparent_scope(&conditional.scope_id);

        // `false_type` is outside `TSConditionalType`'s scope and can contain scopes itself
        self.visit_ts_type(&conditional.false_type);
    }

    #[inline]
    fn visit_ts_method_signature(&mut self, signature: &TSMethodSignature<'a>) {
        self.reparent_scope(&signature.scope_id);
    }

    #[inline]
    fn visit_ts_construct_signature_declaration(
        &mut self,
        signature: &TSConstructSignatureDeclaration<'a>,
    ) {
        self.reparent_scope(&signature.scope_id);
    }

    #[inline]
    fn visit_ts_mapped_type(&mut self, mapped: &TSMappedType<'a>) {
        self.reparent_scope(&mapped.scope_id);
    }
}

impl FastInstanceInitializerVisitor<'_, '_> {
    /// Update parent of scope.
    fn reparent_scope(&mut self, scope_id: &Cell<Option<ScopeId>>) {
        let scope_id = scope_id.get().unwrap();
        self.ctx.scoping_mut().change_scope_parent_id(scope_id, Some(self.parent_scope_id));
    }
}
