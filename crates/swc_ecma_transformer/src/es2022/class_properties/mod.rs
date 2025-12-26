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
use swc_ecma_transforms_base::assumptions::Assumptions;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, default_constructor_with_span, is_literal, private_ident,
    quote_ident, ExprFactory,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::TraverseCtx;

pub fn hook(assumptions: Assumptions) -> impl VisitMutHook<TraverseCtx> {
    ClassPropertiesPass {
        assumptions,
        ..Default::default()
    }
}

#[derive(Default)]
struct ClassPropertiesPass {
    cls: ClassData,
    cls_stack: Vec<ClassData>,

    /// Assumptions for transformation behavior
    assumptions: Assumptions,

    /// Statements to inject before/after class declarations
    /// Vector of (class_ident, before_stmts, after_stmts)
    /// Multiple injections can be pending when multiple classes exist at same
    /// level
    pending_class_injections: Vec<(Ident, Vec<Stmt>, Vec<Stmt>)>,

    /// Pending class expression transformation
    /// (class_ident, computed_key_decls, static_initializers,
    /// private_method_decls)
    pending_class_expr: Option<(Ident, Vec<VarDeclarator>, Vec<Box<Expr>>, Vec<Stmt>)>,
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

    /// Instance member initializations (in declaration order)
    instance_inits: Vec<MemberInit>,

    /// Static member initializations (in declaration order)
    static_inits: Vec<MemberInit>,

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

    /// Computed key variable declarations to inject before the class
    /// These are evaluated right before the class definition
    computed_key_decls: Vec<VarDeclarator>,
}

/// Unified member initialization - preserves declaration order
enum MemberInit {
    /// Public property: `foo = value`
    PubProp {
        span: Span,
        name: PropName,
        value: Box<Expr>,
    },
    /// Private property: `#foo = value`
    PrivProp {
        span: Span,
        name: Ident,
        value: Box<Expr>,
    },
    /// Private method: `#method() {}`
    PrivMethod {
        span: Span,
        name: Ident,
        fn_name: Ident,
    },
    /// Private accessor: `get #prop()` / `set #prop()`
    PrivAccessor {
        span: Span,
        name: Ident,
        getter: Option<Ident>,
        setter: Option<Ident>,
    },
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
                    // Merge getter/setter information for accessors
                    let existing = self.cls.privates.get(&m.key.name).copied();
                    let kind = if let Some(mut existing_kind) = existing {
                        // Merge with existing entry (for accessor pairs)
                        if m.kind == MethodKind::Getter {
                            existing_kind.has_getter = true;
                        } else if m.kind == MethodKind::Setter {
                            existing_kind.has_setter = true;
                        }
                        existing_kind
                    } else {
                        // New entry
                        PrivateKind {
                            is_method: true,
                            is_static: m.is_static,
                            has_getter: m.kind == MethodKind::Getter,
                            has_setter: m.kind == MethodKind::Setter,
                        }
                    };

                    self.cls.privates.insert(m.key.name.clone(), kind);

                    if !self.cls.methods.contains(&m.key.name) {
                        self.cls.methods.push(m.key.name.clone());
                    }

