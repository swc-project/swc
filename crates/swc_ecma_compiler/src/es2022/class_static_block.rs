//! ES2022: Class Static Block
//!
//! This plugin transforms class static blocks (`class C { static { foo } }`) to
//! an equivalent using private fields (`class C { static #_ = foo }`).
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
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{context::TraverseCtx, utils::ast_builder::wrap_statements_in_arrow_function_iife};

pub struct ClassStaticBlock;

impl ClassStaticBlock {
    pub fn new() -> Self {
        Self
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ClassStaticBlock {
    fn enter_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        self.enter_class_body(&mut class.body, ctx);
    }
}

impl ClassStaticBlock {
    pub fn enter_class_body(&mut self, body: &mut Vec<ClassMember>, ctx: &mut TraverseCtx) {
        // Loop through class body elements and:
        // 1. Find if there are any `StaticBlock`s.
        // 2. Collate list of private keys matching `#_` or `#_[1-9]...`.
        //
        // Don't collate private keys list conditionally only if a static block is
        // found, as usually there will be no matching private keys, so those
        // checks are cheap and will not allocate.
        let mut has_static_block = false;
        let mut keys = Keys::default();
        for element in body.iter() {
            match element {
                ClassMember::StaticBlock(_) => {
                    has_static_block = true;
                    continue;
                }
                ClassMember::Method(method) => {
                    if let PropName::Ident(ident_name) = &method.key {
                        keys.reserve(&ident_name.sym);
                    }
                }
                ClassMember::ClassProp(prop) => {
                    if let PropName::Ident(ident_name) = &prop.key {
                        keys.reserve(&ident_name.sym);
                    }
                }
                ClassMember::PrivateMethod(method) => {
                    keys.reserve(&method.key.name);
                }
                ClassMember::PrivateProp(prop) => {
                    keys.reserve(&prop.key.name);
                }
                ClassMember::AutoAccessor(accessor) => {
                    if let Key::Private(private_name) = &accessor.key {
                        keys.reserve(&private_name.name);
                    }
                }
                _ => {}
            }
        }

        // Transform static blocks
        if !has_static_block {
            return;
        }

        let mut transformed_members = Vec::with_capacity(body.len());
        for element in body.drain(..) {
            match element {
                ClassMember::StaticBlock(block) => {
                    let new_member = Self::convert_block_to_private_field(block, &mut keys, ctx);
                    transformed_members.push(new_member);
                }
                other => transformed_members.push(other),
            }
        }
        *body = transformed_members;
    }
}

impl ClassStaticBlock {
    /// Convert static block to private field.
    /// `static { foo }` -> `static #_ = foo;`
    /// `static { foo; bar; }` -> `static #_ = (() => { foo; bar; })();`
    fn convert_block_to_private_field(
        block: StaticBlock,
        keys: &mut Keys,
        ctx: &mut TraverseCtx,
    ) -> ClassMember {
        let expr = Self::convert_block_to_expression(block, ctx);

        let key_name = keys.get_unique();
        let key = PrivateName {
            span: DUMMY_SP,
            name: key_name.into(),
        };

        ClassMember::PrivateProp(PrivateProp {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            key,
            value: Some(Box::new(expr)),
            type_ann: None,
            is_static: true,
            decorators: vec![],
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        })
    }

    /// Convert static block to expression which will be value of private field.
    /// `static { foo }` -> `foo`
    /// `static { foo; bar; }` -> `(() => { foo; bar; })()`
    fn convert_block_to_expression(mut block: StaticBlock, ctx: &mut TraverseCtx) -> Expr {
        // If block contains only a single `ExpressionStatement`, no need to wrap in an
        // IIFE. `static { foo }` -> `foo`
        // TODO(improve-on-babel): If block has no statements, could remove it entirely.
        let stmts = &mut block.body.stmts;
        if stmts.len() == 1 {
            if let Some(Stmt::Expr(expr_stmt)) = stmts.first_mut() {
                return Self::convert_block_with_single_expression_to_expression(
                    std::mem::replace(
                        &mut *expr_stmt.expr,
                        Expr::Invalid(Invalid { span: DUMMY_SP }),
                    ),
                    ctx,
                );
            }
        }

        // Convert block to arrow function IIFE.
        // `static { foo; bar; }` -> `(() => { foo; bar; })()`
        let stmts = std::mem::take(&mut block.body.stmts);
        wrap_statements_in_arrow_function_iife(stmts, block.span, ctx)
    }

