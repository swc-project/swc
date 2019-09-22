use crate::pass::Pass;
use ast::*;
use swc_common::Fold;

struct OptionalCatchBinding;

pub fn optional_catch_binding() -> impl Pass {
    OptionalCatchBinding
}

impl Fold<CatchClause> for OptionalCatchBinding {
    fn fold(&mut self, cc: CatchClause) -> CatchClause {
        if cc.param.is_some() {
            return cc;
        }

        CatchClause {
            param: Some(private_ident!("e").into()),
            ..cc
        }
    }
}

#[cfg(test)]
mod tests {
    use super::optional_catch_binding as tr;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| tr(),
        issue_411,
        "try {} catch {}",
        "try {} catch(e) {}"
    );
}
