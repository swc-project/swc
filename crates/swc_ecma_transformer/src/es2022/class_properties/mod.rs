//! ES2022: Class Properties
//!
//! This module transforms class properties and private fields to ES5-compatible
//! code.
//!
//! ## Example
//!
//! Input:
//! ```js
//! class Foo {
//!     publicField = 1;
//!     #privateField = 2;
//!
//!     #privateMethod() {
//!         return this.#privateField;
//!     }
//!
//!     static staticField = 3;
//! }
//! ```
//!
//! Output (loose mode):
//! ```js
//! var _privateField = _classPrivateFieldLooseKey("privateField");
//! var _privateMethod = _classPrivateFieldLooseKey("privateMethod");
//! class Foo {
//!     constructor() {
//!         Object.defineProperty(this, _privateField, { writable: true, value: 2 });
//!         Object.defineProperty(this, _privateMethod, { value: _privateMethod2 });
//!         this.publicField = 1;
//!     }
//! }
//! function _privateMethod2() {
//!     return _classPrivateFieldLooseBase(this, _privateField)[_privateField];
//! }
//! Foo.staticField = 3;
//! ```

use std::mem::take;

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, default_constructor_with_span, is_literal, private_ident,
    quote_ident, ExprFactory,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ClassPropertiesPass::default()
}

#[derive(Default)]
struct ClassPropertiesPass {
    cls: ClassData,
    cls_stack: Vec<ClassData>,
}

#[derive(Default)]
struct ClassData {
    ident: Option<Ident>,
    mark: Mark,

    /// Private names in this class
    privates: FxHashMap<Atom, PrivateKind>,

    /// Name of private methods
    methods: Vec<Atom>,

    /// Name of private statics
    statics: Vec<Atom>,

    /// Public instance properties to initialize in constructor
    instance_props: Vec<PropInit>,

    /// Private instance properties to initialize in constructor
    private_instance_props: Vec<PrivPropInit>,

    /// Private instance methods to register in constructor
    private_instance_methods: Vec<PrivMethodInit>,

    /// Private instance accessors to register in constructor
    private_instance_accessors: Vec<PrivAccessorInit>,

    /// Static properties to initialize after class
    static_props: Vec<PropInit>,

    /// Private static properties to initialize after class
    private_static_props: Vec<PrivPropInit>,

    /// Private static accessors to register after class
    private_static_accessors: Vec<PrivAccessorInit>,

    /// Private method function declarations
    private_method_decls: Vec<Stmt>,

    /// Names used in property values (for collision detection)
    used_names: Vec<Atom>,

    /// Names used in computed keys (for collision detection)
    used_key_names: Vec<Atom>,

    /// Super class alias (for static properties)
    super_ident: Option<Ident>,

    /// Whether computed keys should be extracted to variables
    should_extract_computed_keys: bool,
}

struct PropInit {
    span: Span,
    name: PropName,
    value: Box<Expr>,
}

struct PrivPropInit {
    span: Span,
    name: Ident,
    value: Box<Expr>,
}

struct PrivMethodInit {
    span: Span,
    name: Ident,
    fn_name: Ident,
}

struct PrivAccessorInit {
    span: Span,
    name: Ident,
    getter: Option<Ident>,
    setter: Option<Ident>,
}

#[derive(Copy, Clone, PartialEq, Default, Eq)]
struct PrivateKind {
    is_static: bool,
    is_method: bool,
    has_getter: bool,
    has_setter: bool,
}

impl ClassPropertiesPass {
    fn analyze_class(&mut self, class: &Class) {
        // Determine if we should extract computed keys
        self.cls.should_extract_computed_keys = class.body.iter().any(|m| match m {
            ClassMember::Constructor(_)
            | ClassMember::PrivateMethod(_)
            | ClassMember::TsIndexSignature(_)
            | ClassMember::Empty(_)
            | ClassMember::AutoAccessor(_) => false,
            ClassMember::Method(m) => contains_super(&m.key),
            ClassMember::ClassProp(_)
            | ClassMember::PrivateProp(_)
            | ClassMember::StaticBlock(_) => true,
            #[cfg(swc_ast_unknown)]
            _ => false,
        });

        // Collect private members
        for m in &class.body {
            match m {
                ClassMember::PrivateMethod(m) => {
                    self.cls.privates.insert(
                        m.key.name.clone(),
                        PrivateKind {
                            is_method: true,
                            is_static: m.is_static,
                            has_getter: m.kind == MethodKind::Getter,
                            has_setter: m.kind == MethodKind::Setter,
                        },
                    );
                    self.cls.methods.push(m.key.name.clone());

                    if m.is_static {
                        self.cls.statics.push(m.key.name.clone());
                    }
                }
                ClassMember::PrivateProp(m) => {
                    self.cls.privates.insert(
                        m.key.name.clone(),
                        PrivateKind {
                            is_method: false,
                            is_static: m.is_static,
                            has_getter: false,
                            has_setter: false,
                        },
                    );

                    if m.is_static {
                        self.cls.statics.push(m.key.name.clone());
                    }
                }
                _ => {}
            }
        }
    }

