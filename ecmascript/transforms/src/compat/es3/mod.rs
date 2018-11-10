use swc_common::Fold;
use swc_ecma_ast::Module;

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

pub fn es3() -> impl Fold<Module> {
    self::prop_lits::PropertyLiteral
}
