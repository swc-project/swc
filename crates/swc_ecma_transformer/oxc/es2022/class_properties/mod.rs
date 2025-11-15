//! ES2022: Class Properties
//!
//! This plugin transforms class properties to initializers inside class constructor.
//!
//! > This plugin is included in `preset-env`, in ES2022
//!
//! ## Example
//!
//! Input:
//! ```js
//! class C {
//!   foo = 123;
//!   #bar = 456;
//!   method() {
//!     let bar = this.#bar;
//!     this.#bar = bar + 1;
//!   }
//! }
//!
//! let x = 123;
//! class D extends S {
//!   foo = x;
//!   constructor(x) {
//!     if (x) {
//!       let s = super(x);
//!     } else {
//!       super(x);
//!     }
//!   }
//! }
//! ```
//!
//! Output:
//! ```js
//! var _bar = /*#__PURE__*/ new WeakMap();
//! class C {
//!   constructor() {
//!     babelHelpers.defineProperty(this, "foo", 123);
//!     babelHelpers.classPrivateFieldInitSpec(this, _bar, 456);
//!   }
//!   method() {
//!     let bar = babelHelpers.classPrivateFieldGet2(_bar, this);
//!     babelHelpers.classPrivateFieldSet2(_bar, this, bar + 1);
//!   }
//! }
//!
//! let x = 123;
//! class D extends S {
//!   constructor(_x) {
//!     if (_x) {
//!       let s = (super(_x), babelHelpers.defineProperty(this, "foo", x));
//!     } else {
//!       super(_x);
//!       babelHelpers.defineProperty(this, "foo", x);
//!     }
//!   }
//! }
//! ```
//!
//! ## Options
//!
//! ### `loose`
//!
//! This option can also be enabled with `CompilerAssumptions::set_public_class_fields`.
//!
//! When `true`, class properties are compiled to use an assignment expression instead of
//! `_defineProperty` helper.
//!
//! #### Example
//!
//! Input:
//! ```js
//! class C {
//!   foo = 123;
//! }
//! ```
//!
//! With `loose: false` (default):
//!
//! ```js
//! class C {
//!   constructor() {
//!     babelHelpers.defineProperty(this, "foo", 123);
//!   }
//! }
//! ```
//!
//! With `loose: true`:
//!
//! ```js
//! class C {
//!   constructor() {
//!     this.foo = 123;
//!   }
//! }
//! ```
//!
//! ## Implementation
//!
//! ### Reference implementation
//!
//! Implementation based on [@babel/plugin-transform-class-properties](https://babel.dev/docs/babel-plugin-transform-class-properties).
//!
//! I (@overlookmotel) wrote this transform without reference to Babel's internal implementation,
//! but aiming to reproduce Babel's output, guided by Babel's test suite.
//!
//! ### Divergence from Babel
//!
//! In a few places, our implementation diverges from Babel, notably inserting property initializers
//! into constructor of a class with multiple `super()` calls (see comments in [`constructor`] module).
//!
//! ### High level overview
//!
//! Transform happens in 3 phases:
//!
//! 1. On entering class body:
//!    ([`ClassProperties::transform_class_body_on_entry`])
//!    * Check if class contains properties or static blocks, to determine if any transform is necessary.
//!      Exit if nothing to do.
//!    * Build a hashmap of private property keys.
//!    * Extract instance property initializers (public or private) from class body and insert into
//!      class constructor.
//!    * Temporarily replace computed keys of instance properties with assignments to temp vars.
//!      `class C { [foo()] = 123; }` -> `class C { [_foo = foo()]; }`
//!
//! 2. During traversal of class body:
//!    ([`ClassProperties::transform_private_field_expression`] and other visitors)
//!    * Transform private fields (`this.#foo`).
//!
//! 3. On exiting class:
//!    ([`ClassProperties::transform_class_declaration_on_exit`] and [`ClassProperties::transform_class_expression_on_exit`])
//!    * Transform static properties, and static blocks.
//!    * Move assignments to temp vars which were inserted in computed keys for in phase 1 to before class.
//!    * Create temp vars for computed method keys if required.
//!    * Insert statements before/after class declaration / expressions before/after class expression.
//!
//! The reason for doing transform in 3 phases is that everything needs to stay within the class body
//! while main traverse executes, so that other transforms have a chance to run on that code.
//!
//! Static property initializers, static blocks, and computed keys move to outside the class eventually,
//! but we move them in the final exit phase, so they get transformed first.
//! Additionally, any private fields (`this.#prop`) in these parts are also transformed in the main traverse
//! by this transform.
//!
//! However, we can't leave *everything* until the exit phase because:
//!
//! 1. We need to compile a list of private properties before main traversal.
//! 2. Instance property initializers need to move into the class constructor, and if we don't do that
//!    before the main traversal of class body, then other transforms running on instance property
//!    initializers will create temp vars outside the class, when they should be in constructor.
//!
//! Note: We execute the entry phase on entering class *body*, not class, because private properties
//! defined in a class only affect the class body, and not the `extends` clause.
//! By only pushing details of the class to the stack when entering class *body*, we avoid any class
//! fields in the `extends` clause being incorrectly resolved to private properties defined in that class,
//! as `extends` clause is visited before class body.
//!
//! ### Structures
//!
//! Transform stores 2 sets of state:
//!
//! 1. Details about classes in a stack of `ClassDetails` - `classes_stack`.
//!    This stack is pushed to when entering class body, and popped when exiting class.
//!    This contains data which is used in both the enter and exit phases.
//! 2. A set of properties - `insert_before` etc.
//!    These properties are only used in *either* enter or exit phase.
//!    State cannot be shared between enter and exit phases in these properties, as they'll get clobbered
//!    if there's a nested class within this one.
//!
//! We don't store all state in `ClassDetails` as a performance optimization.
//! It reduces the size of `ClassDetails` which has be repeatedly pushed and popped from stack,
//! and allows reusing same `Vec`s and `FxHashMap`s for each class, rather than creating new each time.
//!
//! ### Files
//!
//! Implementation is split into several files:
//!
//! * `mod.rs`:                        Setup and visitor.
//! * `class.rs`:                      Transform of class body.
//! * `prop_decl.rs`:                  Transform of property declarations (instance and static).
//! * `constructor.rs`:                Insertion of property initializers into class constructor.
//! * `instance_prop_init.rs`:         Transform of instance property initializers.
//! * `static_block_and_prop_init.rs`: Transform of static property initializers and static blocks.
//! * `computed_key.rs`:               Transform of property/method computed keys.
//! * `private_field.rs`:              Transform of private fields (`this.#prop`).
//! * `private_method.rs`:             Transform of private methods (`this.#method()`).
//! * `super_converter.rs`:            Transform `super` expressions.
//! * `class_details.rs`:              Structures containing details of classes and private properties.
//! * `class_bindings.rs`:             Structure containing bindings for class name and temp var.
//! * `utils.rs`:                      Utility functions.
//!
//! ## References
//!
//! * Babel plugin implementation:
//!   * <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-class-properties>
//!   * <https://github.com/babel/babel/blob/v7.26.2/packages/babel-helper-create-class-features-plugin/src/index.ts>
//!   * <https://github.com/babel/babel/blob/v7.26.2/packages/babel-helper-create-class-features-plugin/src/fields.ts>
//! * Class properties TC39 proposal: <https://github.com/tc39/proposal-class-fields>