                    if m.is_static && !self.cls.statics.contains(&m.key.name) {
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
                            // Store computed key declarations to be injected right before the
                            // class
                            self.cls.computed_key_decls.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.clone().into(),
                                init: Some(expr_value),
                                definite: false,
                            });
                            **expr = ident.into();
                        }
                    }

                    // Transform private field accesses in method body
                    if let Some(body) = &mut method.function.body {
                        let mut visitor = PrivateAccessVisitor::new(
                            &self.cls.privates,
                            self.cls.mark,
                            self.assumptions,
                        );
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
        let constructor = self.process_constructor(constructor, has_super, class.span, ctx);
        if let Some(c) = constructor {
            new_members.push(ClassMember::Constructor(c));
        }

        new_members
    }

    fn process_class_prop(&mut self, mut prop: ClassProp, _has_super: bool, ctx: &mut TraverseCtx) {
        let prop_span = prop.span();

        // Extract computed keys if needed
        // For instance properties, always extract the key so it's captured at class
        // definition time For static properties, only extract if there's a
        // collision or complex expression
        if let PropName::Computed(key) = &mut prop.key {
            if !is_literal(&key.expr) {
                // For instance properties, always extract computed keys
                // For static properties, only extract if needed
                let should_extract = if prop.is_static {
                    // Only extract if it's a complex expression or there's a name collision
                    if let Expr::Ident(i) = &*key.expr {
                        self.cls.used_key_names.contains(&i.sym)
                    } else {
                        true
                    }
                } else {
                    // Always extract for instance properties
                    true
                };

                let (ident, aliased) = if let Expr::Ident(i) = &*key.expr {
                    if should_extract {
                        (alias_ident_for(&key.expr, "_ref"), true)
                    } else {
                        (i.clone(), false)
                    }
                } else {
                    alias_if_required(&key.expr, "_ref")
                };

                if aliased {
                    // Store computed key declarations to be injected right before the class
                    // This ensures they're evaluated at class definition time, not at scope start
                    self.cls.computed_key_decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: ident.clone().into(),
                        init: Some(key.expr.take()),
                        definite: false,
                    });
                }
                *key.expr = ident.into();
            }
        }

        let mut value = prop.value.unwrap_or_else(|| Expr::undefined(prop_span));

        // Transform new.target in property initializers to void 0
        value.visit_mut_with(&mut NewTargetInProp);

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

            // For static properties, replace `super.x` with `_super.x`
            if let Some(super_ident) = &self.cls.super_ident {
                value.visit_mut_with(&mut SuperInStaticFolder {
                    super_ident: super_ident.clone(),
                });
            }
        }

        // Transform private field accesses in the value expression
        // (e.g., `y = this.#x` -> `y = _class_private_field_get(this, _x)`)
        {
            let mut visitor =
                PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark, self.assumptions);
            value.visit_mut_with(&mut visitor);

            // Add variable declarations from the visitor
            for decl in visitor.vars {
                if let Pat::Ident(ident) = decl.name {
                    ctx.var_declarations.insert_var(ident, decl.init);
                } else {
                    ctx.var_declarations
                        .insert_var_pattern(decl.name, decl.init);
                }
            }
        }

        let init = MemberInit::PubProp {
            span: prop_span,
            name: prop.key,
            value,
        };

        if prop.is_static {
            self.cls.static_inits.push(init);
        } else {
            self.cls.instance_inits.push(init);
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

        // Transform new.target in property initializers to void 0
        value.visit_mut_with(&mut NewTargetInProp);

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

        // Transform private field accesses in the value expression
        // (e.g., `#y = this.#x + 1` -> `#y = _class_private_field_get(this, _x) + 1`)
        {
            let mut visitor =
                PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark, self.assumptions);
            value.visit_mut_with(&mut visitor);

            // Add variable declarations from the visitor
            for decl in visitor.vars {
                if let Pat::Ident(ident) = decl.name {
                    ctx.var_declarations.insert_var(ident, decl.init);
                } else {
                    ctx.var_declarations
                        .insert_var_pattern(decl.name, decl.init);
                }
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

        let init = MemberInit::PrivProp {
            span: prop_span,
            name: ident,
            value,
        };

        if prop.is_static {
            self.cls.static_inits.push(init);
        } else {
            self.cls.instance_inits.push(init);
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
            let mut visitor =
                PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark, self.assumptions);
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

                // Check if accessor already exists in instance_inits
                let mut found = false;
                for init in &mut self.cls.instance_inits {
                    if let MemberInit::PrivAccessor {
                        name,
                        getter,
                        setter,
                        ..
                    } = init
                    {
                        if name.sym == weak_coll_var.sym {
                            if is_getter {
                                *getter = Some(fn_name.clone());
                            } else {
                                *setter = Some(fn_name.clone());
                            }
                            found = true;
                            break;
                        }
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

                    self.cls.instance_inits.push(MemberInit::PrivAccessor {
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

                // Check if accessor already exists in static_inits
                let mut found = false;
                for init in &mut self.cls.static_inits {
                    if let MemberInit::PrivAccessor {
                        name,
                        getter,
                        setter,
                        ..
                    } = init
                    {
                        if name.sym == weak_coll_var.sym {
                            if is_getter {
                                *getter = Some(fn_name.clone());
                            } else {
                                *setter = Some(fn_name.clone());
                            }
                            found = true;
                            break;
                        }
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

                    self.cls.static_inits.push(MemberInit::PrivAccessor {
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

                self.cls.instance_inits.push(MemberInit::PrivMethod {
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
        _: &mut TraverseCtx,
    ) -> Option<Constructor> {
        let has_initializers = !self.cls.instance_inits.is_empty();

        if !has_initializers && constructor.is_none() {
            return None;
        }

        // Store visitor vars to prepend later
        let mut constructor_vars = Vec::new();

        // Transform private field accesses in constructor body before adding
        // initializers
        if let Some(ref mut c) = constructor {
            if let Some(ref mut body) = c.body {
                let mut visitor =
                    PrivateAccessVisitor::new(&self.cls.privates, self.cls.mark, self.assumptions);
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

            // Separate methods/accessors from fields while preserving declaration order
            // Methods and accessors need to be initialized first (they're available before
            // field values) Fields are initialized in declaration order after
            // methods/accessors
            let mut method_accessor_inits = Vec::new();
            let mut field_inits = Vec::new();

            for init in take(&mut self.cls.instance_inits) {
                match init {
                    MemberInit::PrivMethod { span, name, .. } => {
                        // WeakSet.add(this)
                        method_accessor_inits.push(
                            ExprStmt {
                                span,
                                expr: Box::new(
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: name.make_member(quote_ident!("add")).as_callee(),
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
                    MemberInit::PrivAccessor {
                        span,
                        name,
                        getter,
                        setter,
                    } => {
                        // WeakMap.set(this, { get, set })
                        let desc = create_accessor_desc(getter, setter);
                        method_accessor_inits.push(
                            ExprStmt {
                                span,
                                expr: Box::new(
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: name.make_member(quote_ident!("set")).as_callee(),
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
                    MemberInit::PrivProp { span, name, value } => {
                        // _class_private_field_init(this, _field, { writable: true, value })
                        use swc_ecma_transforms_base::helper;

                        field_inits.push(
                            ExprStmt {
                                span,
                                expr: Box::new(
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_init),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(name.into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(
                                                    ObjectLit {
                                                        span: DUMMY_SP,
                                                        props: vec![
                                                            PropOrSpread::Prop(Box::new(
                                                                Prop::KeyValue(KeyValueProp {
                                                                    key: PropName::Ident(
                                                                        quote_ident!("writable"),
                                                                    ),
                                                                    value: Box::new(
                                                                        Lit::Bool(Bool {
                                                                            span: DUMMY_SP,
                                                                            value: true,
                                                                        })
                                                                        .into(),
                                                                    ),
                                                                }),
                                                            )),
                                                            PropOrSpread::Prop(Box::new(
                                                                Prop::KeyValue(KeyValueProp {
                                                                    key: PropName::Ident(
                                                                        quote_ident!("value"),
                                                                    ),
                                                                    value,
                                                                }),
                                                            )),
                                                        ],
                                                    }
                                                    .into(),
                                                ),
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
                    MemberInit::PubProp { span, name, value } => {
                        let use_define_property = !self.assumptions.set_public_class_fields;

                        if use_define_property {
                            // Use _define_property for [[Define]] semantics (strict mode)
                            use swc_ecma_transforms_base::helper;

                            let prop_key = match name {
                                PropName::Ident(id) => Box::new(
                                    Lit::Str(Str {
                                        span: id.span,
                                        raw: None,
                                        value: id.sym.into(),
                                    })
                                    .into(),
                                ),
                                PropName::Str(s) => Box::new(s.into()),
                                PropName::Num(n) => Box::new(n.into()),
                                PropName::Computed(c) => c.expr,
                                PropName::BigInt(b) => Box::new(b.into()),
                            };

                            field_inits.push(
                                ExprStmt {
                                    span,
                                    expr: Box::new(
                                        CallExpr {
                                            span,
                                            callee: helper!(define_property),
                                            args: vec![
                                                ExprOrSpread {
                                                    spread: None,
                                                    expr: Box::new(
                                                        ThisExpr { span: DUMMY_SP }.into(),
                                                    ),
                                                },
                                                ExprOrSpread {
                                                    spread: None,
                                                    expr: prop_key,
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
                                }
                                .into(),
                            );
                        } else {
                            // Use assignment for loose mode
                            field_inits.push(
                                ExprStmt {
                                    span,
                                    expr: Box::new(
                                        AssignExpr {
                                            span,
                                            op: op!("="),
                                            left: match name {
                                                PropName::Ident(id) => ThisExpr { span: DUMMY_SP }
                                                    .make_member(id)
                                                    .into(),
                                                _ => {
                                                    let key = prop_name_to_expr(name);
                                                    ThisExpr { span: DUMMY_SP }
                                                        .computed_member(key)
                                                        .into()
                                                }
                                            },
                                            right: value,
                                        }
                                        .into(),
                                    ),
                                }
                                .into(),
                            );
                        }
                    }
                }
            }

            // Combine: methods/accessors first, then fields in declaration order
            let mut initializers = method_accessor_inits;
            initializers.extend(field_inits);

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

    /// Build static initializers as expressions for use in sequence expressions
    /// (used for class expressions)
    fn build_static_initializer_exprs(
        &mut self,
        class_ident: &Ident,
        _ctx: &mut TraverseCtx,
    ) -> Vec<Box<Expr>> {
        use swc_ecma_transforms_base::helper;

        // Separate accessors from fields while preserving declaration order
        let mut accessor_exprs = Vec::new();
        let mut field_exprs = Vec::new();

        let use_define_property = !self.assumptions.set_public_class_fields;

        for init in take(&mut self.cls.static_inits) {
            match init {
                MemberInit::PrivAccessor {
                    span,
                    name,
                    getter,
                    setter,
                } => {
                    // WeakMap.set(ClassName, { get, set })
                    let descriptor = create_accessor_desc(getter, setter);
                    let set_call = Box::new(
                        CallExpr {
                            span,
                            callee: name.make_member(quote_ident!("set")).as_callee(),
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
                    );
                    accessor_exprs.push(set_call);
                }
                MemberInit::PrivProp { span, name, value } => {
                    // WeakMap.set(ClassName, { writable: true, value })
                    let descriptor = ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(IdentName::new("writable".into(), DUMMY_SP)),
                                value: Box::new(
                                    Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    })
                                    .into(),
                                ),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(IdentName::new("value".into(), DUMMY_SP)),
                                value,
                            }))),
                        ],
                    };
                    let set_call = Box::new(
                        CallExpr {
                            span,
                            callee: name.make_member(quote_ident!("set")).as_callee(),
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
                    );
                    field_exprs.push(set_call);
                }
                MemberInit::PubProp { span, name, value } => {
                    if use_define_property {
                        let prop_key = match name {
                            PropName::Ident(id) => Box::new(
                                Lit::Str(Str {
                                    span: id.span,
                                    raw: None,
                                    value: id.sym.into(),
                                })
                                .into(),
                            ),
                            PropName::Str(s) => Box::new(s.into()),
                            PropName::Num(n) => Box::new(n.into()),
                            PropName::Computed(c) => c.expr,
                            PropName::BigInt(b) => Box::new(b.into()),
                        };

                        let define_call = Box::new(
                            CallExpr {
                                span,
                                callee: helper!(define_property),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(class_ident.clone().into()),
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: prop_key,
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
                        );
                        field_exprs.push(define_call);
                    } else {
                        let assign_expr = Box::new(
                            AssignExpr {
                                span,
                                op: op!("="),
                                left: match name {
                                    PropName::Ident(id) => {
                                        class_ident.clone().make_member(id).into()
                                    }
                                    _ => {
                                        let key = prop_name_to_expr(name);
                                        class_ident.clone().computed_member(key).into()
                                    }
                                },
                                right: value,
                            }
                            .into(),
                        );
                        field_exprs.push(assign_expr);
                    }
                }
                MemberInit::PrivMethod { .. } => {
                    // Static private methods don't need runtime initialization
                }
            }
        }

        // Accessors first, then fields in declaration order
        let mut exprs = accessor_exprs;
        exprs.extend(field_exprs);
        exprs
    }

    fn emit_static_initializers(
        &mut self,
        class_ident: &Ident,
        _stmt_addr: Option<*const Stmt>,
        _ctx: &mut TraverseCtx,
    ) {
        use swc_ecma_transforms_base::helper;

        // Separate private method declarations (go AFTER class in loose mode) from
        // static initializers (go after class)
        let private_method_decls = take(&mut self.cls.private_method_decls);

        // Separate accessors from fields while preserving declaration order
        let mut accessor_stmts = Vec::new();
        let mut field_stmts = Vec::new();

        for init in take(&mut self.cls.static_inits) {
            match init {
                MemberInit::PrivAccessor {
                    span,
                    name,
                    getter,
                    setter,
                } => {
                    // WeakMap.set(ClassName, { get, set })
                    let descriptor = create_accessor_desc(getter, setter);
                    let set_stmt = Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(
                            CallExpr {
                                span,
                                callee: name.make_member(quote_ident!("set")).as_callee(),
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
                    accessor_stmts.push(set_stmt);
                }
                MemberInit::PrivProp { span, name, value } => {
                    // WeakMap.set(ClassName, { writable: true, value })
                    let descriptor = ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(IdentName::new("writable".into(), DUMMY_SP)),
                                value: Box::new(
                                    Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    })
                                    .into(),
                                ),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(IdentName::new("value".into(), DUMMY_SP)),
                                value,
                            }))),
                        ],
                    };
                    let set_stmt = Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(
                            CallExpr {
                                span,
                                callee: name.make_member(quote_ident!("set")).as_callee(),
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
                    field_stmts.push(set_stmt);
                }
                MemberInit::PubProp { span, name, value } => {
                    // Use _define_property helper for [[Define]] semantics
                    let prop_key = match name {
                        PropName::Ident(id) => Box::new(
                            Lit::Str(Str {
                                span: id.span,
                                raw: None,
                                value: id.sym.into(),
                            })
                            .into(),
                        ),
                        PropName::Str(s) => Box::new(s.into()),
                        PropName::Num(n) => Box::new(n.into()),
                        PropName::Computed(c) => c.expr,
                        PropName::BigInt(b) => Box::new(b.into()),
                    };

                    let define_stmt = Stmt::Expr(ExprStmt {
                        span,
                        expr: Box::new(
                            CallExpr {
                                span,
                                callee: helper!(define_property),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(class_ident.clone().into()),
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: prop_key,
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
                    });
                    field_stmts.push(define_stmt);
                }
                MemberInit::PrivMethod { .. } => {
                    // Static private methods don't need runtime initialization
                }
            }
        }

        // Accessors first, then fields in declaration order
        let mut static_initializers = accessor_stmts;
        static_initializers.extend(field_stmts);

        // Build "before" statements from computed key declarations
        let computed_key_decls = take(&mut self.cls.computed_key_decls);
        let before_stmts = if computed_key_decls.is_empty() {
            vec![]
        } else {
            vec![VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls: computed_key_decls,
                ctxt: Default::default(),
                declare: false,
            }
            .into()]
        };

        // Store statements for injection in exit_stmts
        // Note: In loose mode, private method declarations go AFTER the class
        // In WeakSet mode, they would go BEFORE, but we're not implementing that mode
        // yet
        if !private_method_decls.is_empty()
            || !static_initializers.is_empty()
            || !before_stmts.is_empty()
        {
            // Combine all "after" statements: private method decls + static initializers
            let mut all_after_stmts = private_method_decls;
            all_after_stmts.extend(static_initializers);

            self.pending_class_injections.push((
                class_ident.clone(),
                before_stmts,
                all_after_stmts,
            ));
        }
    }
}

impl VisitMutHook<TraverseCtx> for ClassPropertiesPass {
    fn enter_class_decl(&mut self, n: &mut ClassDecl, ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident = Some(n.ident.clone());

        self.analyze_class(&n.class);

        // If there's a super class and any static property uses `super`, we need to
        // create an alias for the super class
        // Note: We must transform super in static properties regardless of
        // constant_super because super cannot be used outside a class context
        if let Some(super_class) = &mut n.class.super_class {
            // Check if any static property uses super
            let has_super_in_static = n.class.body.iter().any(|member| {
                if let ClassMember::ClassProp(prop) = member {
                    if prop.is_static {
                        let mut visitor = SuperVisitor { found: false };
                        if let Some(value) = &prop.value {
                            value.visit_with(&mut visitor);
                        }
                        return visitor.found;
                    }
                }
                false
            });

            if has_super_in_static {
                // Create an alias for the super class
                let super_ident = alias_ident_for(super_class, "_super");

                // Declare the super alias variable
                ctx.var_declarations.insert_var(
                    BindingIdent {
                        id: super_ident.clone(),
                        type_ann: None,
                    },
                    None,
                );

                // Wrap the super class expression with an assignment: (_super = OriginalSuper)
                let original_super = super_class.take();
                *super_class = Box::new(
                    ParenExpr {
                        span: DUMMY_SP,
                        expr: Box::new(
                            AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: super_ident.clone().into(),
                                right: original_super,
                            }
                            .into(),
                        ),
                    }
                    .into(),
                );

                self.cls.super_ident = Some(super_ident);
            }
        }
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

        // For class expressions with static properties, we need to wrap them in a
        // sequence expression Build the static initializers as expressions
        let static_initializers = self.build_static_initializer_exprs(&class_ident, ctx);

        // Take private method declarations and computed key declarations
        let private_method_decls = take(&mut self.cls.private_method_decls);
        let computed_key_decls = take(&mut self.cls.computed_key_decls);

        // If there are static initializers, private method decls, or computed keys,
        // store them for wrapping
        if !static_initializers.is_empty()
            || !private_method_decls.is_empty()
            || !computed_key_decls.is_empty()
        {
            self.pending_class_expr = Some((
                class_ident,
                computed_key_decls,
                static_initializers,
                private_method_decls,
            ));
        }

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, _ctx: &mut TraverseCtx) {
        // Check if we have pending injections from class declarations
        if self.pending_class_injections.is_empty() {
            return;
        }

        // Build a map of class indices in this statement list
        let mut class_indices: FxHashMap<Atom, usize> = FxHashMap::default();
        for (i, stmt) in stmts.iter().enumerate() {
            if let Stmt::Decl(Decl::Class(ClassDecl { ident, .. })) = stmt {
                class_indices.insert(ident.sym.clone(), i);
            }
        }

        if class_indices.is_empty() {
            return;
        }

        // Collect injections that match classes in this statement list
        // We need to process them in reverse order of class indices to maintain
        // correct positions after insertions
        let mut injections_to_process: Vec<(usize, Vec<Stmt>, Vec<Stmt>)> = vec![];
        let mut remaining_injections = vec![];

        for (class_ident, before_stmts, after_stmts) in take(&mut self.pending_class_injections) {
            if let Some(&idx) = class_indices.get(&class_ident.sym) {
                injections_to_process.push((idx, before_stmts, after_stmts));
            } else {
                // Keep injections that don't match any class in this statement list
                remaining_injections.push((class_ident, before_stmts, after_stmts));
            }
        }

        self.pending_class_injections = remaining_injections;

        // Sort injections by index in reverse order (process from end to start)
        // This ensures earlier insertions don't affect later indices
        injections_to_process.sort_by(|a, b| b.0.cmp(&a.0));

        for (idx, before_stmts, after_stmts) in injections_to_process {
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

    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        // Check if we have a pending class expression transformation
        if let Some((class_ident, computed_key_decls, static_initializers, private_method_decls)) =
            self.pending_class_expr.take()
        {
            // We need to wrap the class expression in a sequence expression
            // Pattern: (_k = k(), _class = class { ... }, _class.prop = value, ..., _class)
            if let Expr::Class(class_expr) = expr {
                let mut exprs = Vec::new();

                // Add computed key assignment expressions first
                for decl in computed_key_decls {
                    if let Pat::Ident(ident) = decl.name {
                        // Declare the variable
                        ctx.var_declarations.insert_var(
                            BindingIdent {
                                id: ident.id.clone(),
                                type_ann: None,
                            },
                            None,
                        );

                        // Add assignment expression if there's an initializer
                        if let Some(init) = decl.init {
                            exprs.push(Box::new(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: ident.id.into(),
                                    right: init,
                                }
                                .into(),
                            ));
                        }
                    }
                }

                // Declare the class variable
                ctx.var_declarations.insert_var(
                    BindingIdent {
                        id: class_ident.clone(),
                        type_ann: None,
                    },
                    None,
                );

                // Add class assignment expression: _class = class { ... }
                exprs.push(Box::new(
                    AssignExpr {
                        span: class_expr.class.span,
                        op: op!("="),
                        left: class_ident.clone().into(),
                        right: Box::new(take(expr)),
                    }
                    .into(),
                ));

                // Add static initializers
                exprs.extend(static_initializers);

                // Handle private method declarations by storing them in a separate context
                // For now, we'll need to inject them differently
                if !private_method_decls.is_empty() {
                    // Private method declarations can't be inlined in
                    // expressions This is a limitation
                    // we'll need to handle separately
                    // For now, we'll skip them in expressions
                    // TODO: Handle private methods in class expressions
                    // properly
                }

                // Final expression: return the class identifier
                exprs.push(Box::new(class_ident.into()));

                // Replace the class expression with a sequence expression
                *expr = SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into();
            }
        }
    }

    fn exit_module_items(&mut self, items: &mut Vec<ModuleItem>, _ctx: &mut TraverseCtx) {
        // Check if we have pending injections from class declarations
        if self.pending_class_injections.is_empty() {
            return;
        }

        // Build a map of class indices in this module item list
        let mut class_indices: FxHashMap<Atom, usize> = FxHashMap::default();
        for (i, item) in items.iter().enumerate() {
            let class_name = match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl { ident, .. }))) => {
                    Some(ident.sym.clone())
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Class(ClassDecl { ident, .. }),
                    ..
                })) => Some(ident.sym.clone()),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Class(ClassExpr {
                            ident: Some(ident), ..
                        }),
                    ..
                })) => Some(ident.sym.clone()),
                _ => None,
            };

            if let Some(name) = class_name {
                class_indices.insert(name, i);
            }
        }

        if class_indices.is_empty() {
            return;
        }

        // Collect injections that match classes in this module item list
        let mut injections_to_process: Vec<(usize, Vec<Stmt>, Vec<Stmt>)> = vec![];
        let mut remaining_injections = vec![];

        for (class_ident, before_stmts, after_stmts) in take(&mut self.pending_class_injections) {
            if let Some(&idx) = class_indices.get(&class_ident.sym) {
                injections_to_process.push((idx, before_stmts, after_stmts));
            } else {
                remaining_injections.push((class_ident, before_stmts, after_stmts));
            }
        }

        self.pending_class_injections = remaining_injections;

        // Sort injections by index in reverse order
        injections_to_process.sort_by(|a, b| b.0.cmp(&a.0));

        for (idx, before_stmts, after_stmts) in injections_to_process {
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

// Helper visitor to replace `super.x` with `_super.x` in static property
// initializers
struct SuperInStaticFolder {
    super_ident: Ident,
}

impl VisitMut for SuperInStaticFolder {
    noop_visit_mut_type!(fail);

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {
        // Don't visit constructors
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        // Transform super.prop to _super.prop
        if let Expr::SuperProp(super_prop) = e {
            match &super_prop.prop {
                SuperProp::Ident(prop) => {
                    *e = MemberExpr {
                        span: super_prop.span,
                        obj: Box::new(self.super_ident.clone().into()),
                        prop: MemberProp::Ident(prop.clone()),
                    }
                    .into();
                }
                SuperProp::Computed(computed) => {
                    *e = MemberExpr {
                        span: super_prop.span,
                        obj: Box::new(self.super_ident.clone().into()),
                        prop: MemberProp::Computed(computed.clone()),
                    }
                    .into();
                }
            }
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // Don't visit nested functions - they have their own this/super binding
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

/// Visitor that transforms `new.target` to `void 0` in property initializers.
///
/// This is necessary because property initializers are not evaluated in a
/// constructor context, so `new.target` should always be `undefined`.
struct NewTargetInProp;

impl VisitMut for NewTargetInProp {
    noop_visit_mut_type!(fail);

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {
        // Don't visit constructors
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::MetaProp(MetaPropExpr {
            span,
            kind: MetaPropKind::NewTarget,
        }) = e
        {
            *e = *Expr::undefined(*span);
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // Don't visit nested functions
    }
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
    /// Assumptions for optional chaining
    assumptions: Assumptions,
    /// Variables that need to be declared in the enclosing function scope
    vars: Vec<VarDeclarator>,
}

impl<'a> PrivateAccessVisitor<'a> {
    fn new(
        privates: &'a FxHashMap<Atom, PrivateKind>,
        mark: Mark,
        assumptions: Assumptions,
    ) -> Self {
        Self {
            privates,
            mark,
            assumptions,
            vars: Vec::new(),
        }
    }

    /// Check if an OptChainExpr contains any private field accesses that belong
    /// to the current class
    fn has_private_access_in_opt_chain(&self, opt: &OptChainExpr) -> bool {
        struct PrivateAccessChecker<'a> {
            privates: &'a FxHashMap<Atom, PrivateKind>,
            found: bool,
        }

        impl Visit for PrivateAccessChecker<'_> {
            noop_visit_type!(fail);

            fn visit_member_expr(&mut self, m: &MemberExpr) {
                if let MemberProp::PrivateName(private_name) = &m.prop {
                    if self.privates.contains_key(&private_name.name) {
                        self.found = true;
                        return;
                    }
                }
                m.visit_children_with(self);
            }

            // Don't visit into nested functions/classes
            fn visit_function(&mut self, _: &Function) {}

            fn visit_class(&mut self, _: &Class) {}

            fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}
        }

        let mut checker = PrivateAccessChecker {
            privates: self.privates,
            found: false,
        };
        opt.visit_with(&mut checker);
        checker.found
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
                                    // Simple field assignment: _class_private_field_set(obj,
                                    // _field, value)
                                    use swc_ecma_transforms_base::helper;

                                    *expr = CallExpr {
                                        span: assign.span,
                                        callee: helper!(class_private_field_set),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: obj,
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.into()),
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
                                    // Field: _class_private_field_get(obj, _field)
                                    use swc_ecma_transforms_base::helper;

                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_get),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.clone().into()),
                                            },
                                        ],
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
                                    // Field: _class_private_field_set(obj, _field, value)
                                    use swc_ecma_transforms_base::helper;

                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_set),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.into()),
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
                                let descriptor_get = CallExpr {
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

                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: Expr::from(descriptor_get)
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
                                // Field: _class_private_field_get(obj, _field)
                                use swc_ecma_transforms_base::helper;

                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: helper!(class_private_field_get),
                                    args: vec![
                                        ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(obj_alias.clone().into()),
                                        },
                                        ExprOrSpread {
                                            spread: None,
                                            expr: Box::new(weak_coll_ident.clone().into()),
                                        },
                                    ],
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

                                // For BigInt support: use (typeof val === 'bigint' ? 1n : 1)
                                let temp_value_ident = alias_ident_for(&obj, "_val");
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: temp_value_ident.clone().into(),
                                    init: None,
                                    definite: false,
                                });

                                let one_expr = CondExpr {
                                    span: DUMMY_SP,
                                    test: Box::new(
                                        BinExpr {
                                            span: DUMMY_SP,
                                            op: op!("==="),
                                            left: Box::new(
                                                UnaryExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("typeof"),
                                                    arg: Box::new(temp_value_ident.clone().into()),
                                                }
                                                .into(),
                                            ),
                                            right: Box::new(
                                                Lit::Str(Str {
                                                    span: DUMMY_SP,
                                                    raw: None,
                                                    value: "bigint".into(),
                                                })
                                                .into(),
                                            ),
                                        }
                                        .into(),
                                    ),
                                    cons: Box::new(
                                        Lit::BigInt(BigInt {
                                            span: DUMMY_SP,
                                            raw: None,
                                            value: Box::new(1.into()),
                                        })
                                        .into(),
                                    ),
                                    alt: Box::new(
                                        Lit::Num(Number {
                                            span: DUMMY_SP,
                                            value: 1.0,
                                            raw: None,
                                        })
                                        .into(),
                                    ),
                                };

                                let new_value_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: bin_op,
                                    left: Box::new(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left: temp_value_ident.clone().into(),
                                            right: Box::new(get_call.into()),
                                        }
                                        .into(),
                                    ),
                                    right: Box::new(one_expr.into()),
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
                                    // Field: _class_private_field_set(obj, _field, value)
                                    use swc_ecma_transforms_base::helper;

                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_set),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.into()),
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

                                // For BigInt support: use (typeof val === 'bigint' ? 1n : 1)
                                let one_expr = CondExpr {
                                    span: DUMMY_SP,
                                    test: Box::new(
                                        BinExpr {
                                            span: DUMMY_SP,
                                            op: op!("==="),
                                            left: Box::new(
                                                UnaryExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("typeof"),
                                                    arg: Box::new(old_value_ident.clone().into()),
                                                }
                                                .into(),
                                            ),
                                            right: Box::new(
                                                Lit::Str(Str {
                                                    span: DUMMY_SP,
                                                    raw: None,
                                                    value: "bigint".into(),
                                                })
                                                .into(),
                                            ),
                                        }
                                        .into(),
                                    ),
                                    cons: Box::new(
                                        Lit::BigInt(BigInt {
                                            span: DUMMY_SP,
                                            raw: None,
                                            value: Box::new(1.into()),
                                        })
                                        .into(),
                                    ),
                                    alt: Box::new(
                                        Lit::Num(Number {
                                            span: DUMMY_SP,
                                            value: 1.0,
                                            raw: None,
                                        })
                                        .into(),
                                    ),
                                };

                                let new_value_expr = BinExpr {
                                    span: DUMMY_SP,
                                    op: bin_op,
                                    left: Box::new(old_value_ident.clone().into()),
                                    right: Box::new(one_expr.into()),
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
                                    // Field: _class_private_field_set(obj, _field, value)
                                    use swc_ecma_transforms_base::helper;

                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_set),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.into()),
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
                                } else if !kind.is_method {
                                    // Private field call: _class_private_field_get(obj,
                                    // _field).call(obj, ...args)
                                    // This preserves the receiver when calling a function stored in
                                    // a private field
                                    use swc_ecma_transforms_base::helper;

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

                                    // Transform to: (_obj = obj, _class_private_field_get(_obj,
                                    // _field).call(_obj, ...args))
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
                                                        callee: helper!(class_private_field_get),
                                                        args: vec![
                                                            ExprOrSpread {
                                                                spread: None,
                                                                expr: Box::new(
                                                                    obj_alias.clone().into(),
                                                                ),
                                                            },
                                                            ExprOrSpread {
                                                                spread: None,
                                                                expr: Box::new(
                                                                    weak_coll_ident.into(),
                                                                ),
                                                            },
                                                        ],
                                                        type_args: Default::default(),
                                                        ctxt: Default::default(),
                                                    }
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
            Expr::TaggedTpl(tagged) => {
                // Handle private method/field as tagged template tag
                // e.g., this.#tag`template`
                if let Expr::Member(member) = &mut *tagged.tag {
                    if let MemberProp::PrivateName(private_name) = &member.prop {
                        if let Some(kind) = self.privates.get(&private_name.name) {
                            let obj = member.obj.take();
                            let obj_alias = alias_ident_for(&obj, "_obj");

                            // Declare the variable
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: obj_alias.clone().into(),
                                init: None,
                                definite: false,
                            });

                            tagged.tpl.visit_mut_with(self);

                            let bound_fn = if kind.is_method && !kind.has_getter && !kind.has_setter
                            {
                                // Regular private method: _tag.bind(obj)
                                let method_name = Ident::new(
                                    if private_name.name.is_reserved_in_any() {
                                        format!("__{}", private_name.name).into()
                                    } else {
                                        private_name.name.clone()
                                    },
                                    private_name.span,
                                    SyntaxContext::empty().apply_mark(self.mark),
                                );

                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: method_name
                                        .make_member(quote_ident!("bind"))
                                        .as_callee(),
                                    args: vec![ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(obj_alias.clone().into()),
                                    }],
                                    type_args: Default::default(),
                                    ctxt: Default::default(),
                                }
                                .into()
                            } else {
                                // Private field: _class_private_field_get(obj, _field).bind(obj)
                                use swc_ecma_transforms_base::helper;

                                let weak_coll_ident = Ident::new(
                                    format!("_{}", private_name.name).into(),
                                    private_name.span,
                                    SyntaxContext::empty().apply_mark(self.mark),
                                );

                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(class_private_field_get),
                                        args: vec![
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(obj_alias.clone().into()),
                                            },
                                            ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(weak_coll_ident.into()),
                                            },
                                        ],
                                        type_args: Default::default(),
                                        ctxt: Default::default(),
                                    })
                                    .make_member(quote_ident!("bind"))
                                    .as_callee(),
                                    args: vec![ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(obj_alias.clone().into()),
                                    }],
                                    type_args: Default::default(),
                                    ctxt: Default::default(),
                                }
                                .into()
                            };

                            // Transform to: (_obj = obj, _tag.bind(_obj)`template`)
                            *expr = SeqExpr {
                                span: tagged.span,
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
                                        TaggedTpl {
                                            span: tagged.span,
                                            ctxt: tagged.ctxt,
                                            tag: Box::new(bound_fn),
                                            type_params: tagged.type_params.take(),
                                            tpl: tagged.tpl.take(),
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
                            // Field: _class_private_field_get(obj, _field)
                            use swc_ecma_transforms_base::helper;

                            *expr = CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(class_private_field_get),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: obj,
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(weak_coll_ident.into()),
                                    },
                                ],
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
            Expr::OptChain(opt_chain) => {
                // Check if this optional chain contains private field accesses
                let has_private_access = self.has_private_access_in_opt_chain(opt_chain);

                if has_private_access {
                    // Transform the optional chain inline, then continue transforming
                    // the result
                    use crate::es2020::optional_chaining_impl::optional_chaining_impl;

                    let mut v = optional_chaining_impl(
                        crate::es2020::optional_chaining_impl::Config {
                            no_document_all: self.assumptions.no_document_all,
                            pure_getter: self.assumptions.pure_getters,
                        },
                        Mark::new(),
                    );
                    expr.visit_mut_with(&mut v);
                    self.vars.extend(v.take_vars());

                    // Now continue visiting the transformed expression
                    expr.visit_mut_with(self);
                } else {
                    opt_chain.visit_mut_children_with(self);
                }
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_opt_chain_base(&mut self, base: &mut OptChainBase) {
        // Visit children of OptChainBase to transform private field accesses
        base.visit_mut_children_with(self);
    }

    // Don't visit into regular functions - they have their own `this` binding
    // (though they can still access private fields via explicit object reference)
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        // Visit constructor body to transform private field accesses
        if let Some(body) = &mut n.body {
            body.visit_mut_with(self);
        }
    }

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        // Arrow functions inherit `this` from enclosing scope,
        // so we should transform private field accesses inside them
        // Visit parameters (may contain patterns with private field access)
        n.params.visit_mut_with(self);
        // Visit the body
        match n.body.as_mut() {
            BlockStmtOrExpr::BlockStmt(block) => {
                block.visit_mut_with(self);
            }
            BlockStmtOrExpr::Expr(expr) => {
                expr.visit_mut_with(self);
            }
        }
    }

    // Don't visit into nested classes - they have their own private scope
    fn visit_mut_class(&mut self, _: &mut Class) {}

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        // Handle private field in destructuring pattern (e.g., `[this.#x] = arr` or
        // `[Foo.#x] = arr`) Transform: `obj.#field` ->
        // `class_private_field_destructure(obj, _field).value`
        if let Pat::Expr(expr) = p {
            if let Expr::Member(member) = &mut **expr {
                if let MemberProp::PrivateName(private_name) = &member.prop {
                    // Check if this is a private member of the current class
                    if let Some(kind) = self.privates.get(&private_name.name) {
                        // Handle both instance and static fields (not methods/accessors)
                        if !kind.is_method {
                            use swc_ecma_transforms_base::helper;

                            let weak_coll_ident = Ident::new(
                                format!("_{}", private_name.name).into(),
                                private_name.span,
                                SyntaxContext::empty().apply_mark(self.mark),
                            );

                            let obj = member.obj.take();

                            // class_private_field_destructure(obj, _field).value
                            let destructure_call = CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(class_private_field_destructure),
                                args: vec![
                                    ExprOrSpread {
                                        spread: None,
                                        expr: obj,
                                    },
                                    ExprOrSpread {
                                        spread: None,
                                        expr: Box::new(weak_coll_ident.into()),
                                    },
                                ],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            };

                            // .value
                            **expr = destructure_call.make_member(quote_ident!("value")).into();
                            return;
                        }
                    }
                }
            }
        }

        // Continue visiting children for other patterns
        p.visit_mut_children_with(self);
    }
}
