//! TypeScript enum transformation.
//!
//! Transforms TypeScript enums into JavaScript IIFE patterns.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{source_map::PURE_SP, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

/// Transforms a TypeScript enum declaration into JavaScript.
///
/// Returns a variable declaration that combines var + IIFE:
/// `var Foo = /*#__PURE__*/ function(Foo) { ... }(Foo || {});`
///
/// For exported enums, uses `({})` instead of `(Foo || {})` since the
/// export declaration creates a fresh binding.
///
/// For block-scoped enums (non-exported inside namespaces), uses `let` instead
/// of `var`.
pub fn transform_enum(
    e: &TsEnumDecl,
    _is_mutable: bool,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    is_export: bool,
) -> (VarDecl, Expr) {
    transform_enum_with_options(e, existing_values, is_export, false)
}

/// Transforms a TypeScript enum declaration with more options.
pub fn transform_enum_block_scoped(
    e: &TsEnumDecl,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> (VarDecl, Expr) {
    transform_enum_with_options(e, existing_values, true, true)
}

fn transform_enum_with_options(
    e: &TsEnumDecl,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    use_empty_object: bool,
    is_block_scoped: bool,
) -> (VarDecl, Expr) {
    let id = e.id.clone();

    // Create IIFE body
    let mut stmts = Vec::with_capacity(e.members.len());
    let mut current_value: Option<f64> = Some(0.0);
    let mut member_values: FxHashMap<Atom, TsLit> = FxHashMap::default();

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        };

        let (value_expr, computed_value) = if let Some(init) = &member.init {
            let computed = compute_const_expr(init, &member_values, existing_values);
            let expr = if let Some(val) = &computed {
                match val {
                    TsLit::Number(n) => {
                        current_value = Some(n.value);
                        Box::new(Expr::Lit(Lit::Num(n.clone())))
                    }
                    TsLit::Str(s) => {
                        current_value = None;
                        // Create new Str with raw: None to normalize quote style
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span: s.span,
                            value: s.value.clone(),
                            raw: None,
                        })))
                    }
                    _ => {
                        current_value = None;
                        init.clone()
                    }
                }
            } else {
                current_value = None;
                init.clone()
            };
            (expr, computed)
        } else if let Some(val) = current_value {
            let num = Number {
                span: DUMMY_SP,
                value: val,
                raw: None,
            };
            (
                Box::new(Expr::Lit(Lit::Num(num.clone()))),
                Some(TsLit::Number(num)),
            )
        } else {
            let undefined_ident = Ident::new_no_ctxt("undefined".into(), DUMMY_SP);
            (Box::new(Expr::Ident(undefined_ident)), None)
        };

        if let Some(val) = &computed_value {
            member_values.insert(member_name.clone(), val.clone());
        }

        if let Some(val) = current_value {
            current_value = Some(val + 1.0);
        }

        // Use string key: Foo["a"] instead of Foo.a
        let stmt = create_enum_member_stmt(&id, &member_name, value_expr, &member.id);
        stmts.push(stmt);
    }

    // Add return statement
    stmts.push(Stmt::Return(ReturnStmt {
        span: DUMMY_SP,
        arg: Some(Box::new(Expr::Ident(id.clone()))),
    }));

    // Create the IIFE expression: function(Foo) { ... }(Foo || {})
    // For exports or block-scoped, use ({}) instead of (Foo || {})
    let iife = create_enum_iife(&id, stmts, use_empty_object);

    // Create variable declaration: var Foo = IIFE; (or let for block-scoped)
    let var_decl = VarDecl {
        span: DUMMY_SP,
        kind: if is_block_scoped {
            VarDeclKind::Let
        } else {
            VarDeclKind::Var
        },
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(id.clone().into()),
            init: Some(Box::new(iife.clone())),
            definite: false,
        }],
        ..Default::default()
    };

    // Return empty expression since we put everything in var_decl
    (var_decl, Expr::Invalid(Invalid { span: DUMMY_SP }))
}

