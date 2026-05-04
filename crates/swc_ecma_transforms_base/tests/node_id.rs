use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::{Visit, VisitMutWith, VisitWith};
use testing::run_test2;

fn resolved_program(src: &str) -> Program {
    run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(swc_common::FileName::Anon.into(), src.to_string());
        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let mut program = parser
            .parse_program()
            .map_err(|err| err.into_diagnostic(&handler).emit())?;

        program.visit_mut_with(&mut resolver(Mark::new(), Mark::new(), false));

        Ok(program)
    })
    .unwrap()
}

struct Recorder {
    lines: Vec<String>,
}

impl Recorder {
    fn record_node(&mut self, kind: &str, id: NodeId) {
        self.lines.push(format!("{kind} node={}", id.as_u32()));
    }

    fn record_ident(&mut self, ident: &Ident) {
        let ctxt = if ident.ctxt == SyntaxContext::empty() {
            "empty".to_string()
        } else {
            format!("{:?}", ident.ctxt).replace('#', "")
        };

        self.lines.push(format!(
            "ident {} scope={} ctxt={ctxt}",
            ident.sym,
            ident.scope_id.as_u32()
        ));
    }
}

impl Visit for Recorder {
    fn visit_module(&mut self, node: &Module) {
        self.record_node("module", node.node_id);
        node.visit_children_with(self);
    }

    fn visit_function(&mut self, node: &Function) {
        self.record_node("function", node.node_id);
        node.visit_children_with(self);
    }

    fn visit_block_stmt(&mut self, node: &BlockStmt) {
        self.record_node("block", node.node_id);
        node.visit_children_with(self);
    }

    fn visit_ident(&mut self, node: &Ident) {
        self.record_ident(node);
    }
}

#[test]
fn resolver_assigns_stable_node_and_scope_ids() {
    let program = resolved_program(
        r#"
export function outer(a) {
    let b = a;
    {
        let a = b;
        c(a);
    }
}
"#,
    );

    let mut recorder = Recorder { lines: Vec::new() };
    program.visit_with(&mut recorder);

    assert_eq!(
        recorder.lines.join("\n"),
        "\
module node=1
ident outer scope=1 ctxt=2
function node=2
ident a scope=2 ctxt=3
block node=3
ident b scope=2 ctxt=3
ident a scope=2 ctxt=3
block node=4
ident a scope=4 ctxt=4
ident b scope=2 ctxt=3
ident c scope=4294967295 ctxt=1
ident a scope=4 ctxt=4"
    );
}