    fn process_class_body(&mut self, class: &mut Class, ctx: &mut TraverseCtx) -> Vec<ClassMember> {
        let mut new_members = Vec::new();
        let mut constructor = None;
        let has_super = class.super_class.is_some();

        for member in take(&mut class.body) {
            match member {
                ClassMember::Constructor(c) => {
                    constructor = Some(c);
                }
                ClassMember::Method(mut method) => {
                    // Extract computed keys if needed
                    if let PropName::Computed(ComputedPropName {
                        span: _,
                        ref mut expr,
                    }) = method.key
                    {
                        if self.cls.should_extract_computed_keys && !is_literal(expr) {
                            let ident = alias_ident_for(expr, "tmp");
                            let expr_value = expr.take();
                            ctx.var_declarations.insert_let(
                                BindingIdent {
                                    id: ident.clone(),
                                    type_ann: None,
                                },
                                Some(expr_value),
                            );
                            **expr = ident.into();
                        }
                    }
                    new_members.push(ClassMember::Method(method));
                }
                ClassMember::ClassProp(prop) => {
                    self.process_class_prop(prop, has_super, ctx);
                }
                ClassMember::PrivateProp(prop) => {
                    self.process_private_prop(prop, ctx);
                }
                ClassMember::PrivateMethod(method) => {
                    self.process_private_method(method, ctx);
                }
                ClassMember::Empty(_)
                | ClassMember::TsIndexSignature(_)
                | ClassMember::AutoAccessor(_) => {
                    new_members.push(member);
                }
                ClassMember::StaticBlock(_) => {
                    // Static blocks should be handled by the static_blocks pass
                }
                #[cfg(swc_ast_unknown)]
                _ => {}
            }
        }

        // Process constructor
        let constructor = self.process_constructor(constructor, has_super, class.span);
        if let Some(c) = constructor {
            new_members.push(ClassMember::Constructor(c));
        }

        new_members
    }

    fn process_class_prop(&mut self, mut prop: ClassProp, _has_super: bool, ctx: &mut TraverseCtx) {
        let prop_span = prop.span();

        // Extract computed keys if needed
        if let PropName::Computed(key) = &mut prop.key {
            if !is_literal(&key.expr) {
                let (ident, aliased) = if let Expr::Ident(i) = &*key.expr {
                    if self.cls.used_key_names.contains(&i.sym) {
                        (alias_ident_for(&key.expr, "_ref"), true)
                    } else {
                        alias_if_required(&key.expr, "_ref")
                    }
                } else {
                    alias_if_required(&key.expr, "_ref")
                };

                if aliased {
                    ctx.var_declarations.insert_let(
                        BindingIdent {
                            id: ident.clone(),
                            type_ann: None,
                        },
                        Some(key.expr.take()),
                    );
                }
                *key.expr = ident.into();
            }
        }

        let value = prop.value.unwrap_or_else(|| Expr::undefined(prop_span));

        // Collect used names
        if !prop.is_static {
            if let PropName::Ident(ref id) = prop.key {
                self.cls.used_key_names.push(id.sym.clone());
            }
            value.visit_with(&mut UsedNameCollector {
                used_names: &mut self.cls.used_names,
            });
        }

        let init = PropInit {
            span: prop_span,
            name: prop.key,
            value,
        };

        if prop.is_static {
            self.cls.static_props.push(init);
        } else {
            self.cls.instance_props.push(init);
        }
    }

