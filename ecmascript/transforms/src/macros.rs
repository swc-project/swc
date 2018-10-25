#[cfg(test)]
pub(crate) fn parse(name: &'static str, src: &'static str) -> ::swc_ecma_ast::Module {
    use std::rc::Rc;
    use swc_common::{FileName, FilePathMapping, SourceFile, SourceMap};
    use swc_ecma_parser::{Parser, Session, SourceFileInput};

    let cm = Rc::new(SourceMap::new(FilePathMapping::empty()));
    let fm = cm.new_source_file(FileName::Real(name.into()), src.into());

    let handler = ::swc_common::errors::Handler::with_tty_emitter(
        ::swc_common::errors::ColorConfig::Auto,
        true,
        false,
        Some(cm),
    );
    let logger = ::testing::logger().new(o!("src" => src));

    let sess = Session {
        handler: &handler,
        logger: &logger,
        cfg: Default::default(),
    };

    let module = {
        let mut p = Parser::new(sess, SourceFileInput::from(&*fm));
        p.parse_module().unwrap_or_else(|err| {
            err.emit();
            panic!("failed to parse")
        })
    };
    println!("parsed {} as a module", src);

    module
}

#[cfg(test)]
pub fn fold<F>(module: ::swc_ecma_ast::Module, f: &mut F) -> ::swc_ecma_ast::Module
where
    F: ::swc_common::Folder<::swc_ecma_ast::Module>,
{
    f.fold(module)
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            let module = $crate::macros::parse(stringify!($test_name), $input);
            let expected_module = $crate::macros::parse(stringify!($test_name), $expected);

            let module = $crate::macros::fold(module, &mut $tr);
            let expected_module = expected_module;

            assert_eq_ignore_span!(module, expected_module);
        }
    };
}

#[cfg(test)]

macro_rules! test_exec {
    ($tr:expr, $test_name:ident, $src:expr) => {
        #[test]
        fn $test_name() {
            let _ = $tr;

            let _module = $crate::macros::parse(stringify!($test_name), $src);
        }
    };
}
