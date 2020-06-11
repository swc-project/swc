use swc::{config::Options, Compiler};
use swc_common::FileName;
use testing::Tester;

fn compile(src: &str, options: Options) -> String {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), handler);

            let fm = cm.new_source_file(FileName::Real("input.js".into()), src.into());
            let s = c.process_js_file(
                fm,
                &Options {
                    is_module: true,
                    ..options
                },
            );

            match s {
                Ok(v) => {
                    if c.handler.has_errors() {
                        Err(())
                    } else {
                        Ok(v.code.into())
                    }
                }
                Err(err) => panic!("Error: {}", err),
            }
        })
        .unwrap()
}

#[test]
fn issue_834_1() {
    compile(
        "var foo =  2n + 7n;",
        Options {
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn issue_834_2() {
    compile(
        "var ano = { some: {
	ne:  {

	}
}};
var foo = ano.some.ne?.sdf?.snop;
const someValue = 'test' ?? 'default value';",
        Options {
            swcrc: false,
            ..Default::default()
        },
    );
}
