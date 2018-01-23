#[cfg(test)]
pub(crate) fn parse(name: &'static str, src: &'static str) -> ::swc_ecma_ast::Module {
    use std::rc::Rc;
    use swc_common::FileName;
    use swc_common::errors::{CodeMap, FilePathMapping};
    use swc_ecma_parser::{CharIndices, Parser, Session};

    let cm = Rc::new(CodeMap::new(FilePathMapping::empty()));
    cm.new_filemap_and_lines(FileName::Real(name.into()), src.into());

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
        let mut p = Parser::new(sess, CharIndices(src.char_indices()));
        p.parse_module().unwrap_or_else(|err| {
            err.emit();
            panic!("failed to parse")
        })
    };

    module
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            let _module = $crate::macros::parse(stringify!($test_name), $input);
            let _expected_module = $crate::macros::parse(stringify!($test_name), $expected);
        }
    };
}

#[cfg(test)]

macro_rules! test_exec {
    ($tr:expr, $test_name:ident, $src:expr) => {
        #[test]
        fn $test_name() {
            let _module = $crate::macros::parse(stringify!($test_name), $src);

        }
    }
}
