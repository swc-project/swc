//! TypeScript namespace transformation.
//!
//! Transforms TypeScript namespaces/modules into JavaScript IIFE patterns.

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{VisitMut, VisitMutWith, VisitWith};

use crate::enums::{
    collect_enum_values, transform_enum_block_scoped, transform_namespace_enum,
    transform_namespace_enum_merging,
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

    // Check if namespace is instantiated (has non-type exports).
    // Non-instantiated namespaces (only interfaces/type aliases) produce no output.
    if !is_namespace_instantiated(body) {
        return vec![];
    }

    // Collect exported identifiers (store full Ident to preserve syntax context for
    // hygiene)
    let mut exports: Vec<Ident> = vec![];
    let mut inner_stmts: Vec<Stmt> = vec![];
    let mut enum_values = enum_values.clone();
    // Track exported import equals for usage rewriting
    let mut exported_import_equals: FxHashMap<Id, Ident> = FxHashMap::default();
    // Track seen enum IDs for merging
    let mut seen_enum_ids: FxHashSet<Id> = FxHashSet::default();

    // Collect all exported IDs first for reference rewriting
    let exported_ids = collect_exported_ids(body);

    // Collect identifiers that are used as values in the namespace body.
    // This is needed to determine which import equals should be emitted.
    let value_usages = collect_value_usages_in_block(body);

    for item in &body.body {
        match item {
            ModuleItem::Stmt(stmt) => {
                process_stmt(
                    stmt.clone(),
                    &mut inner_stmts,
                    &mut exports,
                    &mut enum_values,
                    &mut seen_enum_ids,
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
                    &mut seen_enum_ids,
                    &exported_ids,
                    &value_usages,
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

    // Rewrite references to exported members in all statements
    // This handles standalone expression statements like `a = 1;` which should
    // become `ns.a = 1;`
    if !exported_ids.is_empty() {
        for stmt in &mut inner_stmts {
            rewrite_export_references_in_stmt(stmt, &exported_ids, &id);
        }
    }

    // Note: export assignments are emitted immediately after each exported item
    // in process_module_decl, not collected at the end.
    let _ = exports; // exports are already processed inline

    // Create IIFE (even if inner_stmts is empty - the namespace is still
    // instantiated)
    // Preserve original identifier span for source map accuracy
    let param = Param::from(Pat::from(BindingIdent::from(id.clone())));

    let func = Function {
        params: vec![param],
        decorators: vec![],
        span: DUMMY_SP,
        body: Some(BlockStmt {
            span: body.span,
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

    // Use original namespace span for sourcemap accuracy
    let iife_stmt = Stmt::Expr(ExprStmt {
        span: ns.span,
        expr: Box::new(call),
    });

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
    // Preserve original identifier span for source map accuracy
    let param = Param::from(Pat::from(BindingIdent::from(outer_id.clone())));

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
/// Returns None if the namespace is not instantiated (only contains type
/// declarations and no value declarations).
fn transform_child_namespace(
    parent_id: &Ident,
    child_id: &Ident,
    body: &TsNamespaceBody,
    enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
) -> Option<Stmt> {
    // Check if the namespace is instantiated (has value declarations).
    // We need to check this separately because a namespace might have value
    // declarations without initializers (e.g., `export var Point: number;`)
    // which don't produce statements but still require the namespace to exist.
    let is_instantiated = match body {
        TsNamespaceBody::TsModuleBlock(block) => is_namespace_instantiated(block),
        TsNamespaceBody::TsNamespaceDecl(nested) => match &*nested.body {
            TsNamespaceBody::TsModuleBlock(block) => is_namespace_instantiated(block),
            TsNamespaceBody::TsNamespaceDecl(_) => {
                // For deeply nested namespaces, assume instantiated if we get here
                // (will be recursively checked)
                true
            }
        },
    };

    // Handle nested namespace body
    let inner_stmts = match body {
        TsNamespaceBody::TsModuleBlock(block) => {
            let mut stmts = Vec::new();
            let mut exports = Vec::new();
            let mut local_enum_values = enum_values.clone();
            let mut seen_enum_ids: FxHashSet<Id> = FxHashSet::default();

            // Collect exported IDs for reference rewriting
            let exported_ids = collect_exported_ids(block);

            // Collect identifiers that are used as values in the namespace body.
            // This is needed to determine which import equals should be emitted.
            let value_usages = collect_value_usages_in_block(block);

            for item in &block.body {
                match item {
                    ModuleItem::Stmt(stmt) => {
                        process_stmt(
                            stmt.clone(),
                            &mut stmts,
                            &mut exports,
                            &mut local_enum_values,
                            &mut seen_enum_ids,
                        );
                    }
                    ModuleItem::ModuleDecl(decl) => {
                        process_module_decl(
                            decl.clone(),
                            child_id,
                            &mut stmts,
                            &mut exports,
                            &mut local_enum_values,
                            &mut seen_enum_ids,
                            &exported_ids,
                            &value_usages,
                        );
                    }
                }
            }

            // Rewrite references to exported members in all statements
            if !exported_ids.is_empty() {
                for stmt in &mut stmts {
                    rewrite_export_references_in_stmt(stmt, &exported_ids, child_id);
                }
            }

            // Rewrite references to the child namespace name (child_id) to use
            // parent_id.child_id. This is needed when a class/function/etc is
            // merged with a namespace of the same name. Inside the namespace IIFE,
            // the parameter shadows the outer declaration, so we need to access
            // the outer one through the parent namespace.
            for stmt in &mut stmts {
                rewrite_self_references_in_stmt(stmt, child_id, parent_id);
            }

            stmts
        }
        TsNamespaceBody::TsNamespaceDecl(nested) => {
            // Further nesting: A.B.C
            match transform_child_namespace(child_id, &nested.id, &nested.body, enum_values) {
                Some(stmt) => vec![stmt],
                None => vec![],
            }
        }
    };

    // If the namespace is not instantiated (only type declarations), skip it
    if !is_instantiated {
        return None;
    }

    // Create inner IIFE
    // Preserve original identifier span for source map accuracy
    let param = Param::from(Pat::from(BindingIdent::from(child_id.clone())));

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
    seen_enum_ids: &mut FxHashSet<Id>,
) {
    match stmt {
        Stmt::Decl(decl) => match decl {
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
            Decl::TsEnum(e) => {
                // Skip declare enum (ambient)
                if e.declare {
                    return;
                }
                let enum_id = e.id.to_id();
                if seen_enum_ids.contains(&enum_id) {
                    // Merging: emit just the IIFE statement
                    let stmt = crate::enums::transform_enum_merging(&e, enum_values);
                    if let Some(values) = collect_enum_values(&e) {
                        enum_values.insert(e.id.to_id(), values);
                    }
                    out.push(stmt);
                } else {
                    // First declaration: use let and ({})
                    seen_enum_ids.insert(enum_id);
                    let (var, _) = transform_enum_block_scoped(&e, enum_values);
                    if let Some(values) = collect_enum_values(&e) {
                        enum_values.insert(e.id.to_id(), values);
                    }
                    out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                }
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
            Decl::Fn(f) => {
                // Skip declare function (ambient)
                if f.declare {
                    return;
                }
                out.push(Stmt::Decl(Decl::Fn(f)));
            }
            Decl::Class(c) => {
                // Skip declare class (ambient)
                if c.declare {
                    return;
                }
                out.push(Stmt::Decl(Decl::Class(c)));
            }
            Decl::Var(v) => {
                // Skip declare var (ambient)
                if v.declare {
                    return;
                }
                out.push(Stmt::Decl(Decl::Var(v)));
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
    _exports: &mut Vec<Ident>,
    enum_values: &mut FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    seen_enum_ids: &mut FxHashSet<Id>,
    exported_ids: &FxHashSet<Id>,
    value_usages: &FxHashSet<Id>,
) {
    match decl {
        ModuleDecl::ExportDecl(export) => {
            let export_span = export.span;
            match export.decl {
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
                Decl::Class(c) => {
                    // Skip declare class (ambient)
                    if c.declare {
                        return;
                    }
                    let ident = c.ident.clone();
                    // Rewrite references to exported members in class body
                    let mut class_decl = c;
                    rewrite_export_references_in_class(&mut class_decl.class, exported_ids, ns_id);
                    out.push(Stmt::Decl(Decl::Class(class_decl)));
                    // Emit export assignment immediately after declaration
                    emit_export_assignment(ns_id, &ident, export_span, out);
                }
                Decl::Fn(f) => {
                    // Skip declare function (ambient)
                    if f.declare {
                        return;
                    }
                    let ident = f.ident.clone();
                    // Rewrite references to exported members in function body
                    let mut fn_decl = f;
                    rewrite_export_references_in_fn(&mut fn_decl.function, exported_ids, ns_id);
                    out.push(Stmt::Decl(Decl::Fn(fn_decl)));
                    // Emit export assignment immediately after declaration
                    emit_export_assignment(ns_id, &ident, export_span, out);
                }
                Decl::Var(v) => {
                    // Skip declare var (ambient)
                    if v.declare {
                        return;
                    }
                    // For exported variable declarations, transform to namespace
                    // assignments following main branch logic: collect all
                    // assignments and emit as single/seq expr statement
                    let mut exprs: Vec<Box<Expr>> = Vec::new();
                    for decl in &v.decls {
                        if let Some(init) = &decl.init {
                            let left = transform_pat_to_assign_target_with_span(&decl.name, ns_id);
                            // Rewrite references to other exported members in the init expr
                            let mut init_expr = init.clone();
                            rewrite_export_references(&mut init_expr, exported_ids, ns_id);
                            exprs.push(Box::new(Expr::Assign(AssignExpr {
                                span: decl.span,
                                op: op!("="),
                                left,
                                right: init_expr,
                            })));
                        }
                    }
                    if !exprs.is_empty() {
                        let expr = if exprs.len() == 1 {
                            exprs.pop().unwrap()
                        } else {
                            Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs,
                            }))
                        };
                        out.push(Stmt::Expr(ExprStmt { span: v.span, expr }));
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
                        emit_export_assignment(ns_id, ident, export_span, out);
                    }
                }
                Decl::TsEnum(e) => {
                    // Skip declare enum (ambient)
                    if e.declare {
                        return;
                    }
                    let enum_id = e.id.to_id();
                    let stmt = if seen_enum_ids.contains(&enum_id) {
                        // Merging: use NS.E instead of NS.E || (NS.E = {})
                        transform_namespace_enum_merging(&e, ns_id, enum_values)
                    } else {
                        // First declaration: use NS.E || (NS.E = {})
                        seen_enum_ids.insert(enum_id.clone());
                        transform_namespace_enum(&e, ns_id, enum_values)
                    };
                    if let Some(values) = collect_enum_values(&e) {
                        enum_values.insert(e.id.to_id(), values);
                    }
                    out.push(stmt);
                    // No separate export assignment needed - it's built into
                    // the IIFE
                }
                Decl::TsModule(ns_decl) => {
                    let body = match &ns_decl.body {
                        Some(b) => b,
                        None => return, // Ambient declaration
                    };
                    if ns_decl.declare {
                        return;
                    }
                    // Use namespace pattern: (function(Child){...})(Parent.Child ||
                    // (Parent.Child = {}))
                    if let TsModuleName::Ident(child_id) = &ns_decl.id {
                        if let Some(stmt) =
                            transform_child_namespace(ns_id, child_id, body, enum_values)
                        {
                            out.push(stmt);
                        }
                    }
                }
            }
        }
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
                                obj: Box::new(Expr::Ident(Ident::from(ns_id.to_id()))),
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
            // Only emit import equals if:
            // 1. It's exported (export import a = A;), OR
            // 2. It's used as a value in the namespace body
            let is_value_used = import.is_export || value_usages.contains(&import.id.to_id());
            if !is_value_used {
                return;
            }
            match &import.module_ref {
                TsModuleRef::TsEntityName(entity) => {
                    let expr = ts_entity_to_expr(entity.clone());
                    if import.is_export {
                        // export import a = A; -> NS.a = A;
                        let member = MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(Ident::from(ns_id.to_id()))),
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

/// Collects identifiers that are used as values (not just types) in a namespace
/// block. This is used to determine which import equals should be emitted.
fn collect_value_usages_in_block(block: &TsModuleBlock) -> FxHashSet<Id> {
    use swc_ecma_visit::Visit;

    struct ValueUsageCollector {
        usages: FxHashSet<Id>,
    }

    impl Visit for ValueUsageCollector {
        // Skip all TypeScript type-only constructs
        fn visit_ts_type(&mut self, _: &TsType) {}

        fn visit_ts_type_ann(&mut self, _: &TsTypeAnn) {}

        fn visit_ts_type_param_decl(&mut self, _: &TsTypeParamDecl) {}

        fn visit_ts_type_param_instantiation(&mut self, _: &TsTypeParamInstantiation) {}

        fn visit_ts_interface_decl(&mut self, _: &TsInterfaceDecl) {}

        fn visit_ts_type_alias_decl(&mut self, _: &TsTypeAliasDecl) {}

        fn visit_ts_expr_with_type_args(&mut self, _: &TsExprWithTypeArgs) {}

        // Skip patterns - they are declarations, not value usages
        fn visit_pat(&mut self, _: &Pat) {}

        // Skip import declarations - we don't want to mark the import id as used
        fn visit_import_decl(&mut self, _: &ImportDecl) {}

        fn visit_ts_import_equals_decl(&mut self, _: &TsImportEqualsDecl) {}

        // Handle expressions - this is where value usages occur
        fn visit_expr(&mut self, n: &Expr) {
            match n {
                Expr::Ident(i) => {
                    self.usages.insert(i.to_id());
                }
                Expr::Member(m) => {
                    // Only the object is a value usage
                    m.obj.visit_with(self);
                    if let MemberProp::Computed(c) = &m.prop {
                        c.expr.visit_with(self);
                    }
                }
                _ => {
                    n.visit_children_with(self);
                }
            }
        }
    }

    let mut collector = ValueUsageCollector {
        usages: FxHashSet::default(),
    };

    for item in &block.body {
        item.visit_with(&mut collector);
    }

    collector.usages
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
                        obj: Box::new(Expr::Ident(Ident::from(ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
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

/// Checks if a namespace is "instantiated" (has non-type exports).
/// A namespace is instantiated if it has any exports other than interfaces
/// and type aliases. This includes `export declare` items which declare
/// runtime values even though they don't provide implementations.
pub fn is_namespace_instantiated(block: &TsModuleBlock) -> bool {
    for item in &block.body {
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => {
                match &export.decl {
                    // Type-only declarations - not instantiated
                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
                    // Nested modules - only instantiated if they contain instantiated content
                    Decl::TsModule(ns) => {
                        if !ns.declare {
                            match &ns.body {
                                Some(TsNamespaceBody::TsModuleBlock(block)) => {
                                    if is_namespace_instantiated(block) {
                                        return true;
                                    }
                                }
                                Some(TsNamespaceBody::TsNamespaceDecl(nested)) => {
                                    // Recursively check nested namespace declarations
                                    if is_nested_namespace_instantiated(nested) {
                                        return true;
                                    }
                                }
                                None => {} // Ambient, skip
                            }
                        }
                    }
                    // All other declarations (including declare) make namespace instantiated
                    _ => return true,
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                // Named exports (except type-only) make namespace instantiated
                if !export.type_only {
                    for spec in &export.specifiers {
                        if let ExportSpecifier::Named(named) = spec {
                            if !named.is_type_only {
                                return true;
                            }
                        }
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => {
                // Only exported import equals make namespace instantiated.
                // Non-exported import equals are just aliases and don't by themselves
                // create any namespace content.
                if !import.is_type_only && import.is_export {
                    return true;
                }
            }
            ModuleItem::Stmt(Stmt::Decl(decl)) => {
                // Non-exported declarations still make namespace instantiated
                match decl {
                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
                    Decl::TsModule(ns) => {
                        // Only if the nested namespace is instantiated
                        if !ns.declare {
                            if let Some(TsNamespaceBody::TsModuleBlock(block)) = &ns.body {
                                if is_namespace_instantiated(block) {
                                    return true;
                                }
                            }
                        }
                    }
                    _ => return true,
                }
            }
            ModuleItem::Stmt(_) => {
                // Non-declaration statements (like console.log) make namespace instantiated
                return true;
            }
            _ => {}
        }
    }
    false
}

/// Checks if a nested namespace declaration (e.g., `Y.Z`) contains instantiated
/// content.
fn is_nested_namespace_instantiated(nested: &TsNamespaceDecl) -> bool {
    match &*nested.body {
        TsNamespaceBody::TsModuleBlock(block) => is_namespace_instantiated(block),
        TsNamespaceBody::TsNamespaceDecl(further_nested) => {
            is_nested_namespace_instantiated(further_nested)
        }
    }
}

/// Collects exported identifiers from a namespace block.
/// Returns IDs that should be rewritten as namespace member access.
/// Function and class declarations create local bindings (NOT rewritten),
/// while var declarations (including declare) create direct namespace
/// assignments (rewritten).
///
/// Important: excludes IDs that also have non-export `var` declarations, as
/// those create local bindings that shadow the exported namespace property.
fn collect_exported_ids(block: &TsModuleBlock) -> FxHashSet<Id> {
    let mut exported_ids = FxHashSet::default();

    for item in &block.body {
        if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) = item {
            match &export.decl {
                // Var declarations go directly to namespace object, need rewriting
                // This includes `declare let/const/var` which create ambient bindings
                Decl::Var(v) => {
                    for decl in &v.decls {
                        collect_binding_ids(&decl.name, &mut exported_ids);
                    }
                }
                // Function declarations create local bindings, don't rewrite
                // (they're exported separately with: Test.abc = abc;)
                Decl::Fn(_) => {}
                // Class declarations create local bindings, don't rewrite
                Decl::Class(_) => {}
                // Enums create local bindings, don't rewrite
                Decl::TsEnum(_) => {}
                // Nested namespaces create local bindings, don't rewrite
                Decl::TsModule(_) => {}
                _ => {}
            }
        }
    }

    // Collect local var declarations that shadow exported vars
    // When there's a non-export `var` declaration, it creates a local binding that
    // shadows the namespace property, so we shouldn't rewrite those references
    let local_vars = collect_local_var_ids(block);
    for id in local_vars {
        exported_ids.remove(&id);
    }

    exported_ids
}

/// Collects IDs from non-export `var` declarations in a namespace block.
/// These create local bindings that shadow exported namespace properties.
fn collect_local_var_ids(block: &TsModuleBlock) -> FxHashSet<Id> {
    use swc_ecma_visit::Visit;

    struct VarCollector {
        ids: FxHashSet<Id>,
    }

    impl Visit for VarCollector {
        fn visit_var_decl(&mut self, v: &VarDecl) {
            // Only collect from var (not let/const) since var has function scope
            if v.kind == VarDeclKind::Var {
                for decl in &v.decls {
                    collect_pat_ids(&decl.name, &mut self.ids);
                }
            }
            // Don't recurse into nested functions/classes which have their own
            // scope
        }

        fn visit_function(&mut self, _: &Function) {
            // Don't descend into functions - they have their own scope
        }

        fn visit_class(&mut self, _: &Class) {
            // Don't descend into classes - they have their own scope
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Don't descend into arrows - they have their own scope
        }
    }

    fn collect_pat_ids(pat: &Pat, ids: &mut FxHashSet<Id>) {
        match pat {
            Pat::Ident(i) => {
                ids.insert(i.to_id());
            }
            Pat::Array(a) => {
                for elem in a.elems.iter().flatten() {
                    collect_pat_ids(elem, ids);
                }
            }
            Pat::Object(o) => {
                for prop in &o.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            collect_pat_ids(&kv.value, ids);
                        }
                        ObjectPatProp::Assign(a) => {
                            ids.insert(a.key.to_id());
                        }
                        ObjectPatProp::Rest(r) => {
                            collect_pat_ids(&r.arg, ids);
                        }
                    }
                }
            }
            Pat::Rest(r) => {
                collect_pat_ids(&r.arg, ids);
            }
            Pat::Assign(a) => {
                collect_pat_ids(&a.left, ids);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    let mut collector = VarCollector {
        ids: FxHashSet::default(),
    };

    // Visit all statements in the namespace body
    for item in &block.body {
        match item {
            ModuleItem::Stmt(stmt) => {
                use swc_ecma_visit::VisitWith;
                stmt.visit_with(&mut collector);
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(_)) => {
                // Skip export declarations - we only want non-export vars
            }
            _ => {}
        }
    }

    collector.ids
}

/// Collects binding IDs from a pattern.
fn collect_binding_ids(pat: &Pat, ids: &mut FxHashSet<Id>) {
    match pat {
        Pat::Ident(i) => {
            ids.insert(i.to_id());
        }
        Pat::Array(a) => {
            for elem in a.elems.iter().flatten() {
                collect_binding_ids(elem, ids);
            }
        }
        Pat::Object(o) => {
            for prop in &o.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => {
                        collect_binding_ids(&kv.value, ids);
                    }
                    ObjectPatProp::Assign(a) => {
                        ids.insert(a.key.to_id());
                    }
                    ObjectPatProp::Rest(r) => {
                        collect_binding_ids(&r.arg, ids);
                    }
                }
            }
        }
        Pat::Rest(r) => {
            collect_binding_ids(&r.arg, ids);
        }
        Pat::Assign(a) => {
            collect_binding_ids(&a.left, ids);
        }
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

/// Rewrites references to exported members in an expression.
fn rewrite_export_references(expr: &mut Expr, exported_ids: &FxHashSet<Id>, ns_id: &Ident) {
    struct Rewriter<'a> {
        exported_ids: &'a FxHashSet<Id>,
        ns_id: &'a Ident,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            if let Expr::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_jsx_element_name(&mut self, n: &mut JSXElementName) {
            n.visit_mut_children_with(self);

            // Rewrite JSX element names like <Shared/> to <FooNs.Shared/>
            if let JSXElementName::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    });
                }
            }
        }

        fn visit_mut_jsx_object(&mut self, n: &mut JSXObject) {
            n.visit_mut_children_with(self);

            // Rewrite JSX object identifiers like <Context.Provider/> to
            // <Ns.Context.Provider/>
            if let JSXObject::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXObject::JSXMemberExpr(Box::new(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    }));
                }
            }
        }
    }

    let mut rewriter = Rewriter {
        exported_ids,
        ns_id,
    };
    expr.visit_mut_with(&mut rewriter);
}

/// Rewrites references to exported members in a function body.
fn rewrite_export_references_in_fn(
    func: &mut Function,
    exported_ids: &FxHashSet<Id>,
    ns_id: &Ident,
) {
    struct Rewriter<'a> {
        exported_ids: &'a FxHashSet<Id>,
        ns_id: &'a Ident,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            if let Expr::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_simple_assign_target(&mut self, n: &mut SimpleAssignTarget) {
            n.visit_mut_children_with(self);

            // Rewrite assignment targets like `a = 1` to `ns.a = 1`
            if let SimpleAssignTarget::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_jsx_element_name(&mut self, n: &mut JSXElementName) {
            n.visit_mut_children_with(self);

            // Rewrite JSX element names like <Shared/> to <FooNs.Shared/>
            if let JSXElementName::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    });
                }
            }
        }

        fn visit_mut_jsx_object(&mut self, n: &mut JSXObject) {
            n.visit_mut_children_with(self);

            // Rewrite JSX object identifiers like <Context.Provider/> to
            // <Ns.Context.Provider/>
            if let JSXObject::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXObject::JSXMemberExpr(Box::new(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    }));
                }
            }
        }
    }

    let mut rewriter = Rewriter {
        exported_ids,
        ns_id,
    };
    func.visit_mut_with(&mut rewriter);
}

/// Rewrites references to exported members in a class body.
fn rewrite_export_references_in_class(
    class: &mut Class,
    exported_ids: &FxHashSet<Id>,
    ns_id: &Ident,
) {
    struct Rewriter<'a> {
        exported_ids: &'a FxHashSet<Id>,
        ns_id: &'a Ident,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            if let Expr::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_simple_assign_target(&mut self, n: &mut SimpleAssignTarget) {
            n.visit_mut_children_with(self);

            // Rewrite assignment targets like `a = 1` to `ns.a = 1`
            if let SimpleAssignTarget::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_jsx_element_name(&mut self, n: &mut JSXElementName) {
            n.visit_mut_children_with(self);

            // Rewrite JSX element names like <Shared/> to <FooNs.Shared/>
            if let JSXElementName::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    });
                }
            }
        }

        fn visit_mut_jsx_object(&mut self, n: &mut JSXObject) {
            n.visit_mut_children_with(self);

            // Rewrite JSX object identifiers like <Context.Provider/> to
            // <Ns.Context.Provider/>
            if let JSXObject::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXObject::JSXMemberExpr(Box::new(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    }));
                }
            }
        }
    }

    let mut rewriter = Rewriter {
        exported_ids,
        ns_id,
    };
    class.visit_mut_with(&mut rewriter);
}

