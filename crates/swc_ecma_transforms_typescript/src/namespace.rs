//! TypeScript namespace transformation.
//!
//! Transforms TypeScript namespaces/modules into JavaScript IIFE patterns.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

use crate::enums::{collect_enum_values, transform_enum};

/// Transforms a TypeScript namespace declaration into JavaScript.
pub fn transform_namespace(
    ns: &TsModuleDecl,
    is_export: bool,
    enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Vec<Stmt> {
    let id = match &ns.id {
        TsModuleName::Ident(i) => i.clone(),
        TsModuleName::Str(_) => return vec![], // Ambient module declaration
    };

    let body = match &ns.body {
        Some(TsNamespaceBody::TsModuleBlock(block)) => block,
        Some(TsNamespaceBody::TsNamespaceDecl(nested)) => {
            // Handle nested namespace: namespace A.B { ... }
            // Transform to: namespace A { namespace B { ... } }
            return transform_nested_namespace(&id, nested, is_export, enum_values);
        }
        None => return vec![], // Ambient declaration
    };

    // Collect exported identifiers (store full Ident to preserve syntax context for
    // hygiene)
    let mut exports: Vec<Ident> = vec![];
    let mut inner_stmts: Vec<Stmt> = vec![];
    let mut enum_values = enum_values.clone();

    for item in &body.body {
        match item {
            ModuleItem::Stmt(stmt) => {
                process_stmt(
                    stmt.clone(),
                    &mut inner_stmts,
                    &mut exports,
                    &mut enum_values,
                );
            }
            ModuleItem::ModuleDecl(decl) => {
                process_module_decl(
                    decl.clone(),
                    &id,
                    &mut inner_stmts,
                    &mut exports,
                    &mut enum_values,
                );
            }
        }
    }

    // Note: export assignments are emitted immediately after each exported item
    // in process_module_decl, not collected at the end.
    let _ = exports; // exports are already processed inline

    // Create IIFE
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts: inner_stmts,
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

    // Pattern: ns || (ns = {})
    let arg = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: op!("||"),
        left: Box::new(Expr::Ident(id.clone())),
        right: Box::new(Expr::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(id.clone().into())),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                })),
            })),
        })),
    });

    let call = Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(Box::new(callee)),
        args: vec![arg.as_arg()],
        ..Default::default()
    });

    let iife_stmt = call.into_stmt();

    // Just return the IIFE statement
    // Variable declaration is handled by the caller if needed
    vec![iife_stmt]
}