use indexmap::IndexMap;
use rustc_hash::{FxBuildHasher, FxHashMap};
use serde::Deserialize;

use oxc_ast::ast::*;
use oxc_span::Atom;
use oxc_syntax::symbol::SymbolId;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod class;
mod class_bindings;
mod class_details;
mod computed_key;
mod constructor;
mod instance_prop_init;
mod private_field;
mod private_method;
mod prop_decl;
mod static_block_and_prop_init;
mod super_converter;
mod utils;
use class_bindings::ClassBindings;
use class_details::{ClassDetails, ClassesStack, PrivateProp, ResolvedPrivateProp};

type FxIndexMap<K, V> = IndexMap<K, V, FxBuildHasher>;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub struct ClassPropertiesOptions {
    pub loose: bool,
}

/// Class properties transform.
///
/// See [module docs] for details.
///
/// [module docs]: self
pub struct ClassProperties<'a, 'ctx> {
    // ----- Options -----
    //
    /// If `true`, set properties with `=`, instead of `_defineProperty` helper (loose option).
    set_public_class_fields: bool,
    /// If `true`, store private properties as normal properties as string keys (loose option).
    private_fields_as_properties: bool,
    /// If `true`, transform static blocks.
    transform_static_blocks: bool,
    /// If `true`, remove class fields without initializer. Only works with `set_public_class_fields: true`.
    ///
    /// This option is controlled by [`crate::TypeScriptOptions::remove_class_fields_without_initializer`].
    remove_class_fields_without_initializer: bool,

    ctx: &'ctx TransformCtx<'a>,

    // ----- State used during all phases of transform -----
    //
    /// Stack of classes.
    /// Pushed to when entering a class, popped when exiting.
    ///
    /// The way stack is used is not perfect, because pushing to/popping from it in
    /// `enter_class_body` / `exit_expression`. If another transform replaces/removes the class
    /// in an earlier `exit_expression` visitor, then stack will get out of sync.
    /// I (@overlookmotel) don't think there's a solution to this, and I don't think any other
    /// transforms will remove a class expression in this way, so should be OK.
    /// This problem only affects class expressions. Class declarations aren't affected,
    /// as their exit-phase transform happens in `exit_class`.
    classes_stack: ClassesStack<'a>,
    /// Count of private fields in current class and parent classes.
    private_field_count: usize,

    // ----- State used only during enter phase -----
    //
    /// Symbols in constructor which clash with instance prop initializers.
    /// Keys are symbols' IDs.
    /// Values are initially the original name of binding, later on the name of new UID name.
    clashing_constructor_symbols: FxHashMap<SymbolId, Atom<'a>>,

