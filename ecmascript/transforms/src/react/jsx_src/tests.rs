use super::*;

fn tr() -> impl Fold<Module> {
    jsx_src(true)
}

test_exec!(
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

test!(tr(), no_jsx, r#"var x = 42;"#, r#"var x = 42;"#);

test_exec!(
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
