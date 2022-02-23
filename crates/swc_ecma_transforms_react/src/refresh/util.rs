use indexmap::IndexSet;
use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub trait CollectIdent {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>);
}

impl CollectIdent for Pat {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>) {
        match self {
            Pat::Ident(ident) => {
                collection.insert(ident.id.sym.clone());
            }
            Pat::Object(ObjectPat { props, .. }) => {
                for prop in props {
                    match prop {
                        ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) => {
                            value.collect_ident(collection)
                        }
                        ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                            collection.insert(key.sym.clone());
                        }
                        ObjectPatProp::Rest(RestPat { arg, .. }) => arg.collect_ident(collection),
                    }
                }
            }
            Pat::Array(ArrayPat { elems, .. }) => {
                for elem in elems.iter().filter_map(|x| x.as_ref()) {
                    elem.collect_ident(collection)
                }
            }
            Pat::Assign(AssignPat { left, .. }) => left.collect_ident(collection),
            Pat::Rest(RestPat { arg, .. }) => arg.collect_ident(collection),
            Pat::Invalid(_) | Pat::Expr(_) => (),
        }
    }
}

impl CollectIdent for Decl {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>) {
        match self {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                collection.insert(ident.sym.clone());
            }
            Decl::Var(var_decl) => {
                for VarDeclarator { name, .. } in &var_decl.decls {
                    name.collect_ident(collection);
                }
            }
            _ => (),
        }
    }
}

impl CollectIdent for Stmt {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>) {
        match self {
            Stmt::Decl(Decl::Class(ClassDecl { ident, .. }))
            | Stmt::Decl(Decl::Fn(FnDecl { ident, .. })) => {
                collection.insert(ident.sym.clone());
            }
            Stmt::Decl(Decl::Var(var_decl)) => {
                for VarDeclarator { name, .. } in &var_decl.decls {
                    name.collect_ident(collection);
                }
            }

            _ => {}
        }
    }
}

impl CollectIdent for ModuleItem {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>) {
        match self {
            ModuleItem::ModuleDecl(decl) => decl.collect_ident(collection),
            ModuleItem::Stmt(stmt) => stmt.collect_ident(collection),
        }
    }
}

impl CollectIdent for ModuleDecl {
    fn collect_ident(&self, collection: &mut IndexSet<JsWord>) {
        match self {
            ModuleDecl::Import(decl) => {
                for specifier in &decl.specifiers {
                    match specifier {
                        ImportSpecifier::Named(ImportNamedSpecifier { local, .. }) => {
                            collection.insert(local.sym.clone());
                        }
                        ImportSpecifier::Default(ImportDefaultSpecifier { local, .. }) => {
                            collection.insert(local.sym.clone());
                        }
                        ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                            collection.insert(local.sym.clone());
                        }
                    }
                }
            }
            ModuleDecl::ExportDecl(ExportDecl { decl, .. }) => decl.collect_ident(collection),
            // no need to handle these two as they aren't bindings
            ModuleDecl::ExportNamed(_) => (),
            ModuleDecl::ExportAll(_) => (),
            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl { decl, .. }) => match decl {
                DefaultDecl::Class(ClassExpr {
                    ident: Some(ident), ..
                }) => {
                    collection.insert(ident.sym.clone());
                }
                DefaultDecl::Fn(FnExpr {
                    ident: Some(ident), ..
                }) => {
                    collection.insert(ident.sym.clone());
                }
                _ => (),
            },
            ModuleDecl::ExportDefaultExpr(ExportDefaultExpr { expr, .. }) => match expr.as_ref() {
                Expr::Fn(FnExpr {
                    ident: Some(ident), ..
                }) => {
                    collection.insert(ident.sym.clone());
                }
                Expr::Class(ClassExpr {
                    ident: Some(ident), ..
                }) => {
                    collection.insert(ident.sym.clone());
                }
                _ => (),
            },
            _ => (),
        }
    }
}

pub fn is_builtin_hook(name: &Ident) -> bool {
    matches!(
        name.sym.as_ref(),
        "useState"
            | "useReducer"
            | "useEffect"
            | "useLayoutEffect"
            | "useMemo"
            | "useCallback"
            | "useRef"
            | "useContext"
            | "useImperativeHandle"
            | "useDebugValue"
    )
}

pub fn is_body_arrow_fn(body: &BlockStmtOrExpr) -> bool {
    if let BlockStmtOrExpr::Expr(body) = body {
        body.is_arrow()
    } else {
        false
    }
}

fn assert_hygiene(e: &Expr) {
    if !cfg!(debug_assertions) {
        return;
    }

    if let Expr::Ident(i) = e {
        if i.span.ctxt == SyntaxContext::empty() {
            panic!("`{}` should be resolved", i)
        }
    }
}

pub fn make_assign_stmt(handle: Ident, expr: Box<Expr>) -> Expr {
    assert_hygiene(&expr);

    Expr::Assign(AssignExpr {
        span: expr.span(),
        op: op!("="),
        left: PatOrExpr::Pat(handle.into()),
        right: expr,
    })
}

pub fn make_call_stmt(handle: Ident) -> Stmt {
    Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(make_call_expr(handle)),
    })
}

pub fn make_call_expr(handle: Ident) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: handle.as_callee(),
        args: Vec::new(),
        type_args: None,
    })
}

pub fn is_import_or_require(expr: &Expr) -> bool {
    match expr {
        Expr::Call(CallExpr {
            callee: Callee::Expr(expr),
            ..
        }) => {
            if let Expr::Ident(ident) = expr.as_ref() {
                ident.sym.contains("require")
            } else {
                false
            }
        }
        Expr::Call(CallExpr {
            callee: Callee::Import(_),
            ..
        }) => true,
        _ => false,
    }
}

pub struct UsedInJsx(AHashSet<JsWord>);

impl Visit for UsedInJsx {
    noop_visit_type!();

    fn visit_call_expr(&mut self, n: &CallExpr) {
        n.visit_children_with(self);

        if let Callee::Expr(expr) = &n.callee {
            let ident = match expr.as_ref() {
                Expr::Ident(ident) => ident,
                Expr::Member(MemberExpr {
                    prop: MemberProp::Ident(ident),
                    ..
                }) => ident,
                _ => return,
            };
            if matches!(
                ident.sym.as_ref(),
                "createElement" | "jsx" | "jsxDEV" | "jsxs"
            ) {
                if let Some(ExprOrSpread { expr, .. }) = n.args.get(0) {
                    if let Expr::Ident(ident) = expr.as_ref() {
                        self.0.insert(ident.sym.clone());
                    }
                }
            }
        }
    }

    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement) {
        if let JSXElementName::Ident(ident) = &n.name {
            self.0.insert(ident.sym.clone());
        }
    }
}

pub fn collect_ident_in_jsx<V: VisitWith<UsedInJsx>>(item: &V) -> AHashSet<JsWord> {
    let mut visitor = UsedInJsx(AHashSet::default());
    item.visit_with(&mut visitor);
    visitor.0
}
