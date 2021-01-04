use super::*;
use swc_common::{sync::Lrc, FilePathMapping};
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;

fn tr() -> impl Fold {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    jsx_src(true, cm)
}

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(),
    basic_sample,
    r#"
var actual = transform(
  'var x = <sometag />',
  Object.assign({}, opts, { filename: '/fake/path/mock.js' })
).code;

var expected = multiline([
  'var _jsxFileName = "/fake/path/mock.js";',
  'var x = <sometag __source={{',
  '  fileName: _jsxFileName,',
  '  lineNumber: 1',
  '}} />;',
]);

expect(actual).toBe(expected);
"#
);

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(),
    no_jsx,
    r#"var x = 42;"#,
    r#"var x = 42;"#
);

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(),
    with_source,
    r#"
var actual = transform(
  'var x = <sometag __source="custom" />;',
  Object.assign({}, opts, { filename: '/fake/path/mock.js' })
).code;

var expected = 'var x = <sometag __source="custom" />;';

expect(actual).toBe(expected);
"#
);
