use std::{collections::HashSet, mem};

use swc_atoms::JsWord;
use swc_common::{comments::Comments, sync::Lrc, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{private_ident, quote_ident, quote_str};
use swc_ecma_visit::{Fold, FoldWith};

#[cfg(test)]
mod tests;

struct Hoc {
    insert: bool,
    regs: Vec<(Ident, String)>,
}
enum Persist {
    Hoc(Hoc),
    Component(Ident),
    None,
}
fn get_persistent_id(ident: &Ident) -> Persist {
    if ident.as_ref().starts_with(|c: char| c.is_ascii_uppercase()) {
        Persist::Component(ident.clone())
    } else {
        Persist::None
    }
}

fn get_persistent_id_from_var_decl(
    var_decl: &mut VarDecl,
    cm: &SourceMap,
    used_in_jsx: &HashSet<JsWord>,
) -> Persist {
    // We only handle the case when a single variable is declared
    if let [VarDeclarator {
        name: Pat::Ident(binding),
        init: Some(init_expr),
        ..
    }] = var_decl.decls.as_mut_slice()
    {
        if used_in_jsx.contains(&binding.id.sym) {
            match init_expr.as_ref() {
                Expr::Arrow(_) | Expr::Fn(_) | Expr::TaggedTpl(_) | Expr::Call(_) => {
                    return Persist::Component(binding.id.clone())
                }
                _ => (),
            }
        }

        if let Persist::Component(persistent_id) = get_persistent_id(&binding.id) {
            return match init_expr.as_mut() {
                Expr::Fn(_) => Persist::Component(persistent_id),
                Expr::Arrow(ArrowExpr { body, .. }) => {
                    if is_body_arrow_fn(body) {
                        // Ignore complex function expressions like
                        // let Foo = () => () => {}
                        Persist::None
                    } else {
                        Persist::Component(persistent_id)
                    }
                }
                // Maybe a HOC.
                Expr::Call(call_expr) => {
                    // TODO: ignore import and require
                    if let Some(mut regs) = get_persistent_id_from_possible_hoc(
                        persistent_id.sym.to_string(),
                        call_expr,
                        cm,
                        Vec::new(),
                    ) {
                        regs.push((private_ident!("_c"), persistent_id.sym.to_string()));
                        Persist::Hoc(Hoc { insert: true, regs })
                    } else {
                        Persist::None
                    }
                }
                _ => Persist::None,
            };
        }
    }
    Persist::None
}

fn get_persistent_id_from_possible_hoc(
    reg: String,
    call_expr: &mut CallExpr,
    cm: &SourceMap,
    mut hoc: Vec<(Ident, String)>,
) -> Option<Vec<(Ident, String)>> {
    let first_arg = match call_expr.args.as_mut_slice() {
        [first, ..] => &mut first.expr,
        _ => return None,
    };
    let callee = if let ExprOrSuper::Expr(expr) = &call_expr.callee {
        expr
    } else {
        return None;
    };
    let hoc_name = match callee.as_ref() {
        Expr::Ident(fn_name) => fn_name.sym.to_string(),
        // original react implement use `getSource` so we just follow them
        Expr::Member(member) => cm.span_to_snippet(member.span).unwrap(),
        _ => return None,
    };
    let reg = reg + "$" + &hoc_name;
    match first_arg.as_mut() {
        Expr::Call(expr) => {
            if let Some(mut child) = get_persistent_id_from_possible_hoc(reg.clone(), expr, cm, hoc)
            {
                let reg_ident = private_ident!("_c");
                *first_arg = Box::new(make_assign_stmt(reg_ident.clone(), replace_expr(first_arg)));
                child.push((reg_ident, reg));
                Some(child)
            } else {
                None
            }
        }
        Expr::Fn(_) | Expr::Arrow(_) => {
            let reg_ident = private_ident!("_c");
            *first_arg = Box::new(make_assign_stmt(reg_ident.clone(), replace_expr(first_arg)));
            hoc.push((reg_ident, reg));
            Some(hoc)
        }
        Expr::Ident(ident) => {
            if let Persist::Component(_) = get_persistent_id(ident) {
                Some(hoc)
            } else {
                None
            }
        }
        _ => None,
    }
}

fn replace_expr(expr: &mut Box<Expr>) -> Box<Expr> {
    mem::replace(expr, Box::new(Expr::Invalid(Invalid { span: DUMMY_SP })))
}

fn is_builtin_hook(name: &str) -> bool {
    match name {
        "useState"
        | "React.useState"
        | "useReducer"
        | "React.useReducer"
        | "useEffect"
        | "React.useEffect"
        | "useLayoutEffect"
        | "React.useLayoutEffect"
        | "useMemo"
        | "React.useMemo"
        | "useCallback"
        | "React.useCallback"
        | "useRef"
        | "React.useRef"
        | "useContext"
        | "React.useContext"
        | "useImperativeHandle"
        | "React.useImperativeHandle"
        | "useDebugValue"
        | "React.useDebugValue" => true,
        _ => false,
    }
}

fn is_body_arrow_fn(body: &BlockStmtOrExpr) -> bool {
    if let BlockStmtOrExpr::Expr(body) = body {
        matches!(body.as_ref(), Expr::Arrow(_))
    } else {
        false
    }
}

fn make_assign_stmt(handle: Ident, expr: Box<Expr>) -> Expr {
    Expr::Assign(AssignExpr {
        span: DUMMY_SP,
        op: AssignOp::Assign,
        left: PatOrExpr::Pat(Box::new(Pat::Ident(BindingIdent::from(handle.clone())))),
        right: expr,
    })
}

fn make_register_stmt(handle: Ident, persistent_id: Ident) -> ModuleItem {
    ModuleItem::Stmt(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(make_assign_stmt(
            handle,
            Box::new(Expr::Ident(persistent_id)),
        )),
    }))
}