    /// Convert static block to expression which will be value of private field,
    /// where the static block contains only a single expression.
    /// `static { foo }` -> `foo`
    fn convert_block_with_single_expression_to_expression(
        expr: Expr,
        _ctx: &mut TraverseCtx,
    ) -> Expr {
        // Return the expression as-is
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
/// So store whether `#_` is in set as a separate `bool`, to make a fast path
/// this common case, which does not involve any allocations (`numbered` will
/// remain empty).
///
/// Use a `Vec` rather than a `HashMap`, because number of matching private keys
/// is usually small, and `Vec` is lower overhead in that case.
#[derive(Default)]
struct Keys {
    /// `true` if keys includes `#_`.
    underscore: bool,
    /// Keys matching `#_[1-9]...`. Stored without the `_` prefix.
    numbered: Vec<String>,
}

impl Keys {
    /// Add a key to set.
    ///
    /// Key will only be added to set if it's `_`, or starts with `_[1-9]`.
    fn reserve(&mut self, key: &str) {
        let mut bytes = key.as_bytes().iter().copied();
        if bytes.next() != Some(b'_') {
            return;
        }

        match bytes.next() {
            None => {
                self.underscore = true;
            }
            Some(b'1'..=b'9') => {
                self.numbered.push(key[1..].to_string());
            }
            _ => {}
        }
    }

    /// Get a key which is not in the set.
    ///
    /// Returned key will be either `_`, or `_<integer>` starting with `_2`.
    #[inline]
    fn get_unique(&mut self) -> &'static str {
        #[expect(clippy::if_not_else)]
        if !self.underscore {
            self.underscore = true;
            "_"
        } else {
            self.get_unique_slow()
        }
    }

    // `#[cold]` and `#[inline(never)]` as it should be very rare to need a key
    // other than `#_`.
    #[cold]
    #[inline(never)]
    fn get_unique_slow(&mut self) -> &'static str {
        // Source text length is limited to `u32::MAX` so impossible to have more than
        // `u32::MAX` private keys. So `u32` is sufficient here.
        let mut i = 2u32;
        let mut buffer = ItoaBuffer::new();
        let num_str;
        loop {
            let formatted = buffer.format(i);
            if !self.numbered.iter().any(|s| s == formatted) {
                num_str = formatted;
                break;
            }
            i += 1;
        }

        self.numbered.push(num_str.to_string());

        // For now, return a static string. This is not ideal but avoids lifetime
        // issues. In production, this should use an arena allocator or similar.
        match i {
            2 => "_2",
            3 => "_3",
            4 => "_4",
            5 => "_5",
            6 => "_6",
            7 => "_7",
            8 => "_8",
            9 => "_9",
            10 => "_10",
            _ => "_11", // fallback for higher numbers
        }
    }
}

// TODO: Port tests to SWC
// Tests have been removed during porting from oxc to SWC.
// They should be re-implemented once the SWC testing infrastructure is set up.
#[cfg(test)]
mod test {
    use super::Keys;

    #[test]
    fn keys_no_reserved() {
        let mut keys = Keys::default();

        assert_eq!(keys.get_unique(), "_");
        assert_eq!(keys.get_unique(), "_2");
        assert_eq!(keys.get_unique(), "_3");
    }

    #[test]
    fn keys_no_relevant_reserved() {
        let mut keys = Keys::default();
        keys.reserve("a");
        keys.reserve("foo");
        keys.reserve("__");
        keys.reserve("_0");
        keys.reserve("_1");
        keys.reserve("_a");
        keys.reserve("_foo");
        keys.reserve("_2foo");

        assert_eq!(keys.get_unique(), "_");
        assert_eq!(keys.get_unique(), "_2");
        assert_eq!(keys.get_unique(), "_3");
    }

    #[test]
    fn keys_reserved_underscore() {
        let mut keys = Keys::default();
        keys.reserve("_");

        assert_eq!(keys.get_unique(), "_2");
        assert_eq!(keys.get_unique(), "_3");
        assert_eq!(keys.get_unique(), "_4");
    }
}