/// Rewrites references to exported members in a statement.
fn rewrite_export_references_in_stmt(stmt: &mut Stmt, exported_ids: &FxHashSet<Id>, ns_id: &Ident) {
    struct Rewriter<'a> {
        exported_ids: &'a FxHashSet<Id>,
        ns_id: &'a Ident,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            if let Expr::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_simple_assign_target(&mut self, n: &mut SimpleAssignTarget) {
            n.visit_mut_children_with(self);

            // Rewrite assignment targets like `a = 1` to `ns.a = 1`
            if let SimpleAssignTarget::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    // Replace `a` with `NS.a`
                    *n = SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(Ident::from(self.ns_id.to_id()))),
                        prop: MemberProp::Ident(id.clone().into()),
                    });
                }
            }
        }

        fn visit_mut_jsx_element_name(&mut self, n: &mut JSXElementName) {
            n.visit_mut_children_with(self);

            // Rewrite JSX element names like <Shared/> to <FooNs.Shared/>
            if let JSXElementName::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    });
                }
            }
        }

        fn visit_mut_jsx_object(&mut self, n: &mut JSXObject) {
            n.visit_mut_children_with(self);

            // Rewrite JSX object identifiers like <Context.Provider/> to
            // <Ns.Context.Provider/>
            if let JSXObject::Ident(id) = n {
                if self.exported_ids.contains(&id.to_id()) {
                    *n = JSXObject::JSXMemberExpr(Box::new(JSXMemberExpr {
                        span: DUMMY_SP,
                        obj: JSXObject::Ident(self.ns_id.clone()),
                        prop: IdentName::new(id.sym.clone(), DUMMY_SP),
                    }));
                }
            }
        }
    }

    let mut rewriter = Rewriter {
        exported_ids,
        ns_id,
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

/// Emits an export assignment statement: ns.name = name;
fn emit_export_assignment(ns_id: &Ident, export_ident: &Ident, span: Span, out: &mut Vec<Stmt>) {
    // Use Ident::from(id.to_id()) to get DUMMY_SP span, avoiding extra source map
    // entries But preserve the export_ident span for the property for source
    // map accuracy
    let assign = Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: op!("="),
        left: MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident::from(ns_id.to_id()))),
            prop: MemberProp::Ident(export_ident.clone().into()),
        }
        .into(),
        right: Box::new(Expr::Ident(export_ident.clone())),
    });
    out.push(Stmt::Expr(ExprStmt {
        span,
        expr: Box::new(assign),
    }));
}