    fn process_private_prop(&mut self, mut prop: PrivateProp, ctx: &mut TraverseCtx) {
        let prop_span = prop.span();

        let ident = Ident::new(
            format!("_{}", prop.key.name).into(),
            prop.key.span,
            SyntaxContext::empty().apply_mark(self.cls.mark),
        );

        let value = prop
            .value
            .take()
            .unwrap_or_else(|| Expr::undefined(prop_span));

        // Collect used names
        if !prop.is_static {
            value.visit_with(&mut UsedNameCollector {
                used_names: &mut self.cls.used_names,
            });
        }

        // Create WeakMap variable for private field
        ctx.var_declarations.insert_var(
            BindingIdent {
                id: ident.clone(),
                type_ann: None,
            },
            Some(Box::new(
                NewExpr {
                    span: DUMMY_SP,
                    callee: Box::new(quote_ident!("WeakMap").into()),
                    args: Some(Default::default()),
                    type_args: Default::default(),
                    ctxt: Default::default(),
                }
                .into(),
            )),
        );

        let init = PrivPropInit {
            span: prop_span,
            name: ident,
            value,
        };

        if prop.is_static {
            self.cls.private_static_props.push(init);
        } else {
            self.cls.private_instance_props.push(init);
        }
    }

    fn process_private_method(&mut self, method: PrivateMethod, ctx: &mut TraverseCtx) {
        let is_static = method.is_static;
        let prop_span = method.span;

        let fn_name = Ident::new(
            match method.kind {
                MethodKind::Getter => format!("get_{}", method.key.name).into(),
                MethodKind::Setter => format!("set_{}", method.key.name).into(),
                MethodKind::Method => {
                    if method.key.name.is_reserved_in_any() {
                        format!("__{}", method.key.name).into()
                    } else {
                        method.key.name.clone()
                    }
                }
                #[cfg(swc_ast_unknown)]
                _ => method.key.name.clone(),
            },
            method.span,
            SyntaxContext::empty().apply_mark(self.cls.mark),
        );

        let weak_coll_var = Ident::new(
            format!("_{}", method.key.name).into(),
            method.key.span,
            SyntaxContext::empty().apply_mark(self.cls.mark),
        );

        // Collect used names
        method.function.visit_with(&mut UsedNameCollector {
            used_names: &mut self.cls.used_names,
        });

        // Create WeakSet/WeakMap variable
        match (method.kind, is_static) {
            (MethodKind::Getter | MethodKind::Setter, false) => {
                let is_getter = method.kind == MethodKind::Getter;

                // Check if accessor already exists
                let mut found = false;
                for accessor in &mut self.cls.private_instance_accessors {
                    if accessor.name.sym == weak_coll_var.sym {
                        if is_getter {
                            accessor.getter = Some(fn_name.clone());
                        } else {
                            accessor.setter = Some(fn_name.clone());
                        }
                        found = true;
                        break;
                    }
                }

                if !found {
                    ctx.var_declarations.insert_var(
                        BindingIdent {
                            id: weak_coll_var.clone(),
                            type_ann: None,
                        },
                        Some(Box::new(
                            NewExpr {
                                span: DUMMY_SP,
                                callee: Box::new(quote_ident!("WeakMap").into()),
                                args: Some(Default::default()),
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        )),
                    );

                    self.cls.private_instance_accessors.push(PrivAccessorInit {
                        span: prop_span,
                        name: weak_coll_var,
                        getter: if is_getter {
                            Some(fn_name.clone())
                        } else {
                            None
                        },
                        setter: if !is_getter {
                            Some(fn_name.clone())
                        } else {
                            None
                        },
                    });
                }
            }
            (MethodKind::Getter | MethodKind::Setter, true) => {
                let is_getter = method.kind == MethodKind::Getter;

                // Check if accessor already exists
                let mut found = false;
                for accessor in &mut self.cls.private_static_accessors {
                    if accessor.name.sym == weak_coll_var.sym {
                        if is_getter {
                            accessor.getter = Some(fn_name.clone());
                        } else {
                            accessor.setter = Some(fn_name.clone());
                        }
                        found = true;
                        break;
                    }
                }

                if !found {
                    self.cls.private_static_accessors.push(PrivAccessorInit {
                        span: prop_span,
                        name: weak_coll_var,
                        getter: if is_getter {
                            Some(fn_name.clone())
                        } else {
                            None
                        },
                        setter: if !is_getter {
                            Some(fn_name.clone())
                        } else {
                            None
                        },
                    });
                }
            }
            (MethodKind::Method, false) => {
                ctx.var_declarations.insert_var(
                    BindingIdent {
                        id: weak_coll_var.clone(),
                        type_ann: None,
                    },
                    Some(Box::new(
                        NewExpr {
                            span: DUMMY_SP,
                            callee: Box::new(quote_ident!("WeakSet").into()),
                            args: Some(Default::default()),
                            type_args: Default::default(),
                            ctxt: Default::default(),
                        }
                        .into(),
                    )),
                );

                self.cls.private_instance_methods.push(PrivMethodInit {
                    span: prop_span,
                    name: weak_coll_var,
                    fn_name: fn_name.clone(),
                });
            }
            (MethodKind::Method, true) => {
                // Static private methods don't need WeakSet
            }
            #[cfg(swc_ast_unknown)]
            _ => {}
        }

        // Add function declaration
        self.cls.private_method_decls.push(
            FnDecl {
                ident: fn_name,
                function: method.function,
                declare: false,
            }
            .into(),
        );
    }

    fn process_constructor(
        &mut self,
        constructor: Option<Constructor>,
        has_super: bool,
        class_span: Span,
    ) -> Option<Constructor> {
        let has_initializers = !self.cls.instance_props.is_empty()
            || !self.cls.private_instance_props.is_empty()
            || !self.cls.private_instance_methods.is_empty()
            || !self.cls.private_instance_accessors.is_empty();

        if !has_initializers && constructor.is_none() {
            return None;
        }

        let mut c =
            constructor.unwrap_or_else(|| default_constructor_with_span(has_super, class_span));

        if let Some(ref mut body) = c.body {
            // Find insertion point (after super() call or at the start)
            let insert_pos = if has_super {
                // Find super() call
                body.stmts
                    .iter()
                    .position(|stmt| {
                        if let Stmt::Expr(ExprStmt { expr, .. }) = stmt {
                            matches!(
                                **expr,
                                Expr::Call(CallExpr {
                                    callee: Callee::Super(_),
                                    ..
                                })
                            )
                        } else {
                            false
                        }
                    })
                    .map(|pos| pos + 1)
                    .unwrap_or(0)
            } else {
                0
            };

            let mut initializers = Vec::new();

            // Private method initializers (WeakSet.add)
            for init in take(&mut self.cls.private_instance_methods) {
                initializers.push(
                    ExprStmt {
                        span: init.span,
                        expr: Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.name.make_member(quote_ident!("add")).as_callee(),
                                args: vec![ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                }],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        ),
                    }
                    .into(),
                );
            }

            // Private accessor initializers (WeakMap.set with descriptor)
            for init in take(&mut self.cls.private_instance_accessors) {
                let desc = create_accessor_desc(init.getter, init.setter);
                initializers.push(
                    ExprStmt {
                        span: init.span,
                        expr: Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.name.make_member(quote_ident!("set")).as_callee(),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(desc.into()),
                                    },
                                ],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        ),
                    }
                    .into(),
                );
            }

            // Private property initializers (WeakMap.set)
            for init in take(&mut self.cls.private_instance_props) {
                initializers.push(
                    ExprStmt {
                        span: init.span,
                        expr: Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.name.make_member(quote_ident!("set")).as_callee(),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: init.value,
                                    },
                                ],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        ),
                    }
                    .into(),
                );
            }

            // Public property initializers
            for init in take(&mut self.cls.instance_props) {
                initializers.push(
                    ExprStmt {
                        span: init.span,
                        expr: Box::new(
                            AssignExpr {
                                span: init.span,
                                op: op!("="),
                                left: match init.name {
                                    PropName::Ident(id) => {
                                        ThisExpr { span: DUMMY_SP }.make_member(id).into()
                                    }
                                    _ => {
                                        let key = prop_name_to_expr(init.name);
                                        ThisExpr { span: DUMMY_SP }.computed_member(key).into()
                                    }
                                },
                                right: init.value,
                            }
                            .into(),
                        ),
                    }
                    .into(),
                );
            }

            // Insert initializers
            for (i, stmt) in initializers.into_iter().enumerate() {
                body.stmts.insert(insert_pos + i, stmt);
            }
        }

        Some(c)
    }

    fn emit_static_initializers(&mut self, _class_ident: &Ident, _ctx: &mut TraverseCtx) {
        // Get the class declaration statement address for injection
        // We'll inject statements after the class declaration

        // Private method declarations
        for _decl in take(&mut self.cls.private_method_decls) {
            // We need to inject these as statements in the current block
            // For now, we'll use the var_declarations mechanism
            // TODO: Use statement_injector when we have the class decl address
        }

        // Static property initializers
        for _init in take(&mut self.cls.static_props) {
            // Create assignment statement: ClassName.prop = value
            // TODO: Use statement_injector to inject after class
        }

        // Private static property initializers
        for _init in take(&mut self.cls.private_static_props) {
            // Create WeakMap.set(ClassName, value)
            // TODO: Use statement_injector to inject after class
        }

        // Private static accessor initializers
        for _init in take(&mut self.cls.private_static_accessors) {
            // Create WeakMap.set(ClassName, descriptor)
            // TODO: Use statement_injector to inject after class
        }
    }
}

