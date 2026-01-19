//! React Fast Refresh transform.
//!
//! This transform adds registration and signature tracking for React components
//! to enable Hot Module Replacement (HMR).
//!
//! For a component like:
//! ```js
//! function Foo() {
//!   return <div />;
//! }
//! ```
//!
//! It generates:
//! ```js
//! var _s = $RefreshSig$();
//! function Foo() {
//!   _s();
//!   return <div />;
//! }
//! _s(Foo, "hash");
//! _c = Foo;
//! var _c;
//! $RefreshReg$(_c, "Foo");
//! ```

use swc_atoms::Atom;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    sync::Lrc,
    Mark, SourceMap, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};

use crate::options::RefreshOptions;

/// Creates a React Fast Refresh transform hook.
pub fn hook<C: Comments>(
    dev: bool,
    options: Option<RefreshOptions>,
    _cm: Lrc<SourceMap>,
    _comments: Option<C>,
    _global_mark: Mark,
) -> impl VisitMutHook<()> {
    // Only enable refresh if dev=true AND options is Some
    let (enabled, options) = match options {
        Some(opts) => (dev, opts),
        None => (false, RefreshOptions::default()),
    };

    Refresh {
        enabled,
        refresh_reg: options.refresh_reg,
        #[allow(unused)]
        refresh_sig: options.refresh_sig,
        #[allow(unused)]
        emit_full_signatures: options.emit_full_signatures,
    }
}

struct Refresh {
    enabled: bool,
    refresh_reg: Atom,
    #[allow(dead_code)]
    refresh_sig: Atom,
    #[allow(dead_code)]
    emit_full_signatures: bool,
}

impl VisitMutHook<()> for Refresh {
    fn exit_module(&mut self, module: &mut Module, _ctx: &mut ()) {
        if !self.enabled {
            return;
        }

        // Build new body with assignments inserted after function declarations
        let mut new_body: Vec<ModuleItem> = Vec::with_capacity(module.body.len() * 2);
        let mut var_decls: Vec<Ident> = vec![];
        let mut reg_calls: Vec<(Ident, String)> = vec![];

        for item in module.body.drain(..) {
            // Check if this item is a function declaration that looks like a React
            // component
            let fn_ident = match &item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) => {
                    let name = &*fn_decl.ident.sym;
                    if is_component_name(name) {
                        Some(fn_decl.ident.clone())
                    } else {
                        None
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(fn_decl),
                    ..
                })) => {
                    let name = &*fn_decl.ident.sym;
                    if is_component_name(name) {
                        Some(fn_decl.ident.clone())
                    } else {
                        None
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl: DefaultDecl::Fn(fn_expr),
                    ..
                })) => fn_expr.ident.as_ref().and_then(|ident| {
                    let name = &*ident.sym;
                    if is_component_name(name) {
                        Some(ident.clone())
                    } else {
                        None
                    }
                }),
                _ => None,
            };

            new_body.push(item);

            // Insert assignment right after function declaration
            if let Some(ident) = fn_ident {
                let var_ident = private_ident!("_c");
                let name = ident.sym.to_string();

                // _c = ComponentName;
                new_body.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: var_ident.clone().into(),
                        right: Box::new(Expr::Ident(ident)),
                    })),
                })));

                var_decls.push(var_ident.clone());
                reg_calls.push((var_ident, name));
            }
        }

        if var_decls.is_empty() {
            module.body = new_body;
            return;
        }

        // Add var declarations and registration calls at the end
        for var_ident in var_decls {
            new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: Default::default(),
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.into()),
                    init: None,
                    definite: false,
                }],
            })))));
        }

        for (var_ident, name) in reg_calls {
            new_body.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                        self.refresh_reg.clone(),
                        DUMMY_SP,
                        Default::default(),
                    )))),
                    args: vec![
                        var_ident.as_arg(),
                        Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: name.into(),
                            raw: None,
                        }))
                        .as_arg(),
                    ],
                    ..Default::default()
                })),
            })));
        }

        module.body = new_body;
    }

    fn exit_script(&mut self, script: &mut Script, _ctx: &mut ()) {
        if !self.enabled {
            return;
        }

        // Build new body with assignments inserted after function declarations
        let mut new_body: Vec<Stmt> = Vec::with_capacity(script.body.len() * 2);
        let mut var_decls: Vec<Ident> = vec![];
        let mut reg_calls: Vec<(Ident, String)> = vec![];

        for item in script.body.drain(..) {
            // Check if this item is a function declaration that looks like a React
            // component
            let fn_ident = match &item {
                Stmt::Decl(Decl::Fn(fn_decl)) => {
                    let name = &*fn_decl.ident.sym;
                    if is_component_name(name) {
                        Some(fn_decl.ident.clone())
                    } else {
                        None
                    }
                }
                _ => None,
            };

            new_body.push(item);

            // Insert assignment right after function declaration
            if let Some(ident) = fn_ident {
                let var_ident = private_ident!("_c");
                let name = ident.sym.to_string();

                // _c = ComponentName;
                new_body.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: var_ident.clone().into(),
                        right: Box::new(Expr::Ident(ident)),
                    })),
                }));

                var_decls.push(var_ident.clone());
                reg_calls.push((var_ident, name));
            }
        }

        if var_decls.is_empty() {
            script.body = new_body;
            return;
        }

        // Add var declarations and registration calls at the end
        for var_ident in var_decls {
            new_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: Default::default(),
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.into()),
                    init: None,
                    definite: false,
                }],
            }))));
        }

        for (var_ident, name) in reg_calls {
            new_body.push(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                        self.refresh_reg.clone(),
                        DUMMY_SP,
                        Default::default(),
                    )))),
                    args: vec![
                        var_ident.as_arg(),
                        Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: name.into(),
                            raw: None,
                        }))
                        .as_arg(),
                    ],
                    ..Default::default()
                })),
            }));
        }

        script.body = new_body;
    }
}

/// Check if a name looks like a React component name.
/// Components start with an uppercase letter.
fn is_component_name(name: &str) -> bool {
    name.chars()
        .next()
        .map(|c| c.is_uppercase())
        .unwrap_or(false)
}
