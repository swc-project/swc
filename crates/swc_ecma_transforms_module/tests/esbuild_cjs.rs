use swc_ecma_parser::Syntax;
use swc_ecma_transforms_module::esbuild_cjs::cjs;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Fold {
    cjs()
}

test!(
    syntax(),
    |_| tr(),
    strip,
    "import foo from 'foo';
import bar from '../foo';
foo, bar

export const a = 1;

export function foo () {}
export class bar {}

export default function foo () {}
export default class bar {}

export default function () {}
export default class {}

export default foo;
export default 1;
",
    "
foo, bar;

const a = 1;

function foo() {}
class bar {}

function foo() {}
class bar {}

function _default() {}
class _default1 {}

var _default2 = foo;
var _default3 = 1;
"
);