/// Transforms a nested namespace declaration.
fn transform_nested_namespace(
    outer_id: &Ident,
    nested: &TsNamespaceDecl,
    is_export: bool,
    enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Vec<Stmt> {
    // Create inner namespace
    let inner_ns = TsModuleDecl {
        span: nested.span,
        declare: nested.declare,
        global: false,
        namespace: true,
        id: TsModuleName::Ident(nested.id.clone()),
        body: Some((*nested.body).clone()),
    };

    let inner_stmts = transform_namespace(&inner_ns, true, enum_values);

    // Create outer namespace body with inner namespace
    let body_stmts: Vec<ModuleItem> = inner_stmts.into_iter().map(ModuleItem::Stmt).collect();

    let outer_ns = TsModuleDecl {
        span: DUMMY_SP,
        declare: false,
        global: false,
        namespace: true,
        id: TsModuleName::Ident(outer_id.clone()),
        body: Some(TsNamespaceBody::TsModuleBlock(TsModuleBlock {
            span: DUMMY_SP,
            body: body_stmts,
        })),
    };

    transform_namespace(&outer_ns, is_export, enum_values)
}

/// Processes a statement in namespace body.
fn process_stmt(
    stmt: Stmt,
    out: &mut Vec<Stmt>,
    _exports: &mut Vec<Ident>,
    enum_values: &mut FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) {
    match stmt {
        Stmt::Decl(decl) => match decl {
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
            Decl::TsEnum(e) => {
                let (var, _) = transform_enum(&e, false, enum_values);
                if let Some(values) = collect_enum_values(&e) {
                    enum_values.insert(e.id.to_id(), values);
                }
                out.push(Stmt::Decl(Decl::Var(Box::new(var))));
            }
            Decl::TsModule(ns) => {
                if ns.declare || ns.body.is_none() {
                    return;
                }
                let stmts = transform_namespace(&ns, false, enum_values);
                out.extend(stmts);
            }
            decl => {
                out.push(Stmt::Decl(decl));
            }
        },
        stmt => {
            out.push(stmt);
        }
    }
}

/// Processes a module declaration in namespace body.
fn process_module_decl(
    decl: ModuleDecl,
    ns_id: &Ident,
    out: &mut Vec<Stmt>,
    exports: &mut Vec<Ident>,
    enum_values: &mut FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) {
    match decl {
        ModuleDecl::ExportDecl(export) => match export.decl {
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
            Decl::Class(c) => {
                let ident = c.ident.clone();
                out.push(Stmt::Decl(Decl::Class(c)));
                // Emit export assignment immediately after declaration
                emit_export_assignment(ns_id, &ident, out);
            }
            Decl::Fn(f) => {
                let ident = f.ident.clone();
                out.push(Stmt::Decl(Decl::Fn(f)));
                // Emit export assignment immediately after declaration
                emit_export_assignment(ns_id, &ident, out);
            }
            Decl::Var(v) => {
                // For exported variable declarations:
                // - Simple binding: export const a = 1; -> ns.a = 1;
                // - Destructuring: export const [a, b] = x; -> [ns.a, ns.b] = x;
                for decl in &v.decls {
                    let left = transform_pat_to_assign_target(&decl.name, ns_id);
                    if let Some(init) = &decl.init {
                        let assign = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left,
                            right: init.clone(),
                        });
                        out.push(assign.into_stmt());
                    }
                }
            }
            Decl::Using(u) => {
                let mut idents = Vec::new();
                for decl in &u.decls {
                    collect_binding_idents(&decl.name, &mut idents);
                }
                out.push(Stmt::Decl(Decl::Using(u)));
                // Emit export assignments immediately
                for ident in &idents {
                    emit_export_assignment(ns_id, ident, out);
                }
            }
            Decl::TsEnum(e) => {
                let ident = e.id.clone();
                let (var, _) = transform_enum(&e, false, enum_values);
                if let Some(values) = collect_enum_values(&e) {
                    enum_values.insert(e.id.to_id(), values);
                }
                out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                // Emit export assignment immediately
                emit_export_assignment(ns_id, &ident, out);
            }
            Decl::TsModule(ns) => {
                if ns.declare || ns.body.is_none() {
                    return;
                }
                let stmts = transform_namespace(&ns, true, enum_values);
                out.extend(stmts);
                // Emit export assignment immediately
                if let TsModuleName::Ident(id) = &ns.id {
                    emit_export_assignment(ns_id, id, out);
                }
            }
        },
        ModuleDecl::ExportNamed(export) => {
            if export.src.is_some() || export.type_only {
                return;
            }
            for spec in &export.specifiers {
                if let ExportSpecifier::Named(named) = spec {
                    if named.is_type_only {
                        continue;
                    }
                    if let ModuleExportName::Ident(orig) = &named.orig {
                        let exported_name: Atom = match &named.exported {
                            Some(ModuleExportName::Ident(e)) => e.sym.clone(),
                            Some(ModuleExportName::Str(s)) => s.value.to_atom_lossy().into_owned(),
                            None => orig.sym.clone(),
                        };
                        // Create assignment: ns.exported = orig
                        let assign = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(ns_id.clone())),
                                prop: MemberProp::Ident(IdentName::new(exported_name, DUMMY_SP)),
                            }
                            .into(),
                            right: Box::new(Expr::Ident(orig.clone())),
                        });
                        out.push(assign.into_stmt());
                    }
                }
            }
        }
        ModuleDecl::Import(import) => {
            if import.type_only {
                return;
            }
            // Transform to variable declarations
            // import { foo } from "./bar" -> const { foo } = bar
            // This is a simplified version; full support would need module
            // resolution
        }
        ModuleDecl::TsImportEquals(import) => {
            if import.is_type_only {
                return;
            }
            match &import.module_ref {
                TsModuleRef::TsEntityName(entity) => {
                    let expr = ts_entity_to_expr(entity.clone());
                    let var = VarDecl {
                        span: import.span,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(import.id.clone().into()),
                            init: Some(expr),
                            definite: false,
                        }],
                        ..Default::default()
                    };
                    if import.is_export {
                        exports.push(import.id.clone());
                    }
                    out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                }
                TsModuleRef::TsExternalModuleRef(_) => {
                    // External module references are not supported in
                    // namespaces
                }
            }
        }
        _ => {}
    }
}