/// `react-refresh/babel`
/// https://github.com/facebook/react/blob/master/packages/react-refresh/src/ReactFreshBabelPlugin.js
pub fn refresh<C: Comments>(dev: bool, cm: Lrc<SourceMap>, comments: Option<C>) -> impl Fold {
    Refresh {
        dev,
        cm,
        comments,
        used_in_jsx: HashSet::new(),
        refresh_reg: "$RefreshReg$".to_string(),
        refresh_sig: "$RefreshSig$".to_string(),
    }
}

struct Refresh<C: Comments> {
    dev: bool,
    cm: Lrc<SourceMap>,
    used_in_jsx: HashSet<JsWord>,
    comments: Option<C>,
    refresh_reg: String,
    refresh_sig: String,
}

impl<C: Comments> Fold for Refresh<C> {
    fn fold_jsx_opening_element(&mut self, n: JSXOpeningElement) -> JSXOpeningElement {
        if let JSXElementName::Ident(ident) = &n.name {
            self.used_in_jsx.insert(ident.sym.clone());
        }
        n
    }

    fn fold_call_expr(&mut self, n: CallExpr) -> CallExpr {
        if let ExprOrSuper::Expr(expr) = &n.callee {
            let ident = match expr.as_ref() {
                Expr::Ident(ident) => ident,
                Expr::Member(MemberExpr { prop, .. }) => {
                    if let Expr::Ident(ident) = prop.as_ref() {
                        ident
                    } else {
                        return n;
                    }
                }
                _ => return n,
            };
            match ident.sym.as_ref() {
                "createElement" | "jsx" | "jsxDEV" | "jsxs" => {
                    let ExprOrSpread { expr, .. } = &n.args[0];
                    if let Expr::Ident(ident) = expr.as_ref() {
                        self.used_in_jsx.insert(ident.sym.clone());
                    }
                }
                _ => (),
            }
        }
        n
    }

    fn fold_module_items(&mut self, module_items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        if !self.dev {
            return module_items;
        }

        let module_items = module_items.fold_children_with(self);

        let mut items = Vec::new();
        let mut refresh_regs = Vec::<(Ident, String)>::new();

        for mut item in module_items {
            let persistent_id = match &mut item {
                // function Foo() {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl { ident, .. }))) => {
                    get_persistent_id(ident)
                }

                // export function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(FnDecl { ident, .. }),
                    ..
                })) => get_persistent_id(ident),

                // export default function Foo() {}
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            // We don't currently handle anonymous default exports.
                            ident: Some(ident),
                            ..
                        }),
                    ..
                })) => get_persistent_id(ident),

                // const Foo = () => {}
                // export const Foo = () => {}
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var_decl),
                    ..
                })) => get_persistent_id_from_var_decl(var_decl, &self.cm, &self.used_in_jsx),

                // This code path handles nested cases like:
                // export default memo(() => {})
                // In those cases it is more plausible people will omit names
                // so they're worth handling despite possible false positives.
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    expr,
                    span,
                })) => {
                    if let Expr::Call(call) = expr.as_mut() {
                        if let Some(mut regs) = get_persistent_id_from_possible_hoc(
                            "%default%".to_string(),
                            call,
                            &self.cm,
                            Vec::new(),
                        ) {
                            let handle = private_ident!("_c");
                            regs.push((handle.clone(), "%default%".to_string()));
                            item = ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                                ExportDefaultExpr {
                                    expr: Box::new(make_assign_stmt(handle, replace_expr(expr))),
                                    span: span.clone(),
                                },
                            ));
                            Persist::Hoc(Hoc {
                                insert: false,
                                regs,
                            })
                        } else {
                            Persist::None
                        }
                    } else {
                        Persist::None
                    }
                }

                _ => Persist::None,
            };

            items.push(item);
            match persistent_id {
                Persist::None => (),
                Persist::Component(persistent_id) => {
                    let registration_handle = private_ident!("_c");

                    refresh_regs.push((registration_handle.clone(), persistent_id.sym.to_string()));

                    items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(make_assign_stmt(
                            registration_handle,
                            Box::new(Expr::Ident(persistent_id)),
                        )),
                    })));
                }

                Persist::Hoc(mut hoc) => {
                    if hoc.insert {
                        let (ident, name) = hoc.regs.last().unwrap();
                        items.push(make_register_stmt(
                            ident.clone(),
                            quote_ident!(name.clone()),
                        ));
                    }
                    refresh_regs.append(&mut hoc.regs);
                }
            }
        }

        // Insert
        // ```
        // var _c, _c1;
        // ```
        if refresh_regs.len() > 0 {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: refresh_regs
                    .iter()
                    .map(|(handle, _)| VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent::from(handle.clone())),
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))));
        }

        // Insert
        // ```
        // $RefreshReg$(_c, "Hello");
        // $RefreshReg$(_c1, "Foo");
        // ```
        let refresh_reg: &str = self.refresh_reg.as_ref();
        for (handle, persistent_id) in refresh_regs {
            items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Expr(Box::new(Expr::Ident(quote_ident!(refresh_reg)))),
                    args: vec![
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(handle)),
                        },
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Lit(Lit::Str(quote_str!(persistent_id)))),
                        },
                    ],
                    type_args: None,
                })),
            })));
        }

        items
    }
}
