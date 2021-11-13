use crate::{error::Error, parser::Parser};
use swc_common::{input::Input, SourceFile, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::StringInput;
use swc_ecma_utils::private_ident;

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

    let mut fn_body = vec![];

    items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
        ident: fn_name.clone(),
        declare: false,
        function: Function {
            params: vec![props_param],
            decorators: Default::default(),
            span: res.span,
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
