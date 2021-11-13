use crate::{error::Error, parser::Parser, processing::ContentProcessor};
use swc_common::{input::Input, SourceFile, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::StringInput;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};

pub mod ast;
pub mod error;
pub mod parser;
pub mod processing;

/// TODO: Migrate logic to customizable processors.
pub fn compile<I>(input: I) -> Result<Module, Error>
where
    I: Input,
{
    let mut items = vec![];

    let mut parser = Parser::new(input);
    let res = parser.parse()?;

    let fn_name = private_ident!("MDXContent");

    let props = private_ident!("props");
    let props_param = Param {
        span: DUMMY_SP,
        decorators: Default::default(),
        pat: Pat::Assign(AssignPat {
            span: DUMMY_SP,
            left: Box::new(Pat::Ident(props.clone().into())),
            right: Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: Default::default(),
            })),
            type_ann: Default::default(),
        }),
    };

    let mdx_layout = private_ident!("MDXLayout");
    let crate_mdx_content = private_ident!("_createMdxContent");

    let mut fn_body = vec![];
    // const {wrapper: MDXLayout} = props.components || ({});

    fn_body.push(Stmt::Decl(Decl::Var(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Const,
        declare: Default::default(),
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Object(ObjectPat {
                span: DUMMY_SP,
                props: vec![ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident(quote_ident!("wrapper")),
                    value: Box::new(Pat::Ident(mdx_layout.clone().into())),
                })],
                optional: Default::default(),
                type_ann: Default::default(),
            }),
            init: Some(Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: op!("||"),
                left: Box::new(props.clone().make_member(quote_ident!("components"))),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: Default::default(),
                })),
            }))),
            definite: Default::default(),
        }],
    })));

    // return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> :
    // _createMdxContent();',
    fn_body.push(Stmt::Return(ReturnStmt {
        span: DUMMY_SP,
        arg: Some(Box::new(Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: Box::new(Expr::Ident(mdx_layout.clone())),
            cons: Box::new(Expr::JSXElement(Box::new(JSXElement {
                span: DUMMY_SP,
                opening: JSXOpeningElement {
                    name: JSXElementName::Ident(mdx_layout.clone()),
                    span: DUMMY_SP,
                    attrs: vec![JSXAttrOrSpread::SpreadElement(SpreadElement {
                        dot3_token: DUMMY_SP,
                        expr: Box::new(Expr::Ident(props.clone())),
                    })],
                    self_closing: false,
                    type_args: Default::default(),
                },
                children: vec![JSXElementChild::JSXElement(Box::new(JSXElement {
                    span: DUMMY_SP,
                    opening: JSXOpeningElement {
                        name: JSXElementName::Ident(crate_mdx_content.clone()),
                        span: DUMMY_SP,
                        attrs: Default::default(),
                        self_closing: true,
                        type_args: Default::default(),
                    },
                    children: Default::default(),
                    closing: None,
                }))],
                closing: Some(JSXClosingElement {
                    name: JSXElementName::Ident(mdx_layout.clone()),
                    span: DUMMY_SP,
                }),
            }))),
            alt: Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: crate_mdx_content.clone().as_callee(),
                args: Default::default(),
                type_args: Default::default(),
            })),
        }))),
    }));

    let mdx_content_span = res.span;

    {
        let components = private_ident!("_components");

        let mut processor = ContentProcessor {
            props: &props,
            components: &components,
            used_components: Default::default(),
        };

        fn_body.push(Stmt::Decl(Decl::Fn(FnDecl {
            ident: crate_mdx_content.clone(),
            declare: Default::default(),
            function: processor.make_create_mdx_content(res),
        })));
    }

    items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
        ident: fn_name.clone(),
        declare: false,
        function: Function {
            params: vec![props_param],
            decorators: Default::default(),
            span: mdx_content_span,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: fn_body,
            }),
            is_generator: false,
            is_async: false,
            type_params: Default::default(),
            return_type: Default::default(),
        },
    }))));

    items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
        ExportDefaultExpr {
            span: DUMMY_SP,
            expr: Box::new(Expr::Ident(fn_name)),
        },
    )));

    Ok(Module {
        span: Default::default(),
        body: items,
        shebang: Default::default(),
    })
}

pub fn compile_file(fm: &SourceFile) -> Result<Module, Error> {
    compile(StringInput::from(&*fm))
}
