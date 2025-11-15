//! ES2022: Class Static Block
//!
//! This plugin transforms class static blocks (`class C { static { foo } }`) to an equivalent
//! using private fields (`class C { static #_ = foo }`).
//!
//! > This plugin is included in `preset-env`, in ES2022
//!
//! ## Example
//!
//! Input:
//! ```js
//! class C {
//!   static {
//!     foo();
//!   }
//!   static {
//!     foo();
//!     bar();
//!   }
//! }
//! ```
//!
//! Output:
//! ```js
//! class C {
//!   static #_ = foo();
//!   static #_2 = (() => {
//!     foo();
//!     bar();
//!   })();
//! }
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-class-static-block](https://babel.dev/docs/babel-plugin-transform-class-static-block).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-class-static-block>
//! * Class static initialization blocks TC39 proposal: <https://github.com/tc39/proposal-class-static-block>

use itoa::Buffer as ItoaBuffer;

use oxc_allocator::TakeIn;
use oxc_ast::{NONE, ast::*};
use oxc_span::SPAN;
use oxc_syntax::scope::{ScopeFlags, ScopeId};
use oxc_traverse::Traverse;

use crate::{
    context::TraverseCtx, state::TransformState,
    utils::ast_builder::wrap_statements_in_arrow_function_iife,
};

pub struct ClassStaticBlock;

impl ClassStaticBlock {
    pub fn new() -> Self {
        Self
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ClassStaticBlock {
    fn enter_class_body(&mut self, body: &mut ClassBody<'a>, ctx: &mut TraverseCtx<'a>) {
        // Loop through class body elements and:
        // 1. Find if there are any `StaticBlock`s.
        // 2. Collate list of private keys matching `#_` or `#_[1-9]...`.
        //
        // Don't collate private keys list conditionally only if a static block is found, as usually
        // there will be no matching private keys, so those checks are cheap and will not allocate.
        let mut has_static_block = false;
        let mut keys = Keys::default();
        for element in &body.body {
            let key = match element {
                ClassElement::StaticBlock(_) => {
                    has_static_block = true;
                    continue;
                }
                ClassElement::MethodDefinition(def) => &def.key,
                ClassElement::PropertyDefinition(def) => &def.key,
                ClassElement::AccessorProperty(def) => &def.key,
                ClassElement::TSIndexSignature(_) => continue,
            };

            if let PropertyKey::PrivateIdentifier(id) = key {
                keys.reserve(id.name.as_str());
            }
        }

        // Transform static blocks
        if !has_static_block {
            return;
        }

        for element in &mut body.body {
            if let ClassElement::StaticBlock(block) = element {
                *element = Self::convert_block_to_private_field(block, &mut keys, ctx);
            }
        }
    }
}

impl ClassStaticBlock {
    /// Convert static block to private field.
    /// `static { foo }` -> `static #_ = foo;`
    /// `static { foo; bar; }` -> `static #_ = (() => { foo; bar; })();`
    fn convert_block_to_private_field<'a>(
        block: &mut StaticBlock<'a>,
        keys: &mut Keys<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> ClassElement<'a> {
        let expr = Self::convert_block_to_expression(block, ctx);

        let key = keys.get_unique(ctx);
        let key = ctx.ast.property_key_private_identifier(SPAN, key);

        ctx.ast.class_element_property_definition(
            block.span,
            PropertyDefinitionType::PropertyDefinition,
            ctx.ast.vec(),
            key,
            NONE,
            Some(expr),
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            None,
        )
    }

    /// Convert static block to expression which will be value of private field.
    /// `static { foo }` -> `foo`
    /// `static { foo; bar; }` -> `(() => { foo; bar; })()`
    fn convert_block_to_expression<'a>(
        block: &mut StaticBlock<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let scope_id = block.scope_id();

        // If block contains only a single `ExpressionStatement`, no need to wrap in an IIFE.
        // `static { foo }` -> `foo`
        // TODO(improve-on-babel): If block has no statements, could remove it entirely.
        let stmts = &mut block.body;
        if stmts.len() == 1
            && let Statement::ExpressionStatement(stmt) = stmts.first_mut().unwrap()
        {
            return Self::convert_block_with_single_expression_to_expression(
                &mut stmt.expression,
                scope_id,
                ctx,
            );
        }

        // Convert block to arrow function IIFE.
        // `static { foo; bar; }` -> `(() => { foo; bar; })()`

        // Re-use the static block's scope for the arrow function.
        // Always strict mode since we're in a class.
        *ctx.scoping_mut().scope_flags_mut(scope_id) =
            ScopeFlags::Function | ScopeFlags::Arrow | ScopeFlags::StrictMode;
        wrap_statements_in_arrow_function_iife(stmts.take_in(ctx.ast), scope_id, block.span, ctx)
    }

    /// Convert static block to expression which will be value of private field,
    /// where the static block contains only a single expression.
    /// `static { foo }` -> `foo`
    fn convert_block_with_single_expression_to_expression<'a>(
        expr: &mut Expression<'a>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let expr = expr.take_in(ctx.ast);

        // Remove the scope for the static block from the scope chain
        ctx.remove_scope_for_expression(scope_id, &expr);

        expr
    }
}

