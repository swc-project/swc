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

    /// Stack of statement pointers for class declarations
    /// Used to inject static initializers after the class statement
    pending_class_stmt_stack: Vec<Option<*const Stmt>>,
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

        // Transform private field accesses in constructor body before adding
        // initializers
        if let Some(ref mut c) = constructor {
            if let Some(ref mut body) = c.body {
                let mut visitor = PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark);
                body.visit_mut_with(&mut visitor);
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
        }

        Some(c)
    }

    fn emit_static_initializers(&mut self, class_ident: &Ident, ctx: &mut TraverseCtx) {
        let stmt_addr = self.pending_class_stmt_stack.last().and_then(|o| *o);

        let mut stmts_to_inject = Vec::new();

        // Private method declarations
        stmts_to_inject.extend(take(&mut self.cls.private_method_decls));

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
            stmts_to_inject.push(assign_stmt);
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
            stmts_to_inject.push(set_stmt);
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
            stmts_to_inject.push(set_stmt);
        }

        // Inject all statements after the class declaration
        if let Some(addr) = stmt_addr {
            if !stmts_to_inject.is_empty() {
                ctx.statement_injector
                    .insert_many_after(addr, stmts_to_inject);
            }
        }
    }
}

impl VisitMutHook<TraverseCtx> for ClassPropertiesPass {
    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // Store the statement address if it's a class declaration
        // This allows us to inject statements after the class
        if matches!(stmt, Stmt::Decl(Decl::Class(_))) {
            self.pending_class_stmt_stack
                .push(Some(stmt as *const Stmt));
        }
    }

    fn enter_class_decl(&mut self, n: &mut ClassDecl, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        // If we're entering a nested class without a statement address (e.g., in an
        // expression), push None to keep the stacks aligned
        if self.cls_stack.len() > 1 && self.pending_class_stmt_stack.len() < self.cls_stack.len() {
            self.pending_class_stmt_stack.push(None);
        }

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident = Some(n.ident.clone());

        self.analyze_class(&n.class);
    }

    fn exit_class_decl(&mut self, n: &mut ClassDecl, ctx: &mut TraverseCtx) {
        let class_ident = n.ident.clone();
        let new_members = self.process_class_body(&mut n.class, ctx);
        n.class.body = new_members;

        self.emit_static_initializers(&class_ident, ctx);

        // Pop the statement address if it was pushed
        if !self.pending_class_stmt_stack.is_empty() {
            self.pending_class_stmt_stack.pop();
        }

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn enter_class_expr(&mut self, n: &mut ClassExpr, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        // ClassExpr is not a statement, so push None to keep stacks aligned
        self.pending_class_stmt_stack.push(None);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident.clone_from(&n.ident);

        self.analyze_class(&n.class);
    }

    fn exit_class_expr(&mut self, n: &mut ClassExpr, ctx: &mut TraverseCtx) {
        let class_ident = n.ident.clone().unwrap_or_else(|| private_ident!("_class"));
        let new_members = self.process_class_body(&mut n.class, ctx);
        n.class.body = new_members;

        self.emit_static_initializers(&class_ident, ctx);

        // Pop the None we pushed in enter_class_expr
        if !self.pending_class_stmt_stack.is_empty() {
            self.pending_class_stmt_stack.pop();
        }

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
/// - Private accessor reads: `this.#accessor` → `_accessor.get(this).get`
struct PrivateAccessVisitor<'a> {
    /// Map of private names to their kinds (field/method/accessor,
    /// static/instance)
    privates: &'a FxHashMap<Atom, PrivateKind>,
    /// Mark used for hygiene
    mark: Mark,
    /// Current access type (unused for now, but could be used for optimization)
    access_type: PrivateAccessType,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum PrivateAccessType {
    Get,
    Set,
    Update,
}

impl Default for PrivateAccessType {
    fn default() -> Self {
        Self::Get
    }
}

impl<'a> PrivateAccessVisitor<'a> {
    fn new(privates: &'a FxHashMap<Atom, PrivateKind>, mark: Mark) -> Self {
        Self {
            privates,
            mark,
            access_type: PrivateAccessType::Get,
        }
    }

    /// Transform a private member expression to a WeakMap get/set call
    fn transform_private_access(&mut self, member: &mut MemberExpr) -> Option<Expr> {
        let private_name = match &member.prop {
            MemberProp::PrivateName(n) => n,
            _ => return None,
        };

        // Check if this private name belongs to the current class
        let kind = self.privates.get(&private_name.name)?;

        let weak_coll_ident = Ident::new(
            format!("_{}", private_name.name).into(),
            private_name.span,
            SyntaxContext::empty().apply_mark(self.mark),
        );

        let obj = member.obj.take();

        match self.access_type {
            PrivateAccessType::Get => {
                if kind.is_method {
                    // For methods, we need to check the WeakSet and return the method function
                    if kind.has_getter || kind.has_setter {
                        // Accessor: WeakMap.get(obj).get
                        Some(
                            CallExpr {
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
                            .make_member(if kind.has_getter {
                                quote_ident!("get")
                            } else {
                                quote_ident!("set")
                            })
                            .into(),
                        )
                    } else {
                        // Regular method: just need to verify it's in the WeakSet
                        // For now, we'll assume the brand check is done elsewhere
                        // and just return a reference to the method
                        let method_name = Ident::new(
                            if private_name.name.is_reserved_in_any() {
                                format!("__{}", private_name.name).into()
                            } else {
                                private_name.name.clone()
                            },
                            private_name.span,
                            SyntaxContext::empty().apply_mark(self.mark),
                        );
                        Some(method_name.into())
                    }
                } else {
                    // Field: WeakMap.get(obj)
                    Some(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: weak_coll_ident.make_member(quote_ident!("get")).as_callee(),
                            args: vec![ExprOrSpread {
                                spread: None,
                                expr: obj,
                            }],
                            type_args: Default::default(),
                            ctxt: Default::default(),
                        }
                        .into(),
                    )
                }
            }
            PrivateAccessType::Set => {
                // This will be handled in the assignment expression visitor
                None
            }
            PrivateAccessType::Update => {
                // This will be handled in the update expression visitor
                None
            }
        }
    }
}

impl VisitMut for PrivateAccessVisitor<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Assign(assign) => {
                // Handle assignment to private field
                if let AssignTarget::Simple(SimpleAssignTarget::Member(member)) = &mut assign.left {
                    if let MemberProp::PrivateName(private_name) = &member.prop {
                        // Check if this is a private field of the current class
                        if let Some(_kind) = self.privates.get(&private_name.name) {
                            let weak_coll_ident = Ident::new(
                                format!("_{}", private_name.name).into(),
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );

                            assign.right.visit_mut_with(self);

                            let obj = member.obj.take();
                            let value = assign.right.take();

                            if assign.op == op!("=") {
                                // Simple assignment: WeakMap.set(obj, value)
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
                            } else {
                                // Compound assignment: WeakMap.set(obj, WeakMap.get(obj) op value)
                                let obj_alias = alias_ident_for(&obj, "_obj");

                                let get_call = CallExpr {
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
                                };

                                let bin_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: assign.op.to_update().unwrap(),
                                    left: Box::new(get_call.into()),
                                    right: value,
                                };

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
                                                callee: weak_coll_ident
                                                    .make_member(quote_ident!("set"))
                                                    .as_callee(),
                                                args: vec![
                                                    ExprOrSpread {
                                                        spread: None,
                                                        expr: Box::new(obj_alias.into()),
                                                    },
                                                    ExprOrSpread {
                                                        spread: None,
                                                        expr: Box::new(bin_expr.into()),
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
                            }
                            return;
                        }
                    }
                }

                // Not a private field assignment, continue visiting
                expr.visit_mut_children_with(self);
            }
            Expr::Update(update) => {
                // Handle ++/-- on private field
                if let Expr::Member(member) = &mut *update.arg {
                    if let MemberProp::PrivateName(private_name) = &member.prop {
                        if let Some(_kind) = self.privates.get(&private_name.name) {
                            let weak_coll_ident = Ident::new(
                                format!("_{}", private_name.name).into(),
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );

                            let obj = member.obj.take();
                            let obj_alias = alias_ident_for(&obj, "_obj");

                            let get_call = CallExpr {
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
                            };

                            let update_expr = UpdateExpr {
                                span: update.span,
                                op: update.op,
                                prefix: update.prefix,
                                arg: Box::new(get_call.into()),
                            };

                            let set_call = CallExpr {
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
                                        expr: Box::new(update_expr.into()),
                                    },
                                ],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            };

                            *expr = SeqExpr {
                                span: update.span,
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
                            return;
                        }
                    }
                }

                expr.visit_mut_children_with(self);
            }
            Expr::Call(call) => {
                // Handle private method calls
                if let Callee::Expr(callee_expr) = &mut call.callee {
                    if let Expr::Member(member) = &mut **callee_expr {
                        if let MemberProp::PrivateName(private_name) = &member.prop {
                            if let Some(kind) = self.privates.get(&private_name.name) {
                                if kind.is_method && !kind.has_getter && !kind.has_setter {
                                    // Regular private method call
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
                                }
                            }
                        }
                    }
                }

                expr.visit_mut_children_with(self);
            }
            Expr::Member(member) => {
                // Handle private field read
                member.obj.visit_mut_with(self);

                if let Some(transformed) = self.transform_private_access(member) {
                    *expr = transformed;
                } else {
                    // If not transformed, it's not a private field of the current class
                    member.visit_mut_children_with(self);
                }
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
