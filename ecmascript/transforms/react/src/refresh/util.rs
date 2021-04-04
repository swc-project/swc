use indexmap::IndexSet;
use std::collections::HashSet;
use swc_atoms::JsWord;

use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;

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
            // no need to handle thest two as they aren't bindings
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
    match name.sym.as_ref() {
        "useState"
        | "useReducer"
        | "useEffect"
        | "useLayoutEffect"
        | "useMemo"
        | "useCallback"
        | "useRef"
        | "useContext"
        | "useImperativeHandle"
        | "useDebugValue" => true,
        _ => false,
    }
}

pub fn is_body_arrow_fn(body: &BlockStmtOrExpr) -> bool {
    if let BlockStmtOrExpr::Expr(body) = body {
        body.is_arrow()
    } else {
        false
    }
}

pub fn make_assign_stmt(handle: Ident, expr: Box<Expr>) -> Expr {
    Expr::Assign(AssignExpr {
        span: expr.span(),
        op: AssignOp::Assign,
        left: PatOrExpr::Pat(Box::new(Pat::Ident(BindingIdent::from(handle.clone())))),
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
        callee: ExprOrSuper::Expr(Box::new(Expr::Ident(handle))),
        args: Vec::new(),
        type_args: None,
    })
}

pub fn is_import_or_require(expr: &Expr) -> bool {
    if let Expr::Call(CallExpr {
        callee: ExprOrSuper::Expr(expr),
        ..
    }) = expr
    {
        if let Expr::Ident(ident) = expr.as_ref() {
            if ident.sym.contains("require") || ident.sym.contains("import") {
                return true;
            }
        }
    }
    false
}

pub fn callee_should_ignore<'a>(
    ignore: &'a HashSet<Ident>,
    callee: &ExprOrSuper,
) -> Option<ExprOrSuper> {
    let expr = if let ExprOrSuper::Expr(expr) = callee {
        Some(expr)
    } else {
        None
    }?;
    let ident = if let Expr::Ident(ident) = expr.as_ref() {
        Some(ident)
    } else {
        None
    }?;
    ignore
        .get(ident)
        .map(|ident| ExprOrSuper::Expr(Box::new(Expr::Ident(ident.clone()))))
}

pub fn gen_custom_hook_record(elems: Vec<Option<ExprOrSpread>>) -> Expr {
    Expr::Fn(FnExpr {
        ident: None,
        function: Function {
            is_generator: false,
            is_async: false,
            params: Vec::new(),
            decorators: Vec::new(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(Expr::Array(ArrayLit {
                        span: DUMMY_SP,
                        elems,
                    }))),
                })],
            }),
            type_params: None,
            return_type: None,
        },
    })
}
