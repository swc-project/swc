//! ES2022: Class Properties
//! Transform of class itself.

use indexmap::map::Entry;
use oxc_allocator::{Address, GetAddress, TakeIn};
use oxc_ast::{ast::*, NONE};
use oxc_span::SPAN;
use oxc_syntax::{
    node::NodeId,
    reference::ReferenceFlags,
    scope::ScopeFlags,
    symbol::{SymbolFlags, SymbolId},
};
use oxc_traverse::{Ancestor, BoundIdentifier};

use super::{
    constructor::InstanceInitsInsertLocation,
    utils::{create_variable_declaration, exprs_into_stmts},
    ClassBindings, ClassDetails, ClassProperties, FxIndexMap, PrivateProp,
};
use crate::{
    common::helper_loader::Helper,
    context::{TransformCtx, TraverseCtx},
    utils::ast_builder::create_assignment,
};

// TODO(improve-on-babel): If outer scope is sloppy mode, all code which is
// moved to outside the class should be wrapped in an IIFE with `'use strict'`
// directive. Babel doesn't do this.

// TODO: If static blocks transform is disabled, it's possible to get incorrect
// execution order. ```js
// class C {
//     static x = console.log('x');
//     static {
//         console.log('block');
//     }
//     static y = console.log('y');
// }
// ```
// This logs "x", "block", "y". But in transformed output it'd be "block", "x",
// "y". Maybe force transform of static blocks if any static properties?
// Or alternatively could insert static property initializers into static
// blocks.