    // ----- State used only during exit phase -----
    //
    /// Expressions to insert before class
    insert_before: Vec<Expression<'a>>,
    /// Expressions to insert after class expression
    insert_after_exprs: Vec<Expression<'a>>,
    /// Statements to insert after class declaration
    insert_after_stmts: Vec<Statement<'a>>,
}

impl<'a, 'ctx> ClassProperties<'a, 'ctx> {
    /// Create `ClassProperties` transformer
    pub fn new(
        options: ClassPropertiesOptions,
        transform_static_blocks: bool,
        remove_class_fields_without_initializer: bool,
        ctx: &'ctx TransformCtx<'a>,
    ) -> Self {
        // TODO: Raise error if these 2 options are inconsistent
        let set_public_class_fields = options.loose || ctx.assumptions.set_public_class_fields;
        // TODO: Raise error if these 2 options are inconsistent
        let private_fields_as_properties =
            options.loose || ctx.assumptions.private_fields_as_properties;

        Self {
            set_public_class_fields,
            private_fields_as_properties,
            transform_static_blocks,
            remove_class_fields_without_initializer,
            ctx,
            classes_stack: ClassesStack::new(),
            private_field_count: 0,
            // `Vec`s and `FxHashMap`s which are reused for every class being transformed
            clashing_constructor_symbols: FxHashMap::default(),
            insert_before: vec![],
            insert_after_exprs: vec![],
            insert_after_stmts: vec![],
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ClassProperties<'a, '_> {
    #[expect(clippy::inline_always)]
    #[inline(always)] // Because this is a no-op in release mode
    fn exit_program(&mut self, _program: &mut Program<'a>, _ctx: &mut TraverseCtx<'a>) {
        debug_assert_eq!(self.private_field_count, 0);
    }

    fn enter_class_body(&mut self, body: &mut ClassBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.transform_class_body_on_entry(body, ctx);
    }

    fn exit_class(&mut self, class: &mut Class<'a>, ctx: &mut TraverseCtx<'a>) {
        self.transform_class_declaration_on_exit(class, ctx);
    }

    // `#[inline]` for fast exit for expressions which are not `Class`es
    #[inline]
    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if matches!(expr, Expression::ClassExpression(_)) {
            self.transform_class_expression_on_exit(expr, ctx);
        }
    }

    // `#[inline]` for fast exit for expressions which are not any of the transformed types
    #[inline]
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        // All of transforms below only act on `PrivateFieldExpression`s or `PrivateInExpression`s.
        // If we're not inside a class which has private fields, `#prop` can't be present here,
        // so exit early - fast path for common case.
        if self.private_field_count == 0 {
            return;
        }

        match expr {
            // `object.#prop`
            Expression::PrivateFieldExpression(_) => {
                self.transform_private_field_expression(expr, ctx);
            }
            // `object.#prop()`
            Expression::CallExpression(_) => {
                self.transform_call_expression(expr, ctx);
            }
            // `object.#prop = value`, `object.#prop += value`, `object.#prop ??= value` etc
            Expression::AssignmentExpression(_) => {
                self.transform_assignment_expression(expr, ctx);
            }
            // `object.#prop++`, `--object.#prop`
            Expression::UpdateExpression(_) => {
                self.transform_update_expression(expr, ctx);
            }
            // `object?.#prop`
            Expression::ChainExpression(_) => {
                self.transform_chain_expression(expr, ctx);
            }
            // `delete object?.#prop.xyz`
            Expression::UnaryExpression(_) => {
                self.transform_unary_expression(expr, ctx);
            }
            // "object.#prop`xyz`"
            Expression::TaggedTemplateExpression(_) => {
                self.transform_tagged_template_expression(expr, ctx);
            }
            // "#prop in object"
            Expression::PrivateInExpression(_) => {
                self.transform_private_in_expression(expr, ctx);
            }
            _ => {}
        }
    }

    // `#[inline]` for fast exit for assignment targets which are not private fields (rare case)
    #[inline]
    fn enter_assignment_target(
        &mut self,
        target: &mut AssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.transform_assignment_target(target, ctx);
    }

    fn enter_property_definition(
        &mut self,
        prop: &mut PropertyDefinition<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Ignore `declare` properties as they don't have any runtime effect,
        // and will be removed in the TypeScript transform later
        if prop.r#static && !prop.declare {
            self.flag_entering_static_property_or_block();
        }
    }

    fn exit_property_definition(
        &mut self,
        prop: &mut PropertyDefinition<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Ignore `declare` properties as they don't have any runtime effect,
        // and will be removed in the TypeScript transform later
        if prop.r#static && !prop.declare {
            self.flag_exiting_static_property_or_block();
        }
    }

    fn enter_static_block(&mut self, _block: &mut StaticBlock<'a>, _ctx: &mut TraverseCtx<'a>) {
        self.flag_entering_static_property_or_block();
    }

    fn exit_static_block(&mut self, _block: &mut StaticBlock<'a>, _ctx: &mut TraverseCtx<'a>) {
        self.flag_exiting_static_property_or_block();
    }
}
