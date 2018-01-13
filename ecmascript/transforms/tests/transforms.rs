extern crate swc_common;
extern crate swc_ecma_ast as ast;
extern crate swc_ecma_parser;
extern crate swc_ecma_transforms as transforms;
#[macro_use]
extern crate testing;

use swc_common::fold::Folder;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::parser::Parser;
use testing::logger;
use transforms::simplify::Simplify;

macro_rules! parse {
    ($s:expr) => {{
        let l = logger();
        Parser::new_for_module(l.clone(), Lexer::new_from_str(l, $s))
            .parse_module()
            .unwrap_or_else(|err| panic!("failed to parse module: {:?}", err))
    }};
}

fn fold<T, F>(t: T, mut f: F) -> T
where
    F: Folder<T>,
{
    f.fold(t)
}

#[test]
fn add_simple() {
    assert_eq_ignore_span!(fold(parse!("use(3 + 6)"), Simplify), parse!("use(9)"))
}

#[test]
fn cond_simple() {
    assert_eq_ignore_span!(
        fold(parse!("use(true ? 3 : 6)"), Simplify),
        parse!("use(3)")
    );
    assert_eq_ignore_span!(
        fold(parse!("use(false ? 3 : 6)"), Simplify),
        parse!("use(6)")
    );
}

#[test]
fn cond_side_effect() {
    assert_eq_ignore_span!(
        fold(parse!("new UnknownClass() ? 3 : 6"), Simplify),
        parse!("new UnknownClass(), 3")
    );
    assert_eq_ignore_span!(
        fold(parse!("(void fn()) ? 3 : 6"), Simplify),
        parse!("(void fn()), 6")
    );
}

#[test]
fn oror_non_bool() {
    assert_eq_ignore_span!(fold(parse!("use(5 || 50)"), Simplify), parse!("use(5)"))
}
