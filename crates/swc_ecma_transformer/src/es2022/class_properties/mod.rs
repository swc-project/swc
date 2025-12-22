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
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ClassPropertiesPass::default()
}

#[derive(Default)]
struct ClassPropertiesPass {
    cls: ClassData,
    cls_stack: Vec<ClassData>,

    /// Statements to inject before/after the current class declaration
    /// (before_stmts, after_stmts)
    pending_class_injection: Option<(Vec<Stmt>, Vec<Stmt>)>,
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

                    // Transform private field accesses in method body
                    if let Some(body) = &mut method.function.body {
                        let mut visitor =
                            PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark);
                        body.visit_mut_with(&mut visitor);

                        // Prepend variable declarations if any were created
                        if !visitor.vars.is_empty() {
                            body.stmts.insert(
                                0,
                                VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: visitor.vars,
                                    ctxt: Default::default(),
                                    declare: false,
                                }
                                .into(),
                            );
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

        let mut value = prop.value.unwrap_or_else(|| Expr::undefined(prop_span));

        // Collect used names and transform this in static properties
        if !prop.is_static {
            if let PropName::Ident(ref id) = prop.key {
                self.cls.used_key_names.push(id.sym.clone());
            }
            value.visit_with(&mut UsedNameCollector {
                used_names: &mut self.cls.used_names,
            });
        } else {
            // For static properties, replace `this` with class name
            if let Some(class_ident) = &self.cls.ident {
                value.visit_mut_with(&mut ThisInStaticFolder {
                    ident: class_ident.clone(),
                });
            }
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

        let mut value = prop
            .value
            .take()
            .unwrap_or_else(|| Expr::undefined(prop_span));

        // Collect used names
        if !prop.is_static {
            value.visit_with(&mut UsedNameCollector {
                used_names: &mut self.cls.used_names,
            });
        } else {
            // For static properties, replace `this` with class name
            if let Some(class_ident) = &self.cls.ident {
                value.visit_mut_with(&mut ThisInStaticFolder {
                    ident: class_ident.clone(),
                });
            }
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

    fn process_private_method(&mut self, mut method: PrivateMethod, ctx: &mut TraverseCtx) {
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

        // Transform private field accesses in method body
        if let Some(body) = &mut method.function.body {
            let mut visitor = PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark);
            body.visit_mut_with(&mut visitor);

            // Prepend variable declarations if any were created
            if !visitor.vars.is_empty() {
                body.stmts.insert(
                    0,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: visitor.vars,
                        ctxt: Default::default(),
                        declare: false,
                    }
                    .into(),
                );
            }
        }

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
        mut constructor: Option<Constructor>,
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

        // Store visitor vars to prepend later
        let mut constructor_vars = Vec::new();

        // Transform private field accesses in constructor body before adding
        // initializers
        if let Some(ref mut c) = constructor {
            if let Some(ref mut body) = c.body {
                let mut visitor = PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark);
                body.visit_mut_with(&mut visitor);
                constructor_vars = visitor.vars;
            }
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

            // Insert variable declarations at the same position as initializers
            if !constructor_vars.is_empty() {
                body.stmts.insert(
                    insert_pos,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: constructor_vars,
                        ctxt: Default::default(),
                        declare: false,
                    }
                    .into(),
                );
            }
        }

        Some(c)
    }

    fn emit_static_initializers(
        &mut self,
        class_ident: &Ident,
        _stmt_addr: Option<*const Stmt>,
        _ctx: &mut TraverseCtx,
    ) {
        // Separate private method declarations (go AFTER class in loose mode) from
        // static initializers (go after class)
        let private_method_decls = take(&mut self.cls.private_method_decls);
        let mut static_initializers = Vec::new();

        // Static property initializers
        for init in take(&mut self.cls.static_props) {
            // Create assignment statement: ClassName.prop = value
            let assign_stmt = Stmt::Expr(ExprStmt {
                span: init.span,
                expr: Box::new(
                    AssignExpr {
                        span: init.span,
                        op: op!("="),
                        left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                            span: init.span,
                            obj: Box::new(class_ident.clone().into()),
                            prop: match init.name {
                                PropName::Ident(id) => MemberProp::Ident(id),
                                PropName::Str(s) => MemberProp::Computed(ComputedPropName {
                                    span: s.span,
                                    expr: Box::new(s.into()),
                                }),
                                PropName::Num(n) => MemberProp::Computed(ComputedPropName {
                                    span: n.span,
                                    expr: Box::new(n.into()),
                                }),
                                PropName::Computed(c) => MemberProp::Computed(c),
                                PropName::BigInt(b) => MemberProp::Computed(ComputedPropName {
                                    span: b.span,
                                    expr: Box::new(b.into()),
                                }),
                            },
                        })),
                        right: init.value,
                    }
                    .into(),
                ),
            });
            static_initializers.push(assign_stmt);
        }

        // Private static property initializers
        for init in take(&mut self.cls.private_static_props) {
            // Create WeakMap.set(ClassName, value)
            let weak_map_ident = init.name.clone();
            let set_stmt = Stmt::Expr(ExprStmt {
                span: init.span,
                expr: Box::new(
                    CallExpr {
                        span: init.span,
                        callee: weak_map_ident
                            .clone()
                            .make_member(quote_ident!("set"))
                            .as_callee(),
                        args: vec![
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(class_ident.clone().into()),
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
            });
            static_initializers.push(set_stmt);
        }

        // Private static accessor initializers
        for init in take(&mut self.cls.private_static_accessors) {
            // Create WeakMap.set(ClassName, descriptor)
            let weak_map_ident = init.name.clone();
            let descriptor = create_accessor_desc(init.getter, init.setter);

            let set_stmt = Stmt::Expr(ExprStmt {
                span: init.span,
                expr: Box::new(
                    CallExpr {
                        span: init.span,
                        callee: weak_map_ident
                            .clone()
                            .make_member(quote_ident!("set"))
                            .as_callee(),
                        args: vec![
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(class_ident.clone().into()),
                            },
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(descriptor.into()),
                            },
                        ],
                        type_args: Default::default(),
                        ctxt: Default::default(),
                    }
                    .into(),
                ),
            });
            static_initializers.push(set_stmt);
        }

        // Store statements for injection in exit_stmts
        // Note: In loose mode, private method declarations go AFTER the class
        // In WeakSet mode, they would go BEFORE, but we're not implementing that mode
        // yet
        if !private_method_decls.is_empty() || !static_initializers.is_empty() {
            // Combine all "after" statements: private method decls + static initializers
            let mut all_after_stmts = private_method_decls;
            all_after_stmts.extend(static_initializers);

            self.pending_class_injection = Some((vec![], all_after_stmts));
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

        // Prepare statements for injection in exit_stmts
        // Pass a dummy address to indicate this is a class declaration
        self.emit_static_initializers(&class_ident, Some(std::ptr::null()), ctx);

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

        // Class expressions can't have statements injected before/after them
        // So we just process them without storing injections
        self.emit_static_initializers(&class_ident, None, ctx);

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, _ctx: &mut TraverseCtx) {
        // Check if we have pending injections from a class declaration
        if let Some((before_stmts, after_stmts)) = self.pending_class_injection.take() {
            // Find the class declaration in the statement list
            let mut class_idx = None;
            for (i, stmt) in stmts.iter().enumerate() {
                if matches!(stmt, Stmt::Decl(Decl::Class(_))) {
                    class_idx = Some(i);
                    break;
                }
            }

            if let Some(idx) = class_idx {
                // Insert after statements first (to maintain correct indices)
                for (offset, stmt) in after_stmts.into_iter().enumerate() {
                    stmts.insert(idx + 1 + offset, stmt);
                }

                // Then insert before statements
                for (offset, stmt) in before_stmts.into_iter().enumerate() {
                    stmts.insert(idx + offset, stmt);
                }
            }
        }
    }

    fn exit_module_items(&mut self, items: &mut Vec<ModuleItem>, _ctx: &mut TraverseCtx) {
        // Check if we have pending injections from a class declaration
        if let Some((before_stmts, after_stmts)) = self.pending_class_injection.take() {
            // Find the class declaration in the module item list
            let mut class_idx = None;
            for (i, item) in items.iter().enumerate() {
                if matches!(
                    item,
                    ModuleItem::Stmt(Stmt::Decl(Decl::Class(_)))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: Decl::Class(_),
                            ..
                        }))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl {
                                decl: DefaultDecl::Class(_),
                                ..
                            }
                        ))
                ) {
                    class_idx = Some(i);
                    break;
                }
            }

            if let Some(idx) = class_idx {
                // Insert after statements first (to maintain correct indices)
                for (offset, stmt) in after_stmts.into_iter().enumerate() {
                    items.insert(idx + 1 + offset, ModuleItem::Stmt(stmt));
                }

                // Then insert before statements
                for (offset, stmt) in before_stmts.into_iter().enumerate() {
                    items.insert(idx + offset, ModuleItem::Stmt(stmt));
                }
            }
        }
    }
}