/// Transforms a pattern into an assignment target, replacing identifiers with
/// namespace member access. Uses DUMMY_SP for the MemberExpr span but preserves
/// the original identifier span in the prop for proper source map generation.
fn transform_pat_to_assign_target_with_span(pat: &Pat, ns_id: &Ident) -> AssignTarget {
    // Create namespace identifier with DUMMY_SP to avoid extra source map entries
    let ns_ident = Ident::from(ns_id.to_id());
    match pat {
        Pat::Ident(i) => {
            // Transform `a` into `ns.a`, preserving original identifier span in prop
            AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(ns_ident)),
                prop: MemberProp::Ident(i.id.clone().into()),
            }))
        }
        Pat::Array(a) => {
            let elems: Vec<Option<Pat>> = a
                .elems
                .iter()
                .map(|elem| {
                    elem.as_ref()
                        .map(|p| transform_pat_preserving_default_with_span(p, ns_id))
                })
                .collect();
            AssignTarget::Pat(AssignTargetPat::Array(ArrayPat {
                span: a.span,
                elems,
                optional: false,
                type_ann: None,
            }))
        }
        Pat::Object(o) => {
            let props: Vec<ObjectPatProp> = o
                .props
                .iter()
                .map(|prop| match prop {
                    ObjectPatProp::KeyValue(kv) => ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: kv.key.clone(),
                        value: Box::new(assign_target_to_pat(
                            &transform_pat_to_assign_target_with_span(&kv.value, ns_id),
                        )),
                    }),
                    ObjectPatProp::Assign(a) => {
                        let member_expr = Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(Ident::from(ns_id.to_id()))),
                            prop: MemberProp::Ident(a.key.id.clone().into()),
                        });
                        let value_pat: Pat = if let Some(default_value) = &a.value {
                            Pat::Assign(AssignPat {
                                span: DUMMY_SP,
                                left: Box::new(Pat::Expr(Box::new(member_expr))),
                                right: default_value.clone(),
                            })
                        } else {
                            Pat::Expr(Box::new(member_expr))
                        };
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(a.key.id.clone().into()),
                            value: Box::new(value_pat),
                        })
                    }
                    ObjectPatProp::Rest(r) => ObjectPatProp::Rest(RestPat {
                        span: r.span,
                        dot3_token: r.dot3_token,
                        arg: Box::new(assign_target_to_pat(
                            &transform_pat_to_assign_target_with_span(&r.arg, ns_id),
                        )),
                        type_ann: None,
                    }),
                })
                .collect();
            AssignTarget::Pat(AssignTargetPat::Object(ObjectPat {
                span: o.span,
                props,
                optional: false,
                type_ann: None,
            }))
        }
        Pat::Rest(r) => transform_pat_to_assign_target_with_span(&r.arg, ns_id),
        Pat::Assign(a) => transform_pat_to_assign_target_with_span(&a.left, ns_id),
        Pat::Expr(e) => AssignTarget::Simple(SimpleAssignTarget::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: e.clone(),
        })),
        Pat::Invalid(i) => AssignTarget::Simple(SimpleAssignTarget::Invalid(i.clone())),
    }
}

