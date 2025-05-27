#![expect(clippy::print_stdout)]

use swc_ecma_regexp::{LiteralParser, Options};
use swc_ecma_regexp_ast::*;
use swc_ecma_regexp_visit::{Visit, VisitWith};

struct TestVisitor;

impl Visit for TestVisitor {
    fn visit_capturing_group(&mut self, node: &CapturingGroup) {
        println!("Visiting capturing group: {node:?}");
        node.visit_children_with(self);
    }
}

fn main() {
    let source_text = r"(https?:\/\/github\.com\/(([^\s]+)\/([^\s]+))\/([^\s]+\/)?(issues|pull)\/([0-9]+))|(([^\s]+)\/([^\s]+))?#([1-9][0-9]*)($|[\s\:\;\-\(\=])";

    let parser = LiteralParser::new(source_text, None, Options::default());
    let pattern = parser.parse().unwrap();

    let mut visitor = TestVisitor;
    visitor.visit_pattern(&pattern);
}