/// Store of private identifier keys matching `#_` or `#_[1-9]...`.
///
/// Most commonly there will be no existing keys matching this pattern
/// (why would you prefix a private key with `_`?).
/// It's also uncommon to have more than 1 static block in a class.
///
/// Therefore common case is only 1 static block, which will use key `#_`.
/// So store whether `#_` is in set as a separate `bool`, to make a fast path this common case,
/// which does not involve any allocations (`numbered` will remain empty).
///
/// Use a `Vec` rather than a `HashMap`, because number of matching private keys is usually small,
/// and `Vec` is lower overhead in that case.
#[derive(Default)]
struct Keys<'a> {
    /// `true` if keys includes `#_`.
    underscore: bool,
    /// Keys matching `#_[1-9]...`. Stored without the `_` prefix.
    numbered: Vec<&'a str>,
}

impl<'a> Keys<'a> {
    /// Add a key to set.
    ///
    /// Key will only be added to set if it's `_`, or starts with `_[1-9]`.
    fn reserve(&mut self, key: &'a str) {
        let mut bytes = key.as_bytes().iter().copied();
        if bytes.next() != Some(b'_') {
            return;
        }

        match bytes.next() {
            None => {
                self.underscore = true;
            }
            Some(b'1'..=b'9') => {
                self.numbered.push(&key[1..]);
            }
            _ => {}
        }
    }