/// Collects binding identifiers from a pattern.
fn collect_binding_idents(pat: &Pat, out: &mut Vec<Ident>) {
    match pat {
        Pat::Ident(i) => {
            out.push(i.id.clone());
        }
        Pat::Array(a) => {
            for elem in a.elems.iter().flatten() {
                collect_binding_idents(elem, out);
            }
        }
        Pat::Object(o) => {
            for prop in &o.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => {
                        collect_binding_idents(&kv.value, out);
                    }
                    ObjectPatProp::Assign(a) => {
                        out.push(a.key.id.clone());
                    }
                    ObjectPatProp::Rest(r) => {
                        collect_binding_idents(&r.arg, out);
                    }
                }
            }
        }
        Pat::Rest(r) => {
            collect_binding_idents(&r.arg, out);
        }
        Pat::Assign(a) => {
            collect_binding_idents(&a.left, out);
        }
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

/// Converts a TsEntityName to an expression.
fn ts_entity_to_expr(entity: TsEntityName) -> Box<Expr> {
    match entity {
        TsEntityName::Ident(i) => Box::new(Expr::Ident(i)),
        TsEntityName::TsQualifiedName(q) => Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: ts_entity_to_expr(q.left),
            prop: MemberProp::Ident(q.right),
        })),
    }
}

/// Checks if a pattern is a simple identifier binding.
fn is_simple_ident_binding(pat: &Pat) -> bool {
    matches!(pat, Pat::Ident(_))
}

/// Emits an export assignment statement: ns.name = name;
fn emit_export_assignment(ns_id: &Ident, export_ident: &Ident, out: &mut Vec<Stmt>) {
    let assign = Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left: MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(ns_id.clone())),
            prop: MemberProp::Ident(IdentName::new(export_ident.sym.clone(), DUMMY_SP)),
        }
        .into(),
        right: Box::new(Expr::Ident(export_ident.clone())),
    });
    out.push(assign.into_stmt());
}

