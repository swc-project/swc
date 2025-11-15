//! Utilities to computed key expressions.

use oxc_ast::ast::Expression;
use oxc_semantic::SymbolFlags;

use crate::{
    context::{TransformCtx, TraverseCtx},
    utils::ast_builder::create_assignment,
};

impl<'a> TransformCtx<'a> {
    /// Check if temp var is required for `key`.
    ///
    /// `this` does not have side effects, but in this context, it needs a temp var anyway, because `this`
    /// in computed key and `this` within class constructor resolve to different `this` bindings.
    /// So we need to create a temp var outside of the class to get the correct `this`.
    /// `class C { [this] = 1; }`
    /// -> `let _this; _this = this; class C { constructor() { this[_this] = 1; } }`
    //
    // TODO(improve-on-babel): Can avoid the temp var if key is for a static prop/method,
    // as in that case the usage of `this` stays outside the class.
    #[expect(clippy::unused_self)] // Taking `self` makes it easier to use.
    pub fn key_needs_temp_var(&self, key: &Expression, ctx: &TraverseCtx) -> bool {
        match key {
            // Literals cannot have side effects.
            // e.g. `let x = 'x'; class C { [x] = 1; }` or `class C { ['x'] = 1; }`.
            Expression::BooleanLiteral(_)
            | Expression::NullLiteral(_)
            | Expression::NumericLiteral(_)
            | Expression::BigIntLiteral(_)
            | Expression::RegExpLiteral(_)
            | Expression::StringLiteral(_) => false,
            // Template literal cannot have side effects if it has no expressions.
            // If it *does* have expressions, but they're all literals, then also cannot have side effects,
            // but don't bother checking for that as it shouldn't occur in real world code.
            // Why would you write "`x${9}z`" when you can just write "`x9z`"?
            // Note: "`x${foo}`" *can* have side effects if `foo` is an object with a `toString` method.
            Expression::TemplateLiteral(lit) => !lit.expressions.is_empty(),
            // `IdentifierReference`s can have side effects if is unbound.
            //
            // If var is mutated, it also needs a temp var, because of cases like
            // `let x = 1; class { [x] = 1; [++x] = 2; }`
            // `++x` is hoisted to before class in output, so `x` in 1st key would get the wrong value
            // unless it's hoisted out too.
            //
            // TODO: Add an exec test for this odd case.
            // TODO(improve-on-babel): That case is rare.
            // Test for it in first pass over class elements, and avoid temp vars where possible.
            Expression::Identifier(ident) => {
                match ctx.scoping().get_reference(ident.reference_id()).symbol_id() {
                    Some(symbol_id) => ctx.scoping().symbol_is_mutated(symbol_id),
                    None => true,
                }
            }
            // Treat any other expression as possibly having side effects e.g. `foo()`.
            // TODO: Do fuller analysis to detect expressions which cannot have side effects.
            // e.g. `"x" + "y"`.
            _ => true,
        }
    }

    /// Create `let _x;` statement and insert it.
    /// Return `_x = x()` assignment, and `_x` identifier referencing same temp var.
    pub fn create_computed_key_temp_var(
        &self,
        key: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (/* assignment */ Expression<'a>, /* identifier */ Expression<'a>) {
        let outer_scope_id = ctx.current_block_scope_id();
        // TODO: Handle if is a class expression defined in a function's params.
        let binding =
            ctx.generate_uid_based_on_node(&key, outer_scope_id, SymbolFlags::BlockScopedVariable);

        self.var_declarations.insert_let(&binding, None, ctx);

        let assignment = create_assignment(&binding, key, ctx);
        let ident = binding.create_read_expression(ctx);

        (assignment, ident)
    }
}