    /// Get a key which is not in the set.
    ///
    /// Returned key will be either `_`, or `_<integer>` starting with `_2`.
    #[inline]
    fn get_unique(&mut self, ctx: &TraverseCtx<'a>) -> Atom<'a> {
        #[expect(clippy::if_not_else)]
        if !self.underscore {
            self.underscore = true;
            Atom::from("_")
        } else {
            self.get_unique_slow(ctx)
        }
    }

    // `#[cold]` and `#[inline(never)]` as it should be very rare to need a key other than `#_`.
    #[cold]
    #[inline(never)]
    fn get_unique_slow(&mut self, ctx: &TraverseCtx<'a>) -> Atom<'a> {
        // Source text length is limited to `u32::MAX` so impossible to have more than `u32::MAX`
        // private keys. So `u32` is sufficient here.
        let mut i = 2u32;
        let mut buffer = ItoaBuffer::new();
        let mut num_str;
        loop {
            num_str = buffer.format(i);
            if !self.numbered.contains(&num_str) {
                break;
            }
            i += 1;
        }

        let key = ctx.ast.atom_from_strs_array(["_", num_str]);
        self.numbered.push(&key.as_str()[1..]);

        key
    }
}

#[cfg(test)]
mod test {
    use oxc_allocator::Allocator;
    use oxc_semantic::Scoping;
    use oxc_traverse::ReusableTraverseCtx;

    use crate::state::TransformState;

    use super::Keys;

    macro_rules! setup {
        ($ctx:ident) => {
            let allocator = Allocator::default();
            let scoping = Scoping::default();
            let state = TransformState::default();
            let ctx = ReusableTraverseCtx::new(state, scoping, &allocator);
            // SAFETY: Macro user only gets a `&mut TransCtx`, which cannot be abused
            let mut ctx = unsafe { ctx.unwrap() };
            let $ctx = &mut ctx;
        };
    }

    #[test]
    fn keys_no_reserved() {
        setup!(ctx);

        let mut keys = Keys::default();

        assert_eq!(keys.get_unique(ctx), "_");
        assert_eq!(keys.get_unique(ctx), "_2");
        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_4");
        assert_eq!(keys.get_unique(ctx), "_5");
        assert_eq!(keys.get_unique(ctx), "_6");
        assert_eq!(keys.get_unique(ctx), "_7");
        assert_eq!(keys.get_unique(ctx), "_8");
        assert_eq!(keys.get_unique(ctx), "_9");
        assert_eq!(keys.get_unique(ctx), "_10");
        assert_eq!(keys.get_unique(ctx), "_11");
        assert_eq!(keys.get_unique(ctx), "_12");
    }

    #[test]
    fn keys_no_relevant_reserved() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("a");
        keys.reserve("foo");
        keys.reserve("__");
        keys.reserve("_0");
        keys.reserve("_1");
        keys.reserve("_a");
        keys.reserve("_foo");
        keys.reserve("_2foo");

        assert_eq!(keys.get_unique(ctx), "_");
        assert_eq!(keys.get_unique(ctx), "_2");
        assert_eq!(keys.get_unique(ctx), "_3");
    }

    #[test]
    fn keys_reserved_underscore() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("_");

        assert_eq!(keys.get_unique(ctx), "_2");
        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_4");
    }

    #[test]
    fn keys_reserved_numbers() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("_2");
        keys.reserve("_4");
        keys.reserve("_11");

        assert_eq!(keys.get_unique(ctx), "_");
        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_5");
        assert_eq!(keys.get_unique(ctx), "_6");
        assert_eq!(keys.get_unique(ctx), "_7");
        assert_eq!(keys.get_unique(ctx), "_8");
        assert_eq!(keys.get_unique(ctx), "_9");
        assert_eq!(keys.get_unique(ctx), "_10");
        assert_eq!(keys.get_unique(ctx), "_12");
    }

    #[test]
    fn keys_reserved_later_numbers() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("_5");
        keys.reserve("_4");
        keys.reserve("_12");
        keys.reserve("_13");

        assert_eq!(keys.get_unique(ctx), "_");
        assert_eq!(keys.get_unique(ctx), "_2");
        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_6");
        assert_eq!(keys.get_unique(ctx), "_7");
        assert_eq!(keys.get_unique(ctx), "_8");
        assert_eq!(keys.get_unique(ctx), "_9");
        assert_eq!(keys.get_unique(ctx), "_10");
        assert_eq!(keys.get_unique(ctx), "_11");
        assert_eq!(keys.get_unique(ctx), "_14");
    }

    #[test]
    fn keys_reserved_underscore_and_numbers() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("_2");
        keys.reserve("_4");
        keys.reserve("_");

        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_5");
        assert_eq!(keys.get_unique(ctx), "_6");
    }

    #[test]
    fn keys_reserved_underscore_and_later_numbers() {
        setup!(ctx);

        let mut keys = Keys::default();
        keys.reserve("_5");
        keys.reserve("_4");
        keys.reserve("_");

        assert_eq!(keys.get_unique(ctx), "_2");
        assert_eq!(keys.get_unique(ctx), "_3");
        assert_eq!(keys.get_unique(ctx), "_6");
    }
}
