use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, JSXKind, Syntax};
use swc_ecma_transforms_testing::test_transform;
use swc_ecma_visit::Fold;

struct Panicking;

impl Fold for Panicking {
    fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
        let JSXOpeningElement { name, .. } = &node;
        println!("HMM");

        if let JSXElementName::Ident(Ident { sym, .. }) = name {
            panic!("visited: {}", sym)
        }

        JSXOpeningElement { ..node }
    }
}

#[test]
#[should_panic = "visited"]
fn ensure_visited() {
    test_transform(
        Syntax::Es(EsConfig {
            jsx: JSXKind::Bool(true),
            ..Default::default()
        }),
        |_| Panicking,
        "
        import React from 'react';
        const comp = () => <amp-something className='something' />;
        ",
        "
        import React from 'react';
        const comp = () => <amp-something className='something' />;
        ",
        false,
    );
}