/// Creates an enum member assignment statement using string-based member
/// access.
fn create_enum_member_stmt(
    enum_id: &Ident,
    member_name: &Atom,
    value: Box<Expr>,
    member_id: &TsEnumMemberId,
) -> Stmt {
    let is_string_value = matches!(&*value, Expr::Lit(Lit::Str(_)));

    // Always use computed property (string key) for the inner access: Foo["a"]
    let key_str = match member_id {
        TsEnumMemberId::Ident(i) => i.sym.clone(),
        TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
    };
    let prop = MemberProp::Computed(ComputedPropName {
        span: DUMMY_SP,
        expr: Box::new(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: key_str.into(),
            raw: None,
        }))),
    });

    if is_string_value {
        // For string values: Foo["a"] = "value";
        let assign = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(enum_id.clone())),
                prop,
            }
            .into(),
            right: value,
        });
        assign.into_stmt()
    } else {
        // For numeric values: Foo[Foo["a"] = 0] = "a";
        let inner_assign = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(enum_id.clone())),
                prop,
            }
            .into(),
            right: value,
        });

        let outer_assign = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(enum_id.clone())),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(inner_assign),
                }),
            }
            .into(),
            right: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: member_name.clone().into(),
                raw: None,
            }))),
        });

        outer_assign.into_stmt()
    }
}

/// Creates the IIFE wrapper for the enum.
/// Output format: /*#__PURE__*/ function(Foo) { ... }(Foo || {})
/// For exports: /*#__PURE__*/ function(Foo) { ... }({})
fn create_enum_iife(enum_id: &Ident, body: Vec<Stmt>, is_export: bool) -> Expr {
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(enum_id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts: body,
            ..Default::default()
        }),
        is_generator: false,
        is_async: false,
        ..Default::default()
    };

    let callee = Expr::Fn(FnExpr {
        ident: None,
        function: Box::new(func),
    });

    // For exports, use just {} since the export creates a fresh binding
    // For non-exports, use (Foo || {}) to support declaration merging
    let arg = if is_export {
        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props: vec![],
        })
    } else {
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: op!("||"),
            left: Box::new(Expr::Ident(enum_id.clone())),
            right: Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![],
            })),
        })
    };

    // Create call expression: /*#__PURE__*/ function(Foo) { ... }(arg)
    // Use PURE_SP to add the /*#__PURE__*/ annotation
    Expr::Call(CallExpr {
        span: PURE_SP,
        callee: Callee::Expr(Box::new(callee)),
        args: vec![arg.as_arg()],
        ..Default::default()
    })
}

