use crate::test_parser;
use swc_ecma_ast::*;

fn program(src: &'static str) -> Program {
    test_parser(src, Default::default(), |p| p.parse_program())
}

/// Assert that Parser.parse_program returns [Program::Module].
fn module(src: &'static str) -> Module {
    program(src).expect_module()
}

/// Assert that Parser.parse_program returns [Program::Script].
fn script(src: &'static str) -> Script {
    program(src).expect_script()
}

/// Assert that Parser.parse_program returns [Program::Module] and has errors.
#[track_caller]
fn assert_module_error(src: &'static str) -> Module {
    test_parser(src, Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_ne!(errors, vec![]);

        let module = program.expect_module();

        Ok(module)
    })
}

#[test]
fn parse_program_module_01() {
    module("import 'foo';");
    module("export const a = 1;");
}

#[test]
fn parse_program_script_01() {
    script("let a = 5;");
    script("function foo() {}");
    script("const a = 00176;");
}

#[test]
fn parse_program_module_02() {
    module(
        "
        function foo() {}
        export default foo;
        ",
    );
    module(
        "
        export function foo() {}
        export default foo;
        ",
    );
}

#[test]
fn parse_program_module_error_01() {
    assert_module_error(
        "
        const a = 01234;
        export default a;
        ",
    );
}
