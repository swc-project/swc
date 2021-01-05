use super::*;
use swc_ecma_transforms_testing::test;

fn tr() -> impl Fold {
    display_name()
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    assignment_expression,
    r#"
foo = createReactClass({});
bar = React.createClass({});
"#,
    r#"
foo = createReactClass({
    displayName: "foo"
});
bar = React.createClass({
    displayName: "bar"
});
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    nested,
    r#"
var foo = qux(createReactClass({}));
var bar = qux(React.createClass({}));
"#,
    r#"
var foo = qux(createReactClass({
    displayName: "foo"
}));
var bar = qux(React.createClass({
    displayName: "bar"
}));
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    object_property,
    r#"
({
    foo: createReactClass({})
});
({
    bar: React.createClass({})
});
"#,
    r#"
({
    foo: createReactClass({
        displayName: "foo"
    })
});
({
    bar: React.createClass({
        displayName: "bar"
    })
});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    variable_declarator,
    r#"
var foo = createReactClass({});
var bar = React.createClass({});
"#,
    r#"
var foo = createReactClass({
    displayName: "foo"
});
var bar = React.createClass({
    displayName: "bar"
});
"#
);
