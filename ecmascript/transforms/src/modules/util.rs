use crate::util::ExprFactory;
use ast::*;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;

pub(super) fn make_require_call(src: JsWord) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("require").as_callee(),
        args: vec![Lit::Str(Str {
            span: DUMMY_SP,
            value: src,
            has_escape: false,
        })
        .as_arg()],

        type_args: Default::default(),
    })
}

pub(super) fn local_name_for_src(src: &Str) -> JsWord {
    if !src.value.contains("/") {
        return format!("_{}", src.value).into();
    }

    unimplemented!()
}