// Helper visitor to replace `this` with class name in static property
// initializers
struct ThisInStaticFolder {
    ident: Ident,
}

impl VisitMut for ThisInStaticFolder {
    noop_visit_mut_type!(fail);

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {
        // Don't visit constructors
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::This(..) = e {
            *e = self.ident.clone().into();
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // Don't visit nested functions
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

/// Visitor that transforms private field accesses.
///
/// This visitor transforms private field and method accesses within class
/// methods and constructors to use WeakMap/WeakSet operations:
///
/// - Private field reads: `this.#field` → `_field.get(this)`
/// - Private field writes: `this.#field = value` → `_field.set(this, value)`
/// - Private field updates: `this.#field++` → `_field.set(this,
///   _field.get(this) + 1)`
/// - Private method calls: `this.#method()` → `method.call(this, ...args)`
/// - Private accessor reads: `this.#accessor` →
///   `_accessor.get(this).get.call(this)`
/// - Private accessor writes: `this.#accessor = value` →
///   `_accessor.get(this).set.call(this, value)`
struct PrivateAccessVisitor<'a> {
    /// Map of private names to their kinds (field/method/accessor,
    /// static/instance)
    privates: &'a FxHashMap<Atom, PrivateKind>,
    /// Mark used for hygiene
    mark: Mark,
    /// Variables that need to be declared in the enclosing function scope
    vars: Vec<VarDeclarator>,
}

impl<'a> PrivateAccessVisitor<'a> {
    fn new(privates: &'a FxHashMap<Atom, PrivateKind>, mark: Mark) -> Self {
        Self {
            privates,
            mark,
            vars: Vec::new(),
        }
    }
}

impl VisitMut for PrivateAccessVisitor<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Assign(assign) => {
                // Handle assignment to private field/accessor
                if let AssignTarget::Simple(SimpleAssignTarget::Member(member)) = &mut assign.left {
                    if let MemberProp::PrivateName(private_name) = &member.prop {
                        // Check if this is a private member of the current class
                        if let Some(kind) = self.privates.get(&private_name.name) {
                            let weak_coll_ident = Ident::new(
                                format!("_{}", private_name.name).into(),
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );

                            assign.right.visit_mut_with(self);

                            let obj = member.obj.take();
                            let value = assign.right.take();

                            if assign.op == op!("=") {
                                // Check if this is an accessor
                                if kind.is_method && kind.has_setter {
                                    // Accessor setter: _accessor.get(obj).set.call(obj, value)
                                    let obj_alias = alias_ident_for(&obj, "_obj");

                                    // Declare the variable
                                    self.vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: obj_alias.clone().into(),
                                        init: None,
                                        definite: false,
                                    });

                                    *expr = SeqExpr {
                                        span: assign.span,
                                        exprs: vec![
                                            Box::new(
                                                AssignExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("="),
                                                    left: obj_alias.clone().into(),
                                                    right: obj,
                                                }
                                                .into(),
                                            ),
                                            Box::new(
                                                CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: CallExpr {
                                                        span: DUMMY_SP,
                                                        callee: weak_coll_ident
                                                            .make_member(quote_ident!("get"))
                                                            .as_callee(),
                                                        args: vec![ExprOrSpread {
                                                            spread: None,
                                                            expr: Box::new(
                                                                obj_alias.clone().into(),
                                                            ),
                                                        }],
                                                        type_args: Default::default(),
                                                        ctxt: Default::default(),
                                                    }
                                                    .make_member(quote_ident!("set"))
                                                    .make_member(quote_ident!("call"))
                                                    .as_callee(),
                                                    args: vec![
                                                        ExprOrSpread {
                                                            spread: None,
                                                            expr: Box::new(obj_alias.into()),
                                                        },
                                                        ExprOrSpread {
                                                            spread: None,
                                                            expr: value,
                                                        },
                                                    ],
                                                    type_args: Default::default(),
                                                    ctxt: Default::default(),
                                                }
                                                .into(),
                                            ),
                                        ],
                                    }
                                    .into();
                                } else {
                                    // Simple field assignment: WeakMap.set(obj, value)
                                    *expr = CallExpr {
                                        span: assign.span,
                                        callee: weak_coll_ident
                                            .make_member(quote_ident!("set"))
                                            .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: obj,
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: value,
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                    .into();
                                }
                            } else {
                                // Compound assignment: get old value, compute new, set
                                let obj_alias = alias_ident_for(&obj, "_obj");

                                // Declare the variable
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: obj_alias.clone().into(),
                                    init: None,
                                    definite: false,
                                });

                                let get_call = if kind.is_method && kind.has_getter {
                                    // Accessor getter: _accessor.get(obj).get.call(obj)
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: CallExpr {
                                            span: DUMMY_SP,
                                            callee: weak_coll_ident
                                                .clone()
                                                .make_member(quote_ident!("get"))
                                                .as_callee(),
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            }],
                                            type_args: Default::default(),
                                            ctxt: Default::default(),
                                        }
                                        .make_member(quote_ident!("get"))
                                        .make_member(quote_ident!("call"))
                                        .as_callee(),
                                        args: vec![ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(obj_alias.clone().into()),
                                        }],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                } else {
                                    // Field: WeakMap.get(obj)
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: weak_coll_ident
                                            .clone()
                                            .make_member(quote_ident!("get"))
                                            .as_callee(),
                                        args: vec![ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(obj_alias.clone().into()),
                                        }],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                };

                                let bin_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: assign.op.to_update().unwrap(),
                                    left: Box::new(get_call.into()),
                                    right: value,
                                };

                                let set_call = if kind.is_method && kind.has_setter {
                                    // Accessor setter: _accessor.get(obj).set.call(obj, value)
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: CallExpr {
                                            span: DUMMY_SP,
                                            callee: weak_coll_ident
                                                .make_member(quote_ident!("get"))
                                                .as_callee(),
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            }],
                                            type_args: Default::default(),
                                            ctxt: Default::default(),
                                        }
                                        .make_member(quote_ident!("set"))
                                        .make_member(quote_ident!("call"))
                                        .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(bin_expr.into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                } else {
                                    // Field: WeakMap.set(obj, value)
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: weak_coll_ident
                                            .make_member(quote_ident!("set"))
                                            .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(bin_expr.into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                };

                                *expr = SeqExpr {
                                    span: assign.span,
                                    exprs: vec![
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: obj_alias.into(),
                                                right: obj,
                                            }
                                            .into(),
                                        ),
                                        Box::new(set_call.into()),
                                    ],
                                }
                                .into();
                            }
                            return;
                        }
                    }
                }

                // Not a private field assignment, continue visiting
                expr.visit_mut_children_with(self);
            }
            Expr::Update(update) => {
                // Handle ++/-- on private field/accessor
                if let Expr::Member(member) = &mut *update.arg {
                    if let MemberProp::PrivateName(private_name) = &member.prop {
                        if let Some(kind) = self.privates.get(&private_name.name) {
                            let weak_coll_ident = Ident::new(
                                format!("_{}", private_name.name).into(),
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );

                            let obj = member.obj.take();
                            let obj_alias = alias_ident_for(&obj, "_obj");

                            // Declare the variable
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: obj_alias.clone().into(),
                                init: None,
                                definite: false,
                            });

                            let get_call = if kind.is_method && kind.has_getter {
                                // Accessor getter: _accessor.get(obj).get.call(obj)
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: CallExpr {
                                        span: DUMMY_SP,
                                        callee: weak_coll_ident
                                            .clone()
                                            .make_member(quote_ident!("get"))
                                            .as_callee(),
                                        args: vec![ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(obj_alias.clone().into()),
                                        }],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                    .make_member(quote_ident!("get"))
                                    .make_member(quote_ident!("call"))
                                    .as_callee(),
                                    args: vec![ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(obj_alias.clone().into()),
                                    }],
                                    type_args: Default::default(),
                                    ctxt: Default::default(),
                                }
                            } else {
                                // Field: WeakMap.get(obj)
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: weak_coll_ident
                                        .clone()
                                        .make_member(quote_ident!("get"))
                                        .as_callee(),
                                    args: vec![ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(obj_alias.clone().into()),
                                    }],
                                    type_args: Default::default(),
                                    ctxt: Default::default(),
                                }
                            };

                            // For update expressions, we need to:
                            // 1. Get the old value
                            // 2. Compute the new value (old + 1 or old - 1)
                            // 3. Set the new value
                            // 4. Return old (for postfix) or new (for prefix)
                            //
                            // For postfix `this.#a++`:
                            //   var _this, _old;
                            //   _this = this, _old = _a.get(_this), _a.set(_this, _old + 1), _old
                            //
                            // For prefix `++this.#a`:
                            //   var _this, _new;
                            //   _this = this, _new = _a.get(_this) + 1, _a.set(_this, _new), _new

                            let bin_op = if update.op == op!("++") {
                                op!(bin, "+")
                            } else {
                                op!(bin, "-")
                            };

                            if update.prefix {
                                // Prefix: compute new value, set it, return it
                                let new_value_ident = alias_ident_for(&obj, "_new");
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: new_value_ident.clone().into(),
                                    init: None,
                                    definite: false,
                                });

                                let new_value_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: bin_op,
                                    left: Box::new(get_call.into()),
                                    right: Box::new(
                                        Lit::Num(Number {
                                            span: DUMMY_SP,
                                            value: 1.0,
                                            raw: None,
                                        })
                                        .into(),
                                    ),
                                };

                                let set_call = if kind.is_method && kind.has_setter {
                                    // Accessor setter
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: CallExpr {
                                            span: DUMMY_SP,
                                            callee: weak_coll_ident
                                                .make_member(quote_ident!("get"))
                                                .as_callee(),
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            }],
                                            type_args: Default::default(),
                                            ctxt: Default::default(),
                                        }
                                        .make_member(quote_ident!("set"))
                                        .make_member(quote_ident!("call"))
                                        .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(new_value_ident.clone().into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                } else {
                                    // Field: WeakMap.set
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: weak_coll_ident
                                            .make_member(quote_ident!("set"))
                                            .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(new_value_ident.clone().into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                };

                                *expr = SeqExpr {
                                    span: update.span,
                                    exprs: vec![
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: obj_alias.clone().into(),
                                                right: obj,
                                            }
                                            .into(),
                                        ),
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: new_value_ident.clone().into(),
                                                right: Box::new(new_value_expr.into()),
                                            }
                                            .into(),
                                        ),
                                        Box::new(set_call.into()),
                                        Box::new(new_value_ident.into()),
                                    ],
                                }
                                .into();
                            } else {
                                // Postfix: get old value, compute and set new value, return old
                                // value
                                let old_value_ident = alias_ident_for(&obj, "_old");
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: old_value_ident.clone().into(),
                                    init: None,
                                    definite: false,
                                });

                                let new_value_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: bin_op,
                                    left: Box::new(old_value_ident.clone().into()),
                                    right: Box::new(
                                        Lit::Num(Number {
                                            span: DUMMY_SP,
                                            value: 1.0,
                                            raw: None,
                                        })
                                        .into(),
                                    ),
                                };

                                let set_call = if kind.is_method && kind.has_setter {
                                    // Accessor setter
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: CallExpr {
                                            span: DUMMY_SP,
                                            callee: weak_coll_ident
                                                .make_member(quote_ident!("get"))
                                                .as_callee(),
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            }],
                                            type_args: Default::default(),
                                            ctxt: Default::default(),
                                        }
                                        .make_member(quote_ident!("set"))
                                        .make_member(quote_ident!("call"))
                                        .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(new_value_expr.into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                } else {
                                    // Field: WeakMap.set
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: weak_coll_ident
                                            .make_member(quote_ident!("set"))
                                            .as_callee(),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(new_value_expr.into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                };

                                *expr = SeqExpr {
                                    span: update.span,
                                    exprs: vec![
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: obj_alias.clone().into(),
                                                right: obj,
                                            }
                                            .into(),
                                        ),
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: old_value_ident.clone().into(),
                                                right: Box::new(get_call.into()),
                                            }
                                            .into(),
                                        ),
                                        Box::new(set_call.into()),
                                        Box::new(old_value_ident.into()),
                                    ],
                                }
                                .into();
                            }
                            return;
                        }
                    }
                }

                expr.visit_mut_children_with(self);
            }
            Expr::Call(call) => {
                // Handle private method/accessor calls
                if let Callee::Expr(callee_expr) = &mut call.callee {
                    if let Expr::Member(member) = &mut **callee_expr {
                        if let MemberProp::PrivateName(private_name) = &member.prop {
                            if let Some(kind) = self.privates.get(&private_name.name) {
                                if kind.is_method && !kind.has_getter && !kind.has_setter {
                                    // Regular private method call: method.call(obj, ...args)
                                    let method_name = Ident::new(
                                        if private_name.name.is_reserved_in_any() {
                                            format!("__{}", private_name.name).into()
                                        } else {
                                            private_name.name.clone()
                                        },
                                        private_name.span,
                                        SyntaxContext::empty().apply_mark(self.mark),
                                    );

                                    let obj = member.obj.take();

                                    // Transform to: method.call(obj, ...args)
                                    call.args.visit_mut_with(self);
                                    *expr = CallExpr {
                                        span: call.span,
                                        callee: method_name
                                            .make_member(quote_ident!("call"))
                                            .as_callee(),
                                        args: std::iter::once(ExprOrSpread {
                                            spread: None,
                                            expr: obj,
                                        })
                                        .chain(call.args.take())
                                        .collect(),
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    }
                                    .into();
                                    return;
                                } else if kind.is_method && kind.has_getter {
                                    // Accessor getter call: _accessor.get(obj).get.call(obj,
                                    // ...args)
                                    let weak_coll_ident = Ident::new(
                                        format!("_{}", private_name.name).into(),
                                        private_name.span,
                                        SyntaxContext::empty().apply_mark(self.mark),
                                    );

                                    let obj = member.obj.take();
                                    let obj_alias = alias_ident_for(&obj, "_obj");

                                    // Declare the variable
                                    self.vars.push(VarDeclarator {
                                        span: DUMMY_SP,
                                        name: obj_alias.clone().into(),
                                        init: None,
                                        definite: false,
                                    });

                                    call.args.visit_mut_with(self);

                                    *expr = SeqExpr {
                                        span: call.span,
                                        exprs: vec![
                                            Box::new(
                                                AssignExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("="),
                                                    left: obj_alias.clone().into(),
                                                    right: obj,
                                                }
                                                .into(),
                                            ),
                                            Box::new(
                                                CallExpr {
                                                    span: call.span,
                                                    callee: CallExpr {
                                                        span: DUMMY_SP,
                                                        callee: weak_coll_ident
                                                            .make_member(quote_ident!("get"))
                                                            .as_callee(),
                                                        args: vec![ExprOrSpread {
                                                            spread: None,
                                                            expr: Box::new(
                                                                obj_alias.clone().into(),
                                                            ),
                                                        }],
                                                        type_args: Default::default(),
                                                        ctxt: Default::default(),
                                                    }
                                                    .make_member(quote_ident!("get"))
                                                    .make_member(quote_ident!("call"))
                                                    .as_callee(),
                                                    args: std::iter::once(ExprOrSpread {
                                                        spread: None,
                                                        expr: Box::new(obj_alias.into()),
                                                    })
                                                    .chain(call.args.take())
                                                    .collect(),
                                                    type_args: Default::default(),
                                                    ctxt: Default::default(),
                                                }
                                                .into(),
                                            ),
                                        ],
                                    }
                                    .into();
                                    return;
                                }
                            }
                        }
                    }
                }

                expr.visit_mut_children_with(self);
            }
            Expr::Member(member) => {
                // Handle private field/accessor read
                member.obj.visit_mut_with(self);

                if let MemberProp::PrivateName(private_name) = &member.prop {
                    if let Some(kind) = self.privates.get(&private_name.name) {
                        let weak_coll_ident = Ident::new(
                            format!("_{}", private_name.name).into(),
                            private_name.span,
                            SyntaxContext::empty().apply_mark(self.mark),
                        );

                        let obj = member.obj.take();

                        if kind.is_method && kind.has_getter {
                            // Accessor getter: _accessor.get(obj).get.call(obj)
                            let obj_alias = alias_ident_for(&obj, "_obj");

                            // Declare the variable
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: obj_alias.clone().into(),
                                init: None,
                                definite: false,
                            });

                            *expr = SeqExpr {
                                span: member.span,
                                exprs: vec![
                                    Box::new(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left: obj_alias.clone().into(),
                                            right: obj,
                                        }
                                        .into(),
                                    ),
                                    Box::new(
                                        CallExpr {
                                            span: DUMMY_SP,
                                            callee: CallExpr {
                                                span: DUMMY_SP,
                                                callee: weak_coll_ident
                                                    .make_member(quote_ident!("get"))
                                                    .as_callee(),
                                                args: vec![ExprOrSpread {
                                                    spread: None,
                                                    expr: Box::new(obj_alias.clone().into()),
                                                }],
                                                type_args: Default::default(),
                                                ctxt: Default::default(),
                                            }
                                            .make_member(quote_ident!("get"))
                                            .make_member(quote_ident!("call"))
                                            .as_callee(),
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.into()),
                                            }],
                                            type_args: Default::default(),
                                            ctxt: Default::default(),
                                        }
                                        .into(),
                                    ),
                                ],
                            }
                            .into();
                        } else if kind.is_method && !kind.has_getter && !kind.has_setter {
                            // Regular private method (not being called): just reference the method
                            let method_name = Ident::new(
                                if private_name.name.is_reserved_in_any() {
                                    format!("__{}", private_name.name).into()
                                } else {
                                    private_name.name.clone()
                                },
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );
                            *expr = method_name.into();
                        } else {
                            // Field: WeakMap.get(obj)
                            *expr = CallExpr {
                                span: DUMMY_SP,
                                callee: weak_coll_ident
                                    .make_member(quote_ident!("get"))
                                    .as_callee(),
                                args: vec![ExprOrSpread {
                                    spread: None,
                                    expr: obj,
                                }],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into();
                        }
                        return;
                    }
                }

                // If not transformed, it's not a private field of the current class
                member.visit_mut_children_with(self);
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }

    // Don't visit into nested functions/classes - they have their own scope
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        // Visit constructor body to transform private field accesses
        if let Some(body) = &mut n.body {
            body.visit_mut_with(self);
        }
    }

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_class(&mut self, _: &mut Class) {}
}