/// Transforms a pattern into an assignment target, replacing identifiers with
/// namespace member access.
fn transform_pat_to_assign_target(pat: &Pat, ns_id: &Ident) -> AssignTarget {
    match pat {
        Pat::Ident(i) => {
            // Transform `a` into `ns.a`
            AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(ns_id.clone())),
                prop: MemberProp::Ident(IdentName::new(i.sym.clone(), DUMMY_SP)),
            }))
        }
        Pat::Array(a) => {
            // Transform `[a, b]` into `[ns.a, ns.b]`
            let elems: Vec<Option<Pat>> = a
                .elems
                .iter()
                .map(|elem| {
                    elem.as_ref()
                        .map(|p| assign_target_to_pat(&transform_pat_to_assign_target(p, ns_id)))
                })
                .collect();
            AssignTarget::Pat(AssignTargetPat::Array(ArrayPat {
                span: DUMMY_SP,
                elems,
                optional: false,
                type_ann: None,
            }))
        }
        Pat::Object(o) => {
            // Transform `{a, b}` into `{a: ns.a, b: ns.b}`
            let props: Vec<ObjectPatProp> = o
                .props
                .iter()
                .map(|prop| match prop {
                    ObjectPatProp::KeyValue(kv) => ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: kv.key.clone(),
                        value: Box::new(assign_target_to_pat(&transform_pat_to_assign_target(
                            &kv.value, ns_id,
                        ))),
                    }),
                    ObjectPatProp::Assign(a) => {
                        // Transform shorthand `{ a }` into `{ a: ns.a }`
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(IdentName::new(a.key.sym.clone(), DUMMY_SP)),
                            value: Box::new(Pat::Expr(Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(ns_id.clone())),
                                prop: MemberProp::Ident(IdentName::new(
                                    a.key.sym.clone(),
                                    DUMMY_SP,
                                )),
                            })))),
                        })
                    }
                    ObjectPatProp::Rest(r) => ObjectPatProp::Rest(RestPat {
                        span: DUMMY_SP,
                        dot3_token: DUMMY_SP,
                        arg: Box::new(assign_target_to_pat(&transform_pat_to_assign_target(
                            &r.arg, ns_id,
                        ))),
                        type_ann: None,
                    }),
                })
                .collect();
            AssignTarget::Pat(AssignTargetPat::Object(ObjectPat {
                span: DUMMY_SP,
                props,
                optional: false,
                type_ann: None,
            }))
        }
        Pat::Rest(r) => transform_pat_to_assign_target(&r.arg, ns_id),
        Pat::Assign(a) => {
            // Default values - just transform the left side
            transform_pat_to_assign_target(&a.left, ns_id)
        }
        Pat::Expr(e) => AssignTarget::Simple(SimpleAssignTarget::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: e.clone(),
        })),
        Pat::Invalid(_) => {
            AssignTarget::Simple(SimpleAssignTarget::Invalid(Invalid { span: DUMMY_SP }))
        }
    }
}

/// Converts an AssignTarget back to a Pat for use in ArrayPat.
fn assign_target_to_pat(target: &AssignTarget) -> Pat {
    match target {
        AssignTarget::Simple(s) => match s {
            SimpleAssignTarget::Ident(i) => Pat::Ident(i.clone()),
            SimpleAssignTarget::Member(m) => Pat::Expr(Box::new(Expr::Member(m.clone()))),
            SimpleAssignTarget::SuperProp(s) => Pat::Expr(Box::new(Expr::SuperProp(s.clone()))),
            SimpleAssignTarget::Paren(p) => Pat::Expr(p.expr.clone()),
            SimpleAssignTarget::OptChain(o) => Pat::Expr(Box::new(Expr::OptChain(o.clone()))),
            SimpleAssignTarget::TsAs(t) => Pat::Expr(Box::new(Expr::TsAs(t.clone()))),
            SimpleAssignTarget::TsSatisfies(t) => Pat::Expr(Box::new(Expr::TsSatisfies(t.clone()))),
            SimpleAssignTarget::TsNonNull(t) => Pat::Expr(Box::new(Expr::TsNonNull(t.clone()))),
            SimpleAssignTarget::TsTypeAssertion(t) => {
                Pat::Expr(Box::new(Expr::TsTypeAssertion(t.clone())))
            }
            SimpleAssignTarget::TsInstantiation(t) => {
                Pat::Expr(Box::new(Expr::TsInstantiation(t.clone())))
            }
            SimpleAssignTarget::Invalid(i) => Pat::Invalid(i.clone()),
        },
        AssignTarget::Pat(p) => match p {
            AssignTargetPat::Array(a) => Pat::Array(a.clone()),
            AssignTargetPat::Object(o) => Pat::Object(o.clone()),
            AssignTargetPat::Invalid(i) => Pat::Invalid(i.clone()),
        },
    }
}

/// Converts AssignTargetPat to Pat.
fn assign_target_pat_to_pat(target: AssignTargetPat) -> Pat {
    match target {
        AssignTargetPat::Array(a) => Pat::Array(a),
        AssignTargetPat::Object(o) => Pat::Object(o),
        AssignTargetPat::Invalid(i) => Pat::Invalid(i),
    }
}
