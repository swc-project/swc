#[cfg(test)]
mod tests {
    use crate::{EsSyntax, Syntax};

    #[test]
    fn test_legacy_decorator() {
        crate::test_parser(
            "@foo
export default class Foo {
  bar() {
    class Baz {}
  }
}",
            Syntax::Es(EsSyntax {
                decorators: true,
                decorators_before_export: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }
}
