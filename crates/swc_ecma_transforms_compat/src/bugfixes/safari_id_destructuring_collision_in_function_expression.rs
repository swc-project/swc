use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, VisitMut, as_folder, noop_visit_mut_type};

pub fn safari_id_destructuring_collision_in_function_expression() -> impl Fold + VisitMut {
    as_folder(SafariIdDestructuringCollisionInFunctionExpression)
}

struct SafariIdDestructuringCollisionInFunctionExpression;


impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        basic,
        "(function a ([a]) {})",
        "(function a ([a]) {})"
    );
}
