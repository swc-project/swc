use std::sync::Arc;

use anyhow::{anyhow, Error};
use swc_atoms::atom;
use swc_common::{BytePos, SourceFile, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, SourceType};

pub(super) fn load_json_as_module(fm: &Arc<SourceFile>) -> Result<Module, Error> {
    let wrapped = format!("({})", fm.src);
    let result = Parser::new(&wrapped, SourceType::script())
        .with_start_pos(BytePos(fm.start_pos.0.saturating_sub(1)))
        .parse();
    if let Some(error) = result.diagnostics.first() {
        return Err(anyhow!(
            "failed parse json as javascript object: {error:#?}"
        ));
    }
    let Program::Script(mut script) = result.program else {
        unreachable!("script source type must produce a script")
    };
    let Some(Stmt::Expr(statement)) = script.body.pop() else {
        return Err(anyhow!("failed parse json as javascript object"));
    };
    let Expr::Paren(parenthesized) = *statement.expr else {
        unreachable!("wrapped JSON expression must remain parenthesized")
    };
    let expr = parenthesized.expr;

    let export = ExprStmt {
        span: DUMMY_SP,
        expr: AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Ident::new_no_ctxt(atom!("module"), DUMMY_SP).into()),
                prop: MemberProp::Ident(IdentName::new(atom!("exports"), DUMMY_SP)),
            }
            .into(),
            right: expr,
        }
        .into(),
    }
    .into();

    Ok(Module {
        span: DUMMY_SP,
        body: vec![export],
        shebang: None,
    })
}
