#![allow(clippy::unit_arg)]

use swc_common::{comments::NoopComments, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::generator::generator;
use swc_ecma_transforms_testing::test;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        generator(unresolved_mark, NoopComments),
    )
}

test!(
    syntax(),
    |_| tr(Default::default()),
    sparse_array_leading_hole,
    r#"
function* gen() {
    yield [, 'hello'];
}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    sparse_array_middle_hole,
    r#"
function* gen() {
    yield ['start', , 'end'];
}
"#
);
