use swc_ecma_ast::*;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_testing::test_transform;
use swc_ecma_visit::{fold_pass, Fold};

struct Panicking;

impl Fold for Panicking {
    fn fold_jsx_opening_element(&mut self, node: JSXOpeningElement) -> JSXOpeningElement {
        let JSXOpeningElement { name, .. } = &node;
        println!("HMM");

        if let JSXElementName::Ident(Ident { sym, .. }) = name {
            panic!("visited: {}", sym)
        }

        node
    }
}

#[test]
#[should_panic = "visited"]
fn ensure_visited() {
    test_transform(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        None,
        |_| fold_pass(Panicking),
        "
        import React from 'react';
        const comp = () => <amp-something className='something' />;
        ",
        "
        import React from 'react';
        const comp = () => <amp-something className='something' />;
        ",
    );
}