impl<'a> ClassProperties<'a, '_> {
    /// Perform first phase of transformation of class.
    ///
    /// This is the only entry point into the transform upon entering class
    /// body.
    ///
    /// First we check if any transforms are necessary, and exit if not.
    ///
    /// If transform is required:
    /// * Build a hashmap of private property keys.
    /// * Push `ClassDetails` containing info about the class to
    ///   `classes_stack`.
    /// * Extract instance property initializers (public or private) from class
    ///   body and insert into class constructor.
    /// * Temporarily replace computed keys of instance properties with
    ///   assignments to temp vars. `class C { [foo()] = 123; }` -> `class C {
    ///   [_foo = foo()]; }`
    pub(super) fn transform_class_body_on_entry(
        &mut self,
        body: &mut ClassBody<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Ignore TS class declarations
        // TODO: Is this correct?
        let Ancestor::ClassBody(class) = ctx.parent() else {
            unreachable!()
        };
        if *class.declare() {
            return;
        }

        // Get basic details about class
        let is_declaration = *class.r#type() == ClassType::ClassDeclaration;
        let mut class_name_binding = class.id().as_ref().map(BoundIdentifier::from_binding_ident);
        let class_scope_id = class.scope_id().get().unwrap();
        let has_super_class = class.super_class().is_some();

        // Check if class has any properties, private methods, or static blocks
        let mut instance_prop_count = 0;
        let mut has_static_prop = false;
        let mut has_instance_private_method = false;
        let mut has_static_private_method_or_static_block = false;
        // TODO: Store `FxIndexMap`s in a pool and re-use them
        let mut private_props = FxIndexMap::default();
        for element in &mut body.body {
            match element {
                ClassElement::PropertyDefinition(prop) => {
                    // TODO: Throw error if property has decorators

                    // Ignore `declare` properties as they don't have any runtime effect,
                    // and will be removed in the TypeScript transform later
                    if prop.declare {
                        continue;
                    }

                    // Create binding for private property key
                    if let PropertyKey::PrivateIdentifier(ident) = &prop.key {
                        // Note: Current scope is outside class.
                        let binding = ctx.generate_uid_in_current_hoist_scope(&ident.name);
                        private_props.insert(
                            ident.name,
                            PrivateProp::new(binding, prop.r#static, None, false),
                        );
                    }

                    if prop.r#static {
                        has_static_prop = true;
                    } else {
                        instance_prop_count += 1;
                    }
                }
                ClassElement::StaticBlock(_) => {
                    // Static block only necessitates transforming class if it's being transformed
                    if self.transform_static_blocks {
                        has_static_private_method_or_static_block = true;
                    }
                }
                ClassElement::MethodDefinition(method) => {
                    if let PropertyKey::PrivateIdentifier(ident) = &method.key {
                        if method.r#static {
                            has_static_private_method_or_static_block = true;
                        } else {
                            has_instance_private_method = true;
                        }

                        let name = match method.kind {
                            MethodDefinitionKind::Method => ident.name.as_str(),
                            MethodDefinitionKind::Get => &format!("get_{}", ident.name),
                            MethodDefinitionKind::Set => &format!("set_{}", ident.name),
                            MethodDefinitionKind::Constructor => unreachable!(),
                        };
                        let binding = ctx.generate_uid(
                            name,
                            ctx.current_block_scope_id(),
                            SymbolFlags::Function,
                        );

                        match private_props.entry(ident.name) {
                            Entry::Occupied(mut entry) => {
                                // If there's already a binding for this private property,
                                // it's a setter or getter, so store the binding in `binding2`.
                                entry.get_mut().set_binding2(binding);
                            }
                            Entry::Vacant(entry) => {
                                entry.insert(PrivateProp::new(
                                    binding,
                                    method.r#static,
                                    Some(method.kind),
                                    false,
                                ));
                            }
                        }
                    }
                }
                ClassElement::AccessorProperty(prop) => {
                    // TODO: Not sure what we should do here.
                    // Only added this to prevent panics in TS conformance tests.
                    if let PropertyKey::PrivateIdentifier(ident) = &prop.key {
                        let dummy_binding = BoundIdentifier::new(Atom::empty(), SymbolId::new(0));
                        private_props.insert(
                            ident.name,
                            PrivateProp::new(dummy_binding, prop.r#static, None, true),
                        );
                    }
                }
                ClassElement::TSIndexSignature(_) => {
                    // TODO: Need to handle this?
                }
            }
        }

        self.private_field_count += private_props.len();

        // Exit if nothing to transform
        if instance_prop_count == 0
            && !has_static_prop
            && !has_static_private_method_or_static_block
            && !has_instance_private_method
        {
            self.classes_stack.push(ClassDetails {
                is_declaration,
                is_transform_required: false,
                private_props: if private_props.is_empty() {
                    None
                } else {
                    Some(private_props)
                },
                bindings: ClassBindings::dummy(),
            });
            return;
        }

        // Initialize class binding vars.
        // Static prop in class expression or anonymous `export default class {}` always
        // require temp var for class. Static prop in class declaration doesn't.
        let need_temp_var = has_static_prop && (!is_declaration || class_name_binding.is_none());

        let outer_hoist_scope_id = ctx.current_hoist_scope_id();
        let class_temp_binding = if need_temp_var {
            let temp_binding = ClassBindings::create_temp_binding(
                class_name_binding.as_ref(),
                outer_hoist_scope_id,
                ctx,
            );
            if is_declaration {
                // Anonymous `export default class {}`. Set class name binding to temp var.
                // Actual class name will be set to this later.
                class_name_binding = Some(temp_binding.clone());
            } else {
                // Create temp var `var _Class;` statement.
                // TODO(improve-on-babel): Inserting the temp var `var _Class` statement here is
                // only to match Babel's output. It'd be simpler just to insert
                // it at the end and get rid of `temp_var_is_created` that
                // tracks whether it's done already or not.
                self.ctx.var_declarations.insert_var(&temp_binding, ctx);
            }
            Some(temp_binding)
        } else {
            None
        };

        let class_brand_binding = has_instance_private_method.then(|| {
            // `_Class_brand`
            let name = class_name_binding
                .as_ref()
                .map_or_else(|| "Class", |binding| &binding.name);
            let name = &format!("_{name}_brand");
            ctx.generate_uid_in_current_hoist_scope(name)
        });

        let static_private_fields_use_temp = !is_declaration;
        let class_bindings = ClassBindings::new(
            class_name_binding,
            class_temp_binding,
            class_brand_binding,
            outer_hoist_scope_id,
            static_private_fields_use_temp,
            need_temp_var,
        );

        // Add entry to `classes_stack`
        self.classes_stack.push(ClassDetails {
            is_declaration,
            is_transform_required: true,
            private_props: if private_props.is_empty() {
                None
            } else {
                Some(private_props)
            },
            bindings: class_bindings,
        });

        // Exit if no instance properties (public or private)
        if instance_prop_count == 0 && !has_instance_private_method {
            return;
        }

        // Extract instance properties initializers.
        //
        // We leave the properties themselves in place, but take the initializers.
        // `class C { prop = 123; }` -> `class { prop; }`
        // Leave them in place to avoid shifting up all the elements twice.
        // We already have to do that in exit phase, so better to do it all at once.
        //
        // Also replace any instance property computed keys with an assignment to temp
        // var. `class C { [foo()] = 123; }` -> `class C { [_foo = foo()]; }`
        // Those assignments will be moved to before class in exit phase of the
        // transform. -> `_foo = foo(); class C {}`
        let mut instance_inits =
            Vec::with_capacity(instance_prop_count + usize::from(has_instance_private_method));

        // `_classPrivateMethodInitSpec(this, _C_brand);`
        if has_instance_private_method {
            instance_inits.push(self.create_class_private_method_init_spec(ctx));
        }

        let mut constructor = None;
        for element in &mut body.body {
            #[expect(clippy::match_same_arms)]
            match element {
                ClassElement::PropertyDefinition(prop) => {
                    // Ignore `declare` properties as they don't have any runtime effect,
                    // and will be removed in the TypeScript transform later
                    if !prop.r#static && !prop.declare {
                        self.convert_instance_property(prop, &mut instance_inits, ctx);
                    }
                }
                ClassElement::MethodDefinition(method) => {
                    if method.kind == MethodDefinitionKind::Constructor
                        && method.value.body.is_some()
                    {
                        constructor = Some(method.value.as_mut());
                    }
                }
                ClassElement::AccessorProperty(_) | ClassElement::TSIndexSignature(_) => {
                    // TODO: Need to handle these?
                }
                ClassElement::StaticBlock(_) => {}
            }
        }

        // When `self.set_public_class_fields` and
        // `self.remove_class_fields_without_initializer` are both true,
        // we don't need to convert properties without initializers, that means
        // `instance_prop_count != 0` but `instance_inits` may be empty.
        if instance_inits.is_empty() {
            return;
        }

        // Scope that instance property initializers will be inserted into.
        // This is usually class constructor, but can also be a `_super` function which
        // is created.
        let instance_inits_scope_id;
        // Scope of class constructor, if instance property initializers will be
        // inserted into constructor. Used for checking for variable name
        // clashes. e.g. `class C { prop = x(); constructor(x) {} }`
        // - `x` in constructor needs to be renamed when `x()` is moved into constructor
        //   body.
        // `None` if class has no existing constructor, as then there can't be any
        // clashes.
        let mut instance_inits_constructor_scope_id = None;

        // Determine where to insert instance property initializers in constructor
        let instance_inits_insert_location = if let Some(constructor) = constructor.as_deref_mut() {
            if has_super_class {
                let (insert_scopes, insert_location) =
                    Self::replace_super_in_constructor(constructor, ctx);
                instance_inits_scope_id = insert_scopes.insert_in_scope_id;
                instance_inits_constructor_scope_id = insert_scopes.constructor_scope_id;
                insert_location
            } else {
                let constructor_scope_id = constructor.scope_id();
                instance_inits_scope_id = constructor_scope_id;
                // Only record `constructor_scope_id` if constructor's scope has some bindings.
                // If it doesn't, no need to check for shadowed symbols in instance prop
                // initializers, because no bindings to clash with.
                instance_inits_constructor_scope_id =
                    if ctx.scoping().get_bindings(constructor_scope_id).is_empty() {
                        None
                    } else {
                        Some(constructor_scope_id)
                    };
                InstanceInitsInsertLocation::ExistingConstructor(0)
            }
        } else {
            // No existing constructor - create scope for one
            let constructor_scope_id = ctx.scoping_mut().add_scope(
                Some(class_scope_id),
                NodeId::DUMMY,
                ScopeFlags::Function | ScopeFlags::Constructor | ScopeFlags::StrictMode,
            );
            instance_inits_scope_id = constructor_scope_id;
            InstanceInitsInsertLocation::NewConstructor
        };

        // Reparent property initializers scope to `instance_inits_scope_id`.
        self.reparent_initializers_scope(
            instance_inits.as_slice(),
            instance_inits_scope_id,
            instance_inits_constructor_scope_id,
            ctx,
        );

        // Insert instance initializers into constructor.
        // Create a constructor if there isn't one.
        match instance_inits_insert_location {
            InstanceInitsInsertLocation::NewConstructor => {
                Self::insert_constructor(
                    body,
                    instance_inits,
                    has_super_class,
                    instance_inits_scope_id,
                    ctx,
                );
            }
            InstanceInitsInsertLocation::ExistingConstructor(stmt_index) => {
                self.insert_inits_into_constructor_as_statements(
                    constructor.as_mut().unwrap(),
                    instance_inits,
                    stmt_index,
                    ctx,
                );
            }
            InstanceInitsInsertLocation::SuperFnInsideConstructor(super_binding) => {
                self.create_super_function_inside_constructor(
                    constructor.as_mut().unwrap(),
                    instance_inits,
                    &super_binding,
                    instance_inits_scope_id,
                    ctx,
                );
            }
            InstanceInitsInsertLocation::SuperFnOutsideClass(super_binding) => {
                self.create_super_function_outside_constructor(
                    instance_inits,
                    &super_binding,
                    instance_inits_scope_id,
                    ctx,
                );
            }
        }
    }

    /// Transform class declaration on exit.
    ///
    /// This is the exit phase of the transform. Only applies to class
    /// *declarations*. Class *expressions* are handled in
    /// [`ClassProperties::transform_class_expression_on_exit`] below.
    /// Both functions do much the same, `transform_class_expression_on_exit`
    /// inserts items as expressions, whereas here we insert as statements.
    ///
    /// At this point, other transforms have had a chance to run on the class
    /// body, so we can move parts of the code out to before/after the class
    /// now.
    ///
    /// * Transform static properties and insert after class.
    /// * Transform static blocks and insert after class.
    /// * Extract computed key assignments and insert them before class.
    /// * Remove all properties and static blocks from class body.
    ///
    /// Items needing insertion before/after class are inserted as statements.
    ///
    /// `class C { static [foo()] = 123; static { bar(); } }`
    /// -> `_foo = foo(); class C {}; C[_foo] = 123; bar();`
    pub(super) fn transform_class_declaration_on_exit(
        &mut self,
        class: &mut Class<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Ignore TS class declarations
        // TODO: Is this correct?
        if class.declare {
            return;
        }

        // Leave class expressions to `transform_class_expression_on_exit`
        let class_details = self.current_class();
        if !class_details.is_declaration {
            return;
        }

        // Finish transform
        if class_details.is_transform_required {
            self.transform_class_declaration_on_exit_impl(class, ctx);
        } else {
            debug_assert!(class_details.bindings.temp.is_none());
        }
        // Pop off stack. We're done!
        let class_details = self.classes_stack.pop();
        if let Some(private_props) = &class_details.private_props {
            // Note: `private_props` can be non-empty even if `is_transform_required ==
            // false`, if class contains private accessors, which we don't
            // transform yet
            self.private_field_count -= private_props.len();
        }
    }

    fn transform_class_declaration_on_exit_impl(
        &mut self,
        class: &mut Class<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Static properties and static blocks
        self.current_class_mut()
            .bindings
            .static_private_fields_use_temp = true;

        // Transform static properties, remove static and instance properties, and move
        // computed keys to before class
        self.transform_class_elements(class, ctx);

        // Insert temp var for class if required. Name class if required.
        let class_details = self.classes_stack.last_mut();
        if let Some(temp_binding) = &class_details.bindings.temp {
            // Binding for class name is required
            if let Some(ident) = &class.id {
                // Insert `var _Class` statement, if it wasn't already in entry phase
                if !class_details.bindings.temp_var_is_created {
                    self.ctx.var_declarations.insert_var(temp_binding, ctx);
                }

                // Insert `_Class = Class` after class.
                // TODO(improve-on-babel): Could just insert `var _Class = Class;` after class,
                // rather than separate `var _Class` declaration.
                let class_name =
                    BoundIdentifier::from_binding_ident(ident).create_read_expression(ctx);
                let expr = create_assignment(temp_binding, class_name, ctx);
                let stmt = ctx.ast.statement_expression(SPAN, expr);
                self.insert_after_stmts.insert(0, stmt);
            } else {
                // Class must be default export `export default class {}`, as all other class
                // declarations always have a name. Set class name.
                *ctx.scoping_mut().symbol_flags_mut(temp_binding.symbol_id) = SymbolFlags::Class;
                class.id = Some(temp_binding.create_binding_identifier(ctx));
            }
        }

        // Insert statements before/after class
        let stmt_address = match ctx.parent() {
            parent @ (Ancestor::ExportDefaultDeclarationDeclaration(_)
            | Ancestor::ExportNamedDeclarationDeclaration(_)) => parent.address(),
            // `Class` is always stored in a `Box`, so has a stable memory location
            _ => Address::from_ref(class),
        };

        if !self.insert_before.is_empty() {
            self.ctx.statement_injector.insert_many_before(
                &stmt_address,
                exprs_into_stmts(self.insert_before.drain(..), ctx),
            );
        }

        if let Some(private_props) = &class_details.private_props {
            if self.private_fields_as_properties {
                let mut private_props = private_props
                    .iter()
                    .filter_map(|(&name, prop)| {
                        // TODO: Output `var _C_brand = new WeakSet();` for private instance method
                        if prop.is_method() || prop.is_accessor {
                            return None;
                        }

                        // `var _prop = _classPrivateFieldLooseKey("prop");`
                        let value = Self::create_private_prop_key_loose(name, self.ctx, ctx);
                        Some(create_variable_declaration(&prop.binding, value, ctx))
                    })
                    .peekable();
                if private_props.peek().is_some() {
                    self.ctx
                        .statement_injector
                        .insert_many_before(&stmt_address, private_props);
                }
            } else {
                let mut weakmap_symbol_id = None;
                let mut has_method = false;
                let mut private_props = private_props
                    .values()
                    .filter_map(|prop| {
                        if prop.is_static || (prop.is_method() && has_method) || prop.is_accessor {
                            return None;
                        }
                        if prop.is_method() {
                            // `var _C_brand = new WeakSet();`
                            has_method = true;
                            let binding = class_details.bindings.brand();
                            let value = create_new_weakset(ctx);
                            Some(create_variable_declaration(binding, value, ctx))
                        } else {
                            // `var _prop = new WeakMap();`
                            let value = create_new_weakmap(&mut weakmap_symbol_id, ctx);
                            Some(create_variable_declaration(&prop.binding, value, ctx))
                        }
                    })
                    .peekable();
                if private_props.peek().is_some() {
                    self.ctx
                        .statement_injector
                        .insert_many_before(&stmt_address, private_props);
                }
            }
        }

        if !self.insert_after_stmts.is_empty() {
            self.ctx
                .statement_injector
                .insert_many_after(&stmt_address, self.insert_after_stmts.drain(..));
        }
    }

    /// Transform class expression on exit.
    ///
    /// This is the exit phase of the transform. Only applies to class
    /// *expressions*. Class *expressions* are handled in
    /// [`ClassProperties::transform_class_declaration_on_exit`] above. Both
    /// functions do much the same, `transform_class_declaration_on_exit`
    /// inserts items as statements, whereas here we insert as expressions.
    ///
    /// At this point, other transforms have had a chance to run on the class
    /// body, so we can move parts of the code out to before/after the class
    /// now.
    ///
    /// * Transform static properties and insert after class.
    /// * Transform static blocks and insert after class.
    /// * Extract computed key assignments and insert them before class.
    /// * Remove all properties and static blocks from class body.
    ///
    /// Items needing insertion before/after class are inserted as expressions
    /// around, surrounding class in a [`SequenceExpression`].
    ///
    /// `let C = class { static [foo()] = 123; static { bar(); } };`
    /// -> `let C = (_foo = foo(), _Class = class {}, _Class[_foo] = 123, bar(),
    /// _Class);`
    pub(super) fn transform_class_expression_on_exit(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::ClassExpression(class) = expr else {
            unreachable!()
        };

        // Ignore TS class declarations
        // TODO: Is this correct?
        if class.declare {
            return;
        }

        // Finish transform
        let class_details = self.current_class();
        if class_details.is_transform_required {
            self.transform_class_expression_on_exit_impl(expr, ctx);
        } else {
            debug_assert!(class_details.bindings.temp.is_none());
        }

        // Pop off stack. We're done!
        let class_details = self.classes_stack.pop();
        if let Some(private_props) = &class_details.private_props {
            // Note: `private_props` can be non-empty even if `is_transform_required ==
            // false`, if class contains private accessors, which we don't
            // transform yet
            self.private_field_count -= private_props.len();
        }
    }

    fn transform_class_expression_on_exit_impl(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::ClassExpression(class) = expr else {
            unreachable!()
        };

        // Transform static properties, remove static and instance properties, and move
        // computed keys to before class
        self.transform_class_elements(class, ctx);

        // Insert expressions before / after class.
        // `C = class { [x()] = 1; static y = 2 };`
        // -> `C = (_x = x(), _Class = class C { constructor() { this[_x] = 1; } },
        // _Class.y = 2, _Class)`

        // TODO: Name class if had no name, and name is statically knowable (as in
        // example above). If class name shadows var which is referenced within
        // class, rename that var. `var C = class { prop = C }; var C2 = C;`
        // -> `var _C = class C { constructor() { this.prop = _C; } }; var C2 = _C;`
        // This is really difficult as need to rename all references to that binding
        // too, which can be very far above the class in AST, when it's a `var`.
        // Maybe for now only add class name if it doesn't shadow a var used within
        // class?

        // TODO: Deduct static private props and private methods from `expr_count`.
        // Or maybe should store count and increment it when create private static props
        // or private methods? They're probably pretty rare, so it'll be rarely
        // used.
        let class_details = self.classes_stack.last();

        let mut expr_count = self.insert_before.len() + self.insert_after_exprs.len();
        if let Some(private_props) = &class_details.private_props {
            expr_count += private_props.len();
        }

        // Exit if no expressions to insert before or after class
        if expr_count == 0 {
            return;
        }

        expr_count += 1 + usize::from(class_details.bindings.temp.is_some());

        let mut exprs = ctx.ast.vec_with_capacity(expr_count);

        // Insert `_prop = new WeakMap()` expressions for private instance props
        // (or `_prop = _classPrivateFieldLooseKey("prop")` if loose mode).
        // Babel has these always go first, regardless of order of class elements.
        // Also insert `var _prop;` temp var declarations for private static props.
        if let Some(private_props) = &class_details.private_props {
            // Insert `var _prop;` declarations here rather than when binding was created to
            // maintain same order of `var` declarations as Babel.
            // `c = class C { #x = 1; static y = 2; }` -> `var _C, _x;`
            // TODO(improve-on-babel): Simplify this.
            if self.private_fields_as_properties {
                exprs.extend(private_props.iter().filter_map(|(&name, prop)| {
                    // TODO: Output `_C_brand = new WeakSet()` for private instance method
                    if prop.is_method() || prop.is_accessor {
                        return None;
                    }

                    // Insert `var _prop;` declaration
                    self.ctx.var_declarations.insert_var(&prop.binding, ctx);

                    // `_prop = _classPrivateFieldLooseKey("prop")`
                    let value = Self::create_private_prop_key_loose(name, self.ctx, ctx);
                    Some(create_assignment(&prop.binding, value, ctx))
                }));
            } else {
                let mut weakmap_symbol_id = None;
                let mut has_method = false;
                exprs.extend(private_props.values().filter_map(|prop| {
                    if prop.is_accessor {
                        return None;
                    }

                    if prop.is_method() {
                        if prop.is_static || has_method {
                            return None;
                        }
                        has_method = true;
                        // `_C_brand = new WeakSet()`
                        let binding = class_details.bindings.brand();
                        self.ctx.var_declarations.insert_var(binding, ctx);
                        let value = create_new_weakset(ctx);
                        return Some(create_assignment(binding, value, ctx));
                    }

                    // Insert `var _prop;` declaration
                    self.ctx.var_declarations.insert_var(&prop.binding, ctx);

                    if prop.is_static {
                        return None;
                    }

                    // `_prop = new WeakMap()`
                    let value = create_new_weakmap(&mut weakmap_symbol_id, ctx);
                    Some(create_assignment(&prop.binding, value, ctx))
                }));
            }
        }

        // Insert private methods
        if !self.insert_after_stmts.is_empty() {
            // Find `Address` of statement containing class expression
            let mut stmt_address = Address::DUMMY;
            for ancestor in ctx.ancestors() {
                if ancestor.is_parent_of_statement() {
                    break;
                }
                stmt_address = ancestor.address();
            }

            self.ctx
                .statement_injector
                .insert_many_after(&stmt_address, self.insert_after_stmts.drain(..));
        }

        // Insert computed key initializers
        exprs.extend(self.insert_before.drain(..));

        // Insert class + static property assignments + static blocks
        if let Some(binding) = &class_details.bindings.temp {
            // Insert `var _Class` statement, if it wasn't already in entry phase
            if !class_details.bindings.temp_var_is_created {
                self.ctx.var_declarations.insert_var(binding, ctx);
            }

            // `_Class = class {}`
            let class_expr = expr.take_in(ctx.ast);
            let assignment = create_assignment(binding, class_expr, ctx);

            if exprs.is_empty() && self.insert_after_exprs.is_empty() {
                // No need to wrap in sequence if no static property
                // and static blocks
                *expr = assignment;
                return;
            }

            exprs.push(assignment);
            // Add static property assignments + static blocks
            exprs.extend(self.insert_after_exprs.drain(..));
            // `_Class`
            exprs.push(binding.create_read_expression(ctx));
        } else {
            // Add static blocks (which didn't reference class name)
            // TODO: If class has `extends` clause, and it may have side effects, then
            // static block contents goes after class expression, and temp var
            // is called `_temp` not `_Class`. `let C = class extends Unbound {
            // static { x = 1; } };` -> `var _temp; let C = ((_temp = class C
            // extends Unbound {}), (x = 1), _temp);` `let C = class extends
            // Bound { static { x = 1; } };` -> `let C = ((x = 1), class C
            // extends Bound {});`
            exprs.extend(self.insert_after_exprs.drain(..));

            if exprs.is_empty() {
                return;
            }

            let class_expr = expr.take_in(ctx.ast);
            exprs.push(class_expr);
        }

        debug_assert!(exprs.len() > 1);
        debug_assert!(exprs.len() <= expr_count);

        *expr = ctx.ast.expression_sequence(SPAN, exprs);
    }

    /// Transform class elements.
    ///
    /// This is part of the exit phase of transform, performed on both class
    /// declarations and class expressions.
    ///
    /// At this point, other transforms have had a chance to run on the class
    /// body, so we can move parts of the code out to before/after the class
    /// now.
    ///
    /// * Transform static properties and insert after class.
    /// * Transform static blocks and insert after class.
    /// * Transform private methods and insert after class.
    /// * Extract computed key assignments and insert them before class.
    /// * Remove all properties, private methods and static blocks from class
    ///   body.
    fn transform_class_elements(&mut self, class: &mut Class<'a>, ctx: &mut TraverseCtx<'a>) {
        let mut class_methods = vec![];
        class.body.body.retain_mut(|element| {
            match element {
                ClassElement::PropertyDefinition(prop) => {
                    debug_assert!(
                        !prop.declare,
                        "`declare` property should have been removed in the TypeScript plugin's \
                         `exit_class`"
                    );
                    if prop.r#static {
                        self.convert_static_property(prop, ctx);
                    } else if prop.computed {
                        self.extract_instance_prop_computed_key(prop, ctx);
                    }
                    return false;
                }
                ClassElement::StaticBlock(block) => {
                    if self.transform_static_blocks {
                        self.convert_static_block(block, ctx);
                        return false;
                    }
                }
                ClassElement::MethodDefinition(method) => {
                    self.substitute_temp_var_for_method_computed_key(method, ctx);
                    if let Some(statement) = self.convert_private_method(method, ctx) {
                        class_methods.push(statement);
                        return false;
                    }
                }
                ClassElement::AccessorProperty(_) | ClassElement::TSIndexSignature(_) => {
                    // TODO: Need to handle these?
                }
            }

            true
        });

        // All methods are moved to after the class, but need to be before static
        // properties TODO(improve-on-babel): Insertion order doesn't matter,
        // and it more clear to insert according to definition order.
        self.insert_after_stmts.splice(0..0, class_methods);
    }

    /// Flag that static private fields should be transpiled using temp binding,
    /// while in this static property or static block.
    ///
    /// We turn `static_private_fields_use_temp` on and off when entering
    /// exiting static context.
    ///
    /// Static private fields reference class name (not temp var) in class
    /// declarations. `class Class { static #privateProp; method() { return
    /// obj.#privateProp; } }` -> `method() { return
    /// _assertClassBrand(Class, obj, _privateProp)._; }`                   
    /// ^^^^^
    ///
    /// But in static properties and static blocks, they use the temp var.
    /// `class Class { static #privateProp; static publicProp =
    /// obj.#privateProp; }` -> `Class.publicProp =
    /// _assertClassBrand(_Class, obj, _privateProp)._`                     
    /// ^^^^^^
    ///
    /// Also see comments on `ClassBindings`.
    ///
    /// Note: If declaration is `export default class {}` with no name, and
    /// class has static props, then class has had name binding created
    /// already in `transform_class`. So name binding is always `Some`.
    pub(super) fn flag_entering_static_property_or_block(&mut self) {
        // No need to check if class is a declaration, because
        // `static_private_fields_use_temp` is always `true` for class
        // expressions anyway
        self.current_class_mut()
            .bindings
            .static_private_fields_use_temp = true;
    }

    /// Flag that static private fields should be transpiled using name binding
    /// again as we're exiting this static property or static block.
    /// (see [`ClassProperties::flag_entering_static_property_or_block`])
    pub(super) fn flag_exiting_static_property_or_block(&mut self) {
        // Flag that transpiled static private props use name binding in class
        // declarations
        let class_details = self.current_class_mut();
        if class_details.is_declaration {
            class_details.bindings.static_private_fields_use_temp = false;
        }
    }

    /// `_classPrivateFieldLooseKey("prop")`
    fn create_private_prop_key_loose(
        name: Atom<'a>,
        transform_ctx: &TransformCtx<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        transform_ctx.helper_call_expr(
            Helper::ClassPrivateFieldLooseKey,
            SPAN,
            ctx.ast.vec1(Argument::from(
                ctx.ast.expression_string_literal(SPAN, name, None),
            )),
            ctx,
        )
    }

    /// Insert an expression after the class.
    pub(super) fn insert_expr_after_class(&mut self, expr: Expression<'a>, ctx: &TraverseCtx<'a>) {
        if self.current_class().is_declaration {
            self.insert_after_stmts
                .push(ctx.ast.statement_expression(SPAN, expr));
        } else {
            self.insert_after_exprs.push(expr);
        }
    }
}