impl VisitMutHook<TraverseCtx> for ClassPropertiesPass {
    fn enter_class_decl(&mut self, n: &mut ClassDecl, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident = Some(n.ident.clone());

        self.analyze_class(&n.class);
    }

    fn exit_class_decl(&mut self, n: &mut ClassDecl, ctx: &mut TraverseCtx) {
        let class_ident = n.ident.clone();
        let new_members = self.process_class_body(&mut n.class, ctx);
        n.class.body = new_members;

        self.emit_static_initializers(&class_ident, ctx);

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn enter_class_expr(&mut self, n: &mut ClassExpr, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident.clone_from(&n.ident);

        self.analyze_class(&n.class);
    }

    fn exit_class_expr(&mut self, n: &mut ClassExpr, ctx: &mut TraverseCtx) {
        let class_ident = n.ident.clone().unwrap_or_else(|| private_ident!("_class"));
        let new_members = self.process_class_body(&mut n.class, ctx);
        n.class.body = new_members;

        self.emit_static_initializers(&class_ident, ctx);

        self.cls = self.cls_stack.pop().unwrap();
    }
}

// Helper functions

fn prop_name_to_expr(name: PropName) -> Box<Expr> {
    match name {
        PropName::Ident(id) => Box::new(
            Str {
                span: id.span,
                raw: None,
                value: id.sym.into(),
            }
            .into(),
        ),
        PropName::Str(s) => Box::new(s.into()),
        PropName::Num(n) => Box::new(n.into()),
        PropName::Computed(c) => c.expr,
        PropName::BigInt(b) => Box::new(b.into()),
    }
}

fn create_accessor_desc(getter: Option<Ident>, setter: Option<Ident>) -> ObjectLit {
    ObjectLit {
        span: DUMMY_SP,
        props: vec![
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("get")),
                value: getter
                    .map(|id| Box::new(id.into()))
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP)),
            }))),
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("set")),
                value: setter
                    .map(|id| Box::new(id.into()))
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP)),
            }))),
        ],
    }
}

fn contains_super<N>(node: &N) -> bool
where
    N: VisitWith<SuperVisitor>,
{
    let mut visitor = SuperVisitor { found: false };
    node.visit_with(&mut visitor);
    visitor.found
}

struct SuperVisitor {
    found: bool,
}

impl Visit for SuperVisitor {
    noop_visit_type!(fail);

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_fn_decl(&mut self, _: &FnDecl) {}

    fn visit_fn_expr(&mut self, _: &FnExpr) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        n.key.visit_with(self);
    }

    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.key.visit_with(self);
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        n.key.visit_with(self);
    }

    fn visit_super(&mut self, _: &Super) {
        self.found = true;
    }
}

struct UsedNameCollector<'a> {
    used_names: &'a mut Vec<Atom>,
}

impl Visit for UsedNameCollector<'_> {
    noop_visit_type!(fail);

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_setter_prop(&mut self, _: &SetterProp) {}

    fn visit_getter_prop(&mut self, _: &GetterProp) {}

    fn visit_method_prop(&mut self, _: &MethodProp) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Ident(i) => self.used_names.push(i.sym.clone()),
            _ => expr.visit_children_with(self),
        }
    }
}
