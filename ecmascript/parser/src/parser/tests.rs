use crate::test_parser;
use swc_common::BytePos;
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

#[test]
fn issue_1813() {
    test_parser(
        "\\u{cccccccccsccccccQcXt[uc(~).const[uctor().const[uctor())tbr())",
        Default::default(),
        |p| {
            p.parse_program().expect_err("should fail");

            Ok(())
        },
    )
}

fn parse_module_export_named_span() {
    let m = module("export function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { span, .. })) = &m.body[0] {
        assert_eq!(span.lo, BytePos(0));
    } else {
        panic!("expected ExportDecl");
    }
}

#[test]
fn parse_module_export_default_fn_span() {
    let m = module("export default function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(0));
        assert_eq!(span.hi, BytePos(32));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_async_fn_span() {
    let m = module("export default async function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(0));
        assert_eq!(span.hi, BytePos(38));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_class_span() {
    let m = module("export default class Foo {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(0));
        assert_eq!(span.hi, BytePos(27));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn issue_1878() {
    use super::*;
    use crate::TsConfig;
    use swc_common::comments::SingleThreadedComments;

    // file with only comments should have the comments
    // in the leading map instead of the trailing
    {
        let c = SingleThreadedComments::default();
        let s = "
            // test
        ";
        let _ = super::test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
        assert!(leading.borrow().get(&BytePos(0)).is_some());
    }

    // file with shebang and comments should still work with the comments trailing
    // the shebang
    {
        let c = SingleThreadedComments::default();
        let s = "#!/foo/bar
            // test
        ";
        let _ = super::test_parser_comment(
            &c,
            s,
            Syntax::Typescript(TsConfig {
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        );

        let (leading, trailing) = c.take_all();
        assert!(leading.borrow().is_empty());
        assert_eq!(trailing.borrow().len(), 1);
        assert!(trailing.borrow().get(&BytePos(10)).is_some());
    }
}
