use super::strip;

macro_rules! to {
    ($name:ident, $from:expr, $to:expr) => {
        test!(
            ::swc_ecma_parser::Syntax::Typescript(Default::default()),
            |_| strip(),
            $name,
            $from,
            $to
        );
    };
}

to!(
    constructor_01,
    "class Foo {
    constructor(public readonly foo) {}
}",
    "class Foo {
    constructor(foo) {
        this.foo = foo;
    }
}"
);

to!(
    constructor_02,
    "class Foo {
    constructor(readonly foo) {
        this.bar = 1;
    }
}",
    "class Foo {
    constructor(foo) {
        this.foo = foo;
        this.bar = 1;
    }
}"
);

to!(export_import, "export import A = B", "export { B as A }");

to!(export_equals, "export = Foo", "export default Foo");

to!(
    issue_196_01,
    "export type Link = { key: string; text: string };",
    ""
);

to!(
    issue_196_02,
    "type Link = { key: string; text: string };
export { Link };",
    ""
);

to!(
    issue_196_03,
    "type Link = { key: string; text: string };
const Link = 'Boo';
export { Link };",
    "const Link = 'Boo';
export { Link };"
);

// TODO: Test function / variable hoisting

to!(
    issue_179_01,
    "import {Types} from 'other';
const a: Types.foo = {};",
    "import 'other';
const a = {};"
);

to!(
    issue_179_02,
    "import {Types} from 'other';
const a: Types = Types.foo;",
    "import {Types} from 'other';
const a = Types.foo;"
);
