pub use self::input::Input;
use nom::IResult;
use swc_css_ast::*;

pub type PResult<'a, T> = IResult<T, Input<'a>>;

mod input;

pub fn parse(s: Input) -> PResult<Stylesheet> {
    unimplemented!("parse")
}

pub fn parse_rule(s: Input) -> PResult<Rule> {
    unimplemented!("parse_rule")
}

pub fn parse_at_rule(s: Input) -> PResult<AtRule> {
    unimplemented!("parse_at_rule")
}

pub fn parse_style_rule(s: Input) -> PResult<StyleRule> {
    unimplemented!("parse_style_rule")
}