/// Transforms a pattern while preserving default values and original spans.
fn transform_pat_preserving_default_with_span(pat: &Pat, ns_id: &Ident) -> Pat {
    match pat {
        Pat::Assign(a) => {
            let left_transformed = transform_pat_preserving_default_with_span(&a.left, ns_id);
            Pat::Assign(AssignPat {
                span: a.span,
                left: Box::new(left_transformed),
                right: a.right.clone(),
            })
        }
        _ => assign_target_to_pat(&transform_pat_to_assign_target_with_span(pat, ns_id)),
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

/// Rewrites references to the namespace name (self_id) to use
/// parent_id.self_id. This is needed when a class/function/etc is merged with a
/// namespace of the same name. Inside the namespace IIFE, the parameter shadows
/// the outer declaration, so we need to access the outer one through the parent
/// namespace.
fn rewrite_self_references_in_stmt(stmt: &mut Stmt, self_id: &Ident, parent_id: &Ident) {
    struct Rewriter<'a> {
        self_id: &'a Ident,
        parent_id: &'a Ident,
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
            // If the object is the self_id, don't transform it
            // This is accessing a member through the IIFE parameter (e.g., Point.Origin)
            if let Expr::Ident(obj) = &*n.obj {
                if obj.sym == self.self_id.sym && obj.ctxt == self.self_id.ctxt {
                    // Only visit the property, not the object
                    n.prop.visit_mut_with(self);
                    return;
                }
            }
            n.visit_mut_children_with(self);
        }

        fn visit_mut_expr(&mut self, n: &mut Expr) {
            n.visit_mut_children_with(self);

            // Rewrite standalone identifier usages to member access
            // Only rewrite if syntax context matches (same binding)
            if let Expr::Ident(id) = n {
                if id.sym == self.self_id.sym && id.ctxt == self.self_id.ctxt {
                    // Replace `SelfId` with `Parent.SelfId`
                    *n = Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Expr::Ident(self.parent_id.clone())),
                        prop: MemberProp::Ident(IdentName::new(id.sym.clone(), DUMMY_SP)),
                    });
                }
            }
        }

        fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
            // For namespace IIFEs, only visit the callee (which will skip the
            // function body) but skip the args (which contain parent namespace
            // references that should not be transformed)
            if is_namespace_iife(n) {
                n.callee.visit_mut_with(self);
                return;
            }
            n.visit_mut_children_with(self);
        }

        // Don't recurse into nested functions (including child namespace IIFEs)
        // because they have their own scope where the identifier might be bound
        // to a different value (e.g., the IIFE parameter)
        fn visit_mut_function(&mut self, _n: &mut Function) {}

        fn visit_mut_arrow_expr(&mut self, _n: &mut ArrowExpr) {}
    }

    let mut rewriter = Rewriter { self_id, parent_id };
    stmt.visit_mut_with(&mut rewriter);
}

/// Checks if a call expression is a namespace IIFE pattern:
/// `(function(X) { ... })(X || (X = {}))`
fn is_namespace_iife(call: &CallExpr) -> bool {
    if let Callee::Expr(callee) = &call.callee {
        if let Expr::Paren(p) = &**callee {
            if matches!(&*p.expr, Expr::Fn(_)) {
                return true;
            }
        }
    }
    false
}