/// Attempts to compute a constant expression value.
pub fn compute_const_expr(
    expr: &Expr,
    local_values: &FxHashMap<Atom, TsLit>,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Option<TsLit> {
    match expr {
        Expr::Lit(Lit::Num(n)) => Some(TsLit::Number(n.clone())),
        Expr::Lit(Lit::Str(s)) => Some(TsLit::Str(s.clone())),
        Expr::Ident(i) => local_values.get(&i.sym).cloned(),
        Expr::Member(m) => {
            if let Expr::Ident(obj) = &*m.obj {
                if let MemberProp::Ident(prop) = &m.prop {
                    let id = obj.to_id();
                    if let Some(enum_values) = existing_values.get(&id) {
                        return enum_values.get(&prop.sym).cloned();
                    }
                }
            }
            None
        }
        Expr::Unary(u) => match u.op {
            op!(unary, "-") => {
                if let Some(TsLit::Number(n)) =
                    compute_const_expr(&u.arg, local_values, existing_values)
                {
                    Some(TsLit::Number(Number {
                        span: DUMMY_SP,
                        value: -n.value,
                        raw: None,
                    }))
                } else {
                    None
                }
            }
            op!(unary, "+") => compute_const_expr(&u.arg, local_values, existing_values),
            op!("~") => {
                if let Some(TsLit::Number(n)) =
                    compute_const_expr(&u.arg, local_values, existing_values)
                {
                    Some(TsLit::Number(Number {
                        span: DUMMY_SP,
                        value: (!(n.value as i64)) as f64,
                        raw: None,
                    }))
                } else {
                    None
                }
            }
            _ => None,
        },
        Expr::Bin(b) => {
            let left = compute_const_expr(&b.left, local_values, existing_values)?;
            let right = compute_const_expr(&b.right, local_values, existing_values)?;

            match (&left, &right) {
                (TsLit::Number(l), TsLit::Number(r)) => {
                    let result = match b.op {
                        op!(bin, "+") => l.value + r.value,
                        op!(bin, "-") => l.value - r.value,
                        op!("*") => l.value * r.value,
                        op!("/") => l.value / r.value,
                        op!("%") => l.value % r.value,
                        op!("**") => l.value.powf(r.value),
                        op!("|") => ((l.value as i64) | (r.value as i64)) as f64,
                        op!("&") => ((l.value as i64) & (r.value as i64)) as f64,
                        op!("^") => ((l.value as i64) ^ (r.value as i64)) as f64,
                        op!("<<") => ((l.value as i64) << (r.value as i64)) as f64,
                        op!(">>") => ((l.value as i64) >> (r.value as i64)) as f64,
                        op!(">>>") => ((l.value as u64) >> (r.value as u64)) as f64,
                        _ => return None,
                    };
                    Some(TsLit::Number(Number {
                        span: DUMMY_SP,
                        value: result,
                        raw: None,
                    }))
                }
                (TsLit::Str(l), TsLit::Str(r)) if b.op == op!(bin, "+") => {
                    let mut result = l.value.to_string_lossy().to_string();
                    result.push_str(&r.value.to_string_lossy());
                    Some(TsLit::Str(Str {
                        span: DUMMY_SP,
                        value: result.into(),
                        raw: None,
                    }))
                }
                _ => None,
            }
        }
        Expr::Paren(p) => compute_const_expr(&p.expr, local_values, existing_values),
        Expr::Tpl(t) if t.exprs.is_empty() => {
            if let Some(quasi) = t.quasis.first() {
                Some(TsLit::Str(Str {
                    span: DUMMY_SP,
                    value: quasi.raw.clone().into(),
                    raw: None,
                }))
            } else {
                None
            }
        }
        _ => None,
    }
}

/// Transforms a TypeScript enum declaration inside a namespace.
///
/// Returns an IIFE statement that directly assigns to the namespace:
/// `(function(E) { E["A"] = 0; })(NS.E || (NS.E = {}));`
pub fn transform_namespace_enum(
    e: &TsEnumDecl,
    ns_id: &Ident,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Stmt {
    let enum_id = e.id.clone();

    // Create IIFE body (without return statement)
    let mut stmts = Vec::with_capacity(e.members.len());
    let mut current_value: Option<f64> = Some(0.0);
    let mut member_values: FxHashMap<Atom, TsLit> = FxHashMap::default();

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        };

        let (value_expr, computed_value) = if let Some(init) = &member.init {
            let computed = compute_const_expr(init, &member_values, existing_values);
            let expr = if let Some(val) = &computed {
                match val {
                    TsLit::Number(n) => {
                        current_value = Some(n.value);
                        Box::new(Expr::Lit(Lit::Num(n.clone())))
                    }
                    TsLit::Str(s) => {
                        current_value = None;
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span: s.span,
                            value: s.value.clone(),
                            raw: None,
                        })))
                    }
                    _ => {
                        current_value = None;
                        init.clone()
                    }
                }
            } else {
                current_value = None;
                init.clone()
            };
            (expr, computed)
        } else if let Some(val) = current_value {
            let num = Number {
                span: DUMMY_SP,
                value: val,
                raw: None,
            };
            (
                Box::new(Expr::Lit(Lit::Num(num.clone()))),
                Some(TsLit::Number(num)),
            )
        } else {
            let undefined_ident = Ident::new_no_ctxt("undefined".into(), DUMMY_SP);
            (Box::new(Expr::Ident(undefined_ident)), None)
        };

        if let Some(val) = &computed_value {
            member_values.insert(member_name.clone(), val.clone());
        }

        if let Some(val) = current_value {
            current_value = Some(val + 1.0);
        }

        let stmt = create_enum_member_stmt(&enum_id, &member_name, value_expr, &member.id);
        stmts.push(stmt);
    }

    // Create the IIFE with namespace member access
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(enum_id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts,
            ..Default::default()
        }),
        is_generator: false,
        is_async: false,
        ..Default::default()
    };

    let callee = Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(func),
        })),
    });

    // Create NS.E member expression
    let ns_member = MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(ns_id.clone())),
        prop: MemberProp::Ident(IdentName::new(enum_id.sym.clone(), DUMMY_SP)),
    };

    // Pattern: NS.E || (NS.E = {})
    let arg = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: op!("||"),
        left: Box::new(Expr::Member(ns_member.clone())),
        right: Box::new(Expr::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Member(ns_member)),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                })),
            })),
        })),
    });

    // Create call expression: (function(E) {...})(NS.E || (NS.E = {}))
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(Box::new(callee)),
        args: vec![arg.as_arg()],
        ..Default::default()
    })
    .into_stmt()
}