/// Create `new WeakMap()` expression.
///
/// Takes an `&mut Option<Option<SymbolId>>` which is updated after looking up
/// the binding for `WeakMap`.
///
/// * `None` = Not looked up yet.
/// * `Some(None)` = Has been looked up, and `WeakMap` is unbound.
/// * `Some(Some(symbol_id))` = Has been looked up, and `WeakMap` has a local
///   binding.
///
/// This is an optimization to avoid looking up the symbol for `WeakMap` over
/// and over when defining multiple private properties.
#[expect(clippy::option_option)]
fn create_new_weakmap<'a>(
    symbol_id: &mut Option<Option<SymbolId>>,
    ctx: &mut TraverseCtx<'a>,
) -> Expression<'a> {
    let symbol_id = *symbol_id.get_or_insert_with(|| {
        ctx.scoping()
            .find_binding(ctx.current_scope_id(), "WeakMap")
    });
    let ident = ctx.create_ident_expr(SPAN, Atom::from("WeakMap"), symbol_id, ReferenceFlags::Read);
    ctx.ast
        .expression_new_with_pure(SPAN, ident, NONE, ctx.ast.vec(), true)
}

/// Create `new WeakSet()` expression.
fn create_new_weakset<'a>(ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
    let symbol_id = ctx
        .scoping()
        .find_binding(ctx.current_scope_id(), "WeakSet");
    let ident = ctx.create_ident_expr(SPAN, Atom::from("WeakSet"), symbol_id, ReferenceFlags::Read);
    ctx.ast
        .expression_new_with_pure(SPAN, ident, NONE, ctx.ast.vec(), true)
}
