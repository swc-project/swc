use swc_common::{Span, Spanned};
use swc_ecma_ast::FnDecl;

use crate::{Modification, TextEdit};

pub fn prepend_stmt(f: &FnDecl, stmt: &str) -> Modification {
    let body = f.function.body.as_ref().unwrap();

    if body.stmts.is_empty() {
        return Modification {
            edits: vec![TextEdit {
                span: body.span,
                new_text: format!("{{\n{}\n}}", stmt),
            }],
        };
    }

    let first = &body.stmts[0];

    Modification {
        edits: vec![TextEdit {
            span: Span::new(body.span.lo, first.span().lo, Default::default()),
            new_text: format!("{{\n{}\n", stmt),
        }],
    }
}