/// Transforms a TypeScript enum declaration that merges with an existing
/// declaration (e.g., namespace).
///
/// Returns an IIFE statement that uses the existing variable:
/// `(function(A) { ... })(A);`
pub fn transform_enum_merging(
    e: &TsEnumDecl,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Stmt {
    let enum_id = e.id.clone();

    // Create IIFE body (without return statement)
    let mut stmts = Vec::with_capacity(e.members.len());
    let mut current_value: Option<f64> = Some(0.0);
    let mut member_values: FxHashMap<Atom, TsLit> = FxHashMap::default();

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        };

        let (value_expr, computed_value) = if let Some(init) = &member.init {
            let computed = compute_const_expr(init, &member_values, existing_values);
            let expr = if let Some(val) = &computed {
                match val {
                    TsLit::Number(n) => {
                        current_value = Some(n.value);
                        Box::new(Expr::Lit(Lit::Num(n.clone())))
                    }
                    TsLit::Str(s) => {
                        current_value = None;
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span: s.span,
                            value: s.value.clone(),
                            raw: None,
                        })))
                    }
                    _ => {
                        current_value = None;
                        init.clone()
                    }
                }
            } else {
                current_value = None;
                init.clone()
            };
            (expr, computed)
        } else if let Some(val) = current_value {
            let num = Number {
                span: DUMMY_SP,
                value: val,
                raw: None,
            };
            (
                Box::new(Expr::Lit(Lit::Num(num.clone()))),
                Some(TsLit::Number(num)),
            )
        } else {
            let undefined_ident = Ident::new_no_ctxt("undefined".into(), DUMMY_SP);
            (Box::new(Expr::Ident(undefined_ident)), None)
        };

        if let Some(val) = &computed_value {
            member_values.insert(member_name.clone(), val.clone());
        }

        if let Some(val) = current_value {
            current_value = Some(val + 1.0);
        }

        let stmt = create_enum_member_stmt(&enum_id, &member_name, value_expr, &member.id);
        stmts.push(stmt);
    }

    // Create the IIFE with just the identifier as argument (merging pattern)
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(enum_id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts,
            ..Default::default()
        }),
        is_generator: false,
        is_async: false,
        ..Default::default()
    };

    let callee = Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(func),
        })),
    });

    // Use just the identifier for merging: (function(A) {...})(A);
    let arg = Expr::Ident(enum_id);

    // Create call expression
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(Box::new(callee)),
        args: vec![arg.as_arg()],
        ..Default::default()
    })
    .into_stmt()
}

