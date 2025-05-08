use swc_ecma_ast::Ident;

use super::{PResult, Parser};

/// If `required` is `true`, this never returns `None`.
pub fn parse_maybe_opt_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    required: bool,
    disallow_let: bool,
) -> PResult<Option<Ident>> {
    if required {
        p.parse_binding_ident(disallow_let).map(|v| v.id).map(Some)
    } else {
        p.parse_opt_binding_ident(disallow_let)
            .map(|v| v.map(|v| v.id))
    }
}
