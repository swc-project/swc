use std::sync::Arc;

use anyhow::{anyhow, Error};
use swc_common::{input::SourceFileInput, SourceFile, DUMMY_SP};
use swc_ecma_ast::{EsVersion, *};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};

pub(super) fn load_json_as_module(fm: &Arc<SourceFile>) -> Result<Module, Error> {
    let lexer = Lexer::new(
        Syntax::default(),
        EsVersion::Es2020,
        SourceFileInput::from(&**fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let expr = parser
        .parse_expr()
        .map_err(|err| anyhow!("failed parse json as javascript object: {:#?}", err))?;

    let export = ModuleItem::Stmt(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(Ident::new("module".into(), DUMMY_SP))),
                prop: MemberProp::Ident(Ident::new("exports".into(), DUMMY_SP)),
            }))),
            right: expr,
        })),
    }));

    Ok(Module {
        span: DUMMY_SP,
        body: vec![export],
        shebang: None,
    })
}
