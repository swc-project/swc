use std::mem::take;

use crate::ast::MdxFile;
use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{member_expr, private_ident, quote_ident, ExprFactory};

#[derive(Debug, Default)]
pub struct ContentProcessor {
    used_components: AHashSet<JsWord>,
}

impl ContentProcessor {
    pub(crate) fn make_create_mdx_content(&mut self, props: Ident, f: MdxFile) -> Function {
        let components = private_ident!("_components");

        let mut stmts = vec![];

        stmts.push(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: Default::default(),
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(components.clone().into()),
                init: Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: member_expr!(DUMMY_SP, Object.assign).as_callee(),
                    args: vec![
                        ObjectLit {
                            span: DUMMY_SP,
                            props: take(&mut self.used_components)
                                .into_iter()
                                .map(|sym| KeyValueProp {
                                    key: PropName::Ident(quote_ident!(sym.clone())),
                                    value: Box::new(Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: sym,
                                        has_escape: false,
                                        kind: Default::default(),
                                    }))),
                                })
                                .map(Prop::KeyValue)
                                .map(Box::new)
                                .map(PropOrSpread::Prop)
                                .collect(),
                        }
                        .as_arg(),
                        props
                            .clone()
                            .make_member(quote_ident!("components"))
                            .as_arg(),
                    ],
                    type_args: Default::default(),
                }))),
                definite: Default::default(),
            }],
        })));

        Function {
            span: DUMMY_SP,
            params: Default::default(),
            decorators: Default::default(),
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts,
            }),
            is_generator: false,
            is_async: false,
            type_params: Default::default(),
            return_type: Default::default(),
        }
    }
}
