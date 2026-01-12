//! TypeScript namespace transformation.
//!
//! Transforms TypeScript namespaces/modules into JavaScript IIFE patterns.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::enums::{
    collect_enum_values, transform_enum, transform_enum_block_scoped, transform_namespace_enum,
};

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
    // Track exported import equals for usage rewriting
    let mut exported_import_equals: FxHashMap<Id, Ident> = FxHashMap::default();

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
                // Check for exported import equals before processing
                if let ModuleDecl::TsImportEquals(import) = decl {
                    if import.is_export && !import.is_type_only {
                        if let TsModuleRef::TsEntityName(_) = &import.module_ref {
                            exported_import_equals.insert(import.id.to_id(), id.clone());
                        }
                    }
                }
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

    // Rewrite usages of exported import equals
    if !exported_import_equals.is_empty() {
        for stmt in &mut inner_stmts {
            rewrite_exported_import_usages(stmt, &exported_import_equals);
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

/// Transforms a nested namespace declaration (e.g., `namespace A.B { ... }`).
/// Creates: `(function(A) { (function(B) {...})(A.B || (A.B = {})); })(A || (A
/// = {}));`
fn transform_nested_namespace(
    outer_id: &Ident,
    nested: &TsNamespaceDecl,
    _is_export: bool,
    enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Vec<Stmt> {
    // First transform the inner namespace content using the outer namespace as
    // parent
    let inner_stmt =
        match transform_child_namespace(outer_id, &nested.id, &nested.body, enum_values) {
            Some(stmt) => stmt,
            None => return vec![], // Empty namespace, skip
        };

    // Create outer namespace IIFE
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(outer_id.clone().into()),
    };

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts: vec![inner_stmt],
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

    // Pattern: outer || (outer = {})
    let arg = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: op!("||"),
        left: Box::new(Expr::Ident(outer_id.clone())),
        right: Box::new(Expr::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(outer_id.clone().into())),
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

    vec![call.into_stmt()]
}

/// Transforms a child namespace inside a parent namespace.
/// Creates: `(function(Inner) {...})(Parent.Inner || (Parent.Inner = {}));`
/// Returns None if the namespace body is empty (only contains type
/// declarations).
fn transform_child_namespace(
    parent_id: &Ident,
    child_id: &Ident,
    body: &TsNamespaceBody,
    enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Option<Stmt> {
    // Handle nested namespace body
    let inner_stmts = match body {
        TsNamespaceBody::TsModuleBlock(block) => {
            let mut stmts = Vec::new();
            let mut exports = Vec::new();
            let mut local_enum_values = enum_values.clone();

            for item in &block.body {
                match item {
                    ModuleItem::Stmt(stmt) => {
                        process_stmt(
                            stmt.clone(),
                            &mut stmts,
                            &mut exports,
                            &mut local_enum_values,
                        );
                    }
                    ModuleItem::ModuleDecl(decl) => {
                        process_module_decl(
                            decl.clone(),
                            child_id,
                            &mut stmts,
                            &mut exports,
                            &mut local_enum_values,
                        );
                    }
                }
            }
            stmts
        }
        TsNamespaceBody::TsNamespaceDecl(nested) => {
            // Further nesting: A.B.C
            match transform_child_namespace(child_id, &nested.id, &nested.body, enum_values) {
                Some(stmt) => vec![stmt],
                None => return None,
            }
        }
    };

    // If the body is empty (only type declarations), skip this namespace
    if inner_stmts.is_empty() {
        return None;
    }

    // Create inner IIFE
    let param = Param {
        span: DUMMY_SP,
        decorators: vec![],
        pat: Pat::Ident(child_id.clone().into()),
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

    let callee = Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(func),
        })),
    });

    // Create Parent.Child member expression
    let parent_child = MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(parent_id.clone())),
        prop: MemberProp::Ident(IdentName::new(child_id.sym.clone(), DUMMY_SP)),
    };

    // Pattern: Parent.Child || (Parent.Child = {})
    let arg = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: op!("||"),
        left: Box::new(Expr::Member(parent_child.clone())),
        right: Box::new(Expr::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Member(parent_child)),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                })),
            })),
        })),
    });

    Some(
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(callee)),
            args: vec![arg.as_arg()],
            ..Default::default()
        })
        .into_stmt(),
    )
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
                // Non-exported enum inside namespace: use let and ({})
                let (var, _) = transform_enum_block_scoped(&e, enum_values);
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
                // Add var declaration for the nested namespace
                if let TsModuleName::Ident(id) = &ns.id {
                    out.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(id.clone().into()),
                            init: None,
                            definite: false,
                        }],
                        ..Default::default()
                    }))));
                }
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
                // Use namespace enum pattern: (function(E){...})(NS.E || (NS.E = {}))
                let stmt = transform_namespace_enum(&e, ns_id, enum_values);
                if let Some(values) = collect_enum_values(&e) {
                    enum_values.insert(e.id.to_id(), values);
                }
                out.push(stmt);
                // No separate export assignment needed - it's built into the
                // IIFE
            }
            Decl::TsModule(ns_decl) => {
                let body = match &ns_decl.body {
                    Some(b) => b,
                    None => return, // Ambient declaration
                };
                if ns_decl.declare {
                    return;
                }
                // Use namespace pattern: (function(Child){...})(Parent.Child || (Parent.Child =
                // {}))
                if let TsModuleName::Ident(child_id) = &ns_decl.id {
                    if let Some(stmt) =
                        transform_child_namespace(ns_id, child_id, body, enum_values)
                    {
                        out.push(stmt);
                    }
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
                    if import.is_export {
                        // export import a = A; -> NS.a = A;
                        let member = MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(ns_id.clone())),
                            prop: MemberProp::Ident(IdentName::new(
                                import.id.sym.clone(),
                                DUMMY_SP,
                            )),
                        };
                        let assign = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(member)),
                            right: expr,
                        });
                        out.push(assign.into_stmt());
                    } else {
                        // import b = A; -> const b = A;
                        let var = VarDecl {
                            span: import.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(import.id.clone().into()),
                                init: Some(expr),
                                definite: false,
                            }],
                            ..Default::default()
                        };
                        out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                    }
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

/// Rewrites usages of exported import equals to use namespace member access.
/// For `export import a = A;`, usages of `a` become `NS.a`.
fn rewrite_exported_import_usages(stmt: &mut Stmt, exported_import_equals: &FxHashMap<Id, Ident>) {
    struct Rewriter<'a> {
        exported_import_equals: &'a FxHashMap<Id, Ident>,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            if let Expr::Ident(id) = n {
                if let Some(ns_id) = self.exported_import_equals.get(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(ns_id.clone())),
                        prop: MemberProp::Ident(IdentName::new(id.sym.clone(), DUMMY_SP)),
                    });
                }
            }
        }
    }

    let mut rewriter = Rewriter {
        exported_import_equals,
    };
    stmt.visit_mut_with(&mut rewriter);
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
