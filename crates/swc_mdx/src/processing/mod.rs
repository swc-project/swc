use std::mem::take;

use crate::ast::{BlockNode, MdxFile, TextNode};
use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{member_expr, private_ident, quote_ident, ExprFactory};

#[derive(Debug)]
pub struct ContentProcessor<'a> {
    pub(crate) props: &'a Ident,
    pub(crate) components: &'a Ident,
    pub(crate) used_components: AHashSet<JsWord>,
}

impl ContentProcessor<'_> {
    pub(crate) fn make_create_mdx_content(&mut self, f: MdxFile) -> Function {
        let mut stmts = vec![];

        stmts.push(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: Default::default(),
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(self.components.clone().into()),
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
                        self.props
                            .clone()
                            .make_member(quote_ident!("components"))
                            .as_arg(),
                    ],
                    type_args: Default::default(),
                }))),
                definite: Default::default(),
            }],
        })));

        {
            let mut content = f
                .content
                .into_iter()
                .map(|node| self.process_block_node(node))
                .collect();

            stmts.push(Stmt::Return(ReturnStmt {
                span: DUMMY_SP,
                arg: Some(to_jsx(content)),
            }));
        }

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

    fn process_block_node(&mut self, node: BlockNode) -> Box<Expr> {
        match node {
            BlockNode::Es(_) => {
                unreachable!("`BlockNode::Es(_)` should be removed before calling processor")
            }
            BlockNode::Text(nodes) => self.process_text_nodes(nodes),
            _ => {
                todo!("process_block_node")
            }
        }
    }

    fn process_text_nodes(&mut self, nodes: Vec<TextNode>) -> Box<Expr> {}
}

fn to_jsx(exprs: Vec<Box<Expr>>) -> Box<Expr> {
    if exprs.len() == 1 {
        exprs.into_iter().next().unwrap()
    } else {
        Box::new(Expr::JSXFragment(JSXFragment {
            span: DUMMY_SP,
            opening: JSXOpeningFragment { span: DUMMY_SP },
            children: exprs.into_iter().map(expr_to_jsx_child).collect(),
            closing: JSXClosingFragment { span: DUMMY_SP },
        }))
    }
}

fn expr_to_jsx_child(expr: Box<Expr>) -> JSXElementChild {
    match *expr {
        Expr::JSXElement(jsx) => JSXElementChild::JSXElement(jsx),
        Expr::JSXFragment(jsx) => JSXElementChild::JSXFragment(jsx),
        _ => JSXElementChild::JSXExprContainer(JSXExprContainer {
            span: DUMMY_SP,
            expr: JSXExpr::Expr(expr),
        }),
    }
}
