extern crate swc_malloc;

use codspeed_criterion_compat::black_box;
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

fn bench_module(syntax: Syntax, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let comments = SingleThreadedComments::default();
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        let _ = black_box({
            let lexer = Lexer::new(
                syntax,
                Default::default(),
                StringInput::from(&*fm),
                Some(&comments),
            );
            let mut parser = Parser::new_from(lexer);
            parser.parse_module()
        });

        Ok(())
    });
}

#[test]
fn test_1() {
    bench_module(Default::default(), include_str!("../colors.js"));
}
