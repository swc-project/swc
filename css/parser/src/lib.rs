pub use self::input::Input;
use nom::{
    bytes::complete::{tag, take_while, take_while1},
    multi::many0,
    IResult,
};
use selectors::parse_selectors;
use swc_css_ast::*;
use util::{span, take_ws, PResultExt};

pub type PResult<'a, T> = IResult<Input<'a>, T>;

mod input;
mod selectors;
mod util;

pub fn parse(i: Input) -> PResult<Stylesheet> {
    let start = i.start_pos();

    let (i, rules) = many0(parse_rule)(i)?;

    Ok((
        i,
        Stylesheet {
            span: span(i, start),
            rules,
        },
    ))
}

fn parse_rule(i: Input) -> PResult<Rule> {
    if i.starts_with('@') {
        return parse_at_rule(i).map_from();
    }

    parse_style_rule(i).map_from()
}

fn parse_at_rule(i: Input) -> PResult<AtRule> {
    let start = i.start_pos();
    let (i, _) = tag("@")(i)?;

    let (i, id) = take_while(|c: char| c.is_alphabetic())(i).map_from()?;
    let (i, _) = take_ws(i)?;

    let (i, text) = take_while(|c| c != ';')(i).map_from()?;

    Ok((
        i,
        AtRule {
            span: span(i, start),
            id,
            text,
        },
    ))
}

fn parse_style_rule(i: Input) -> PResult<StyleRule> {
    let start = i.start_pos();

    let (i, selectors) = parse_selectors(i)?;

    let (i, _) = tag("{")(i)?;

    let (i, properties) = many0(parse_property)(i)?;

    let (i, _) = tag("}")(i)?;

    Ok((
        i,
        StyleRule {
            span: span(i, start),
            selectors,
            properties,
        },
    ))
}

fn parse_property(i: Input) -> PResult<Property> {}
