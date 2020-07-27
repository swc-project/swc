use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

struct OptionalCatchBinding;

noop_fold_type!(OptionalCatchBinding);

pub fn optional_catch_binding() -> impl Fold {
    OptionalCatchBinding
}

impl Fold for OptionalCatchBinding {
    fn fold_catch_clause(&mut self, mut cc: CatchClause) -> CatchClause {
        cc = cc.fold_children_with(self);

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