/// Transforms a TypeScript enum that merges with an existing enum inside a
/// namespace.
///
/// Returns an IIFE statement that uses the existing namespace member:
/// `(function(E) { ... })(NS.E);`
pub fn transform_namespace_enum_merging(
    e: &TsEnumDecl,
    ns_id: &Ident,
    existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Stmt {
    let enum_id = e.id.clone();

    // Create IIFE body (without return statement)
    let mut stmts = Vec::with_capacity(e.members.len());
    let mut current_value: Option<f64> = Some(0.0);
    let mut member_values: FxHashMap<Atom, TsLit> = FxHashMap::default();

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        };

        let (value_expr, computed_value) = if let Some(init) = &member.init {
            let computed = compute_const_expr(init, &member_values, existing_values);
            let expr = if let Some(val) = &computed {
                match val {
                    TsLit::Number(n) => {
                        current_value = Some(n.value);
                        Box::new(Expr::Lit(Lit::Num(n.clone())))
                    }
                    TsLit::Str(s) => {
                        current_value = None;
                        Box::new(Expr::Lit(Lit::Str(Str {
                            span: s.span,
                            value: s.value.clone(),
                            raw: None,
                        })))
                    }
                    _ => {
                        current_value = None;
                        init.clone()
                    }
                }
            } else {
                current_value = None;
                init.clone()
            };
            (expr, computed)
        } else if let Some(val) = current_value {
            let num = Number {
                span: DUMMY_SP,
                value: val,
                raw: None,
            };
            (
                Box::new(Expr::Lit(Lit::Num(num.clone()))),
                Some(TsLit::Number(num)),
            )
        } else {
            let undefined_ident = Ident::new_no_ctxt("undefined".into(), DUMMY_SP);
            (Box::new(Expr::Ident(undefined_ident)), None)
        };

        if let Some(val) = &computed_value {
            member_values.insert(member_name.clone(), val.clone());
        }

        if let Some(val) = current_value {
            current_value = Some(val + 1.0);
        }

        let stmt = create_enum_member_stmt(&enum_id, &member_name, value_expr, &member.id);
        stmts.push(stmt);
    }

    // Create the IIFE
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(enum_id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts,
            ..Default::default()
        }),
        is_generator: false,
        is_async: false,
        ..Default::default()
    };

    let callee = Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(func),
        })),
    });

    // For merging, use just NS.E (the enum already exists)
    let arg = Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(ns_id.clone())),
        prop: MemberProp::Ident(IdentName::new(enum_id.sym.clone(), DUMMY_SP)),
    });

    // Create call expression: (function(E) {...})(NS.E);
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(Box::new(callee)),
        args: vec![arg.as_arg()],
        ..Default::default()
    })
    .into_stmt()
}

/// Collects enum member values for potential inlining.
pub fn collect_enum_values(e: &TsEnumDecl) -> Option<FxHashMap<Atom, TsLit>> {
    let mut values = FxHashMap::default();
    let mut current_value: Option<f64> = Some(0.0);
    let empty_existing = FxHashMap::default();

    for member in &e.members {
        let member_name: Atom = match &member.id {
            TsEnumMemberId::Ident(i) => i.sym.clone(),
            TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        };

        let value = if let Some(init) = &member.init {
            let computed = compute_const_expr(init, &values, &empty_existing)?;
            if let TsLit::Number(n) = &computed {
                current_value = Some(n.value);
            } else {
                current_value = None;
            }
            computed
        } else if let Some(val) = current_value {
            TsLit::Number(Number {
                span: DUMMY_SP,
                value: val,
                raw: None,
            })
        } else {
            return None;
        };

        values.insert(member_name, value);

        if let Some(val) = current_value {
            current_value = Some(val + 1.0);
        }
    }

    Some(values)
}
