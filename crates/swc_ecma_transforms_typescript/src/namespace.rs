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

    // Create export assignments at the end of the IIFE body
    for export_ident in &exports {
        let assign = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(id.clone())),
                prop: MemberProp::Ident(IdentName::new(export_ident.sym.clone(), DUMMY_SP)),
            }
            .into(),
            right: Box::new(Expr::Ident(export_ident.clone())),
        });
        inner_stmts.push(assign.into_stmt());
    }

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
                exports.push(c.ident.clone());
                out.push(Stmt::Decl(Decl::Class(c)));
            }
            Decl::Fn(f) => {
                exports.push(f.ident.clone());
                out.push(Stmt::Decl(Decl::Fn(f)));
            }
            Decl::Var(v) => {
                for decl in &v.decls {
                    collect_binding_idents(&decl.name, exports);
                }
                out.push(Stmt::Decl(Decl::Var(v)));
            }
            Decl::Using(u) => {
                for decl in &u.decls {
                    collect_binding_idents(&decl.name, exports);
                }
                out.push(Stmt::Decl(Decl::Using(u)));
            }
            Decl::TsEnum(e) => {
                exports.push(e.id.clone());
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
                if let TsModuleName::Ident(id) = &ns.id {
                    exports.push(id.clone());
                }
                let stmts = transform_namespace(&ns, true, enum_values);
                out.extend(stmts);
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
