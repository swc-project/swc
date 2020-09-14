use swc_common::{chain, DUMMY_SP};
use swc_ecma_ast::{
    AssignExpr, AssignOp, CallExpr, Decl, Expr, ExprOrSpread, ExprOrSuper, ExprStmt, FnDecl, Ident,
    Lit, ModuleItem, Pat, PatOrExpr, Stmt, Str, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_visit::Fold;

pub fn fast_refresh() -> impl Fold {
    FastRefresh {}
}

#[derive(Default)]
struct FastRefresh;

impl Fold for FastRefresh {
    fn fold_module_items(&mut self, module_items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut items = Vec::<ModuleItem>::new();
        let mut registration_handles = Vec::<Ident>::new();
        let mut refresh_regs = Vec::<CallExpr>::new();

        for item in module_items {
            let persistent_id: Option<Ident> = match &item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl { ident, .. }))) => Some(ident.clone()),
                _ => None,
            };

            items.push(item);

            if let Some(persistent_id) = persistent_id {
                let mut registration_handle = String::from("_c");
                let registration_index = registration_handles.len() + 1; // 1-based
                if registration_index > 1 {
                    registration_handle.push_str(&registration_index.to_string());
                };
                let registration_handle = private_ident!(registration_handle.as_str());

                registration_handles.push(registration_handle.clone());

                // $RefreshReg$(_c, "Hello");
                refresh_regs.push(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Expr(Box::new(Expr::Ident(quote_ident!("$RefreshReg$")))),
                    args: vec![
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(registration_handle.clone())),
                        },
                        ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: persistent_id.sym.clone(),
                                has_escape: false,
                            }))),
                        },
                    ],
                    type_args: None,
                });

                //
                items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(registration_handle))),
                        right: Box::new(Expr::Ident(persistent_id)),
                    })),
                })));
            }
        }

        // Insert
        // ```
        // var _c, _c2, _c3;
        // ```
        if registration_handles.len() > 0 {
            items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: registration_handles
                    .into_iter()
                    .map(|handle| VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(handle),
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))));
        }

        // Insert
        // ```
        // $RefreshReg$(_c, "Hello");
        // $RefreshReg$(_c2, "Foo");
        // $RefreshReg$(_c3, "Bar");
        // ```
        for refresh_reg in refresh_regs {
            items.push(ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(refresh_reg)),
            })));
        }

        items
    }

    fn fold_fn_decl(&mut self, fn_decl: FnDecl) -> FnDecl {
        let inferred_name = &fn_decl.ident.sym.to_string();
        dbg!(inferred_name);

        fn_decl
    }
}

// fn is_componentish_name(name: &str) -> bool {
//     name.starts_with(char::is_uppercase)
// }

#[cfg(test)]
mod tests {
    use super::{super::super::hygiene, *};

    fn tr() -> impl Fold {
        chain!(hygiene(), fast_refresh())
    }

    #[test]
    fn registers_top_level_function_declarations() {
        // Hello and Bar should be registered, handleClick shouldn't.
        test_transform!(
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            |_| tr(),
            // Input
            r#"
function Hello() {
  function handleClick() {}
  return <h1 onClick={handleClick}>Hi</h1>;
}
function Bar() {
  return <Hello />;
}
"#,
            // Output
            r#"
function Hello() {
  function handleClick() {}
  return <h1 onClick={handleClick}>Hi</h1>;
}
_c = Hello;
function Bar() {
  return <Hello />;
}
_c2 = Bar;
var _c, _c2;
$RefreshReg$(_c, "Hello");
$RefreshReg$(_c2, "Bar");
"#
        )
    }
}
